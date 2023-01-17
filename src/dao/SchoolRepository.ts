import { Identifiable } from '../model/shared-types'
import { IRepository } from './shared-types'
import { tryCatchWrapper } from '../utils'
import { BaseRepository } from '.'

export interface ISchoolRepository<K, V extends Identifiable<K>>
  extends IRepository<K, V> {
  getAllVerified(): Promise<V[]>
  getAllUnverified(): Promise<V[]>
  verifySchool(id: K): Promise<boolean>
  getTeacherStatus(teacherEmail: string, schoolId: K): Promise<any>
  assignTeacher(teacherId: K, principalId: K): Promise<boolean>
  dismissTeacher(teacherId: K): Promise<boolean>
}

class SchoolRepository<K, V extends Identifiable<K>>
  extends BaseRepository<K, V>
  implements ISchoolRepository<K, V>
{
  constructor() {
    super()
  }

  private static readonly CREATE_QUERY =
    'INSERT INTO schools (name, welcome_text, principal_id, vice_principal_id, country, city, zip_code, street_address, website, is_verified) VALUES (?,?,?,?,?,?,?,?,?,0)'
  private static readonly GET_ALL_QUERY =
    'SELECT schools.id, schools.name, schools.welcome_text AS welcomeText, CONCAT(principal.first_name," ",principal.middle_name," ",principal.last_name) AS principalName, CONCAT(vice_principal.first_name," ", vice_principal.middle_name," ",vice_principal.last_name) AS vicePrincipalName, schools.country, schools.city, schools.zip_code as zipCode, schools.street_address as streetAddress, schools.website, schools.is_verified as isVerified FROM schools LEFT JOIN users AS principal ON schools.principal_id = principal.id LEFT JOIN users AS vice_principal ON schools.vice_principal_id = vice_principal.id'
  private static readonly GET_BY_ID =
    'SELECT id, name, welcome_text AS welcomeText, principal_id AS principalId, vice_principal_id AS vicePrincipalId, country, city, zip_code as zipCode, street_address AS streetAddress, website FROM schools WHERE id = ?'
  private static readonly UPDATE_QUERY =
    'UPDATE subjects SET name = ?, welcome_text = ?, principal_id = ?, vice_principal_id = ?, country = ?, city=?, zip_code=?, street_address = ?, website = ? WHERE id = ?'
  private static readonly DELETE_QUERY = 'DELETE FROM schools WHERE id = ?'

  async create(entityWithoutId: Partial<V>): Promise<K> {
    return super.create(entityWithoutId, SchoolRepository.CREATE_QUERY)
  }

  async getAll(): Promise<V[]> {
    return super.getAll(SchoolRepository.GET_ALL_QUERY)
  }

  async getById(id: K): Promise<V> {
    return super.getById(id, SchoolRepository.GET_BY_ID)
  }

  async update(entityWithOutId: Partial<V>, id: K): Promise<boolean> {
    return super.update(entityWithOutId, id, SchoolRepository.UPDATE_QUERY)
  }

  async delete(id: K): Promise<boolean> {
    return super.delete(id, SchoolRepository.DELETE_QUERY)
  }

  // Extended CRUD

  async getAllVerified(): Promise<V[]> {
    return tryCatchWrapper<V[]>(async () => {
      const results = await this.handleSQLQuery(
        'SELECT schools.id, schools.name, schools.welcome_text AS welcomeText, CONCAT(principal.first_name," ",principal.middle_name," ",principal.last_name) AS principalName, CONCAT(vice_principal.first_name," ", vice_principal.middle_name," ",vice_principal.last_name) AS vicePrincipalName, schools.country, schools.city, schools.zip_code as zipCode, schools.street_address as streetAddress, schools.website, schools.is_verified as isVerified FROM schools LEFT JOIN users AS principal ON schools.principal_id = principal.id LEFT JOIN users AS vice_principal ON schools.vice_principal_id = vice_principal.id WHERE schools.is_verified = 1'
      )
      return results
    }, 'Error getting verified schools.')
  }

  async getAllUnverified(): Promise<V[]> {
    return tryCatchWrapper<V[]>(async () => {
      const results = await this.handleSQLQuery(
        'SELECT schools.id, schools.name, schools.welcome_text AS welcomeText, CONCAT(principal.first_name," ",principal.middle_name," ",principal.last_name) AS principalName, CONCAT(vice_principal.first_name," ", vice_principal.middle_name," ",vice_principal.last_name) AS vicePrincipalName, schools.country, schools.city, schools.zip_code as zipCode, schools.street_address as streetAddress, schools.website, schools.is_verified as isVerified FROM schools LEFT JOIN users AS principal ON schools.principal_id = principal.id LEFT JOIN users AS vice_principal ON schools.vice_principal_id = vice_principal.id WHERE schools.is_verified = 0'
      )
      return results
    }, 'Error getting unverified schools.')
  }

  async verifySchool(id: K): Promise<boolean> {
    return tryCatchWrapper<boolean>(async () => {
      const result = await this.handleSQLQuery(
        'UPDATE schools SET is_verified = 1 WHERE id = ?',
        [id]
      )
      return result.affectedRows > 0
    })
  }

  async getTeacherStatus(teacherEmail: string, principalId: K): Promise<any> {
    return tryCatchWrapper<any>(async () => {
      const result = await this.handleSQLQuery(
        `WITH teacher_school AS (
        SELECT teacher_id, school_id FROM teacher_school_subscriptions 
        WHERE teacher_id = (SELECT id FROM users WHERE email = ?)
    )
    SELECT 
        (SELECT first_name FROM users WHERE id = teacher_school.teacher_id) as firstName,
        (SELECT middle_name FROM users WHERE id = teacher_school.teacher_id) as middleName,
        (SELECT last_name FROM users WHERE id = teacher_school.teacher_id) as lastName,
        teacher_school.teacher_id as id,
        teacher_school.school_id as schoolId,
        (SELECT name FROM schools WHERE id = teacher_school.school_id) as schoolName,
        CASE 
            WHEN EXISTS (SELECT 1 FROM teacher_school) THEN 
                CASE 
                    WHEN teacher_school.school_id = (SELECT id FROM schools WHERE (principal_id = ? OR vice_principal_id = ?)) THEN 1
                    ELSE 2
                END
            ELSE 0
        END AS status
    FROM teacher_school`,
        [teacherEmail, principalId, principalId]
      )
      return result[0]
    }, 'Error getting relationship teacher school.')
  }

  async assignTeacher(teacherId: K, principalId: K): Promise<boolean> {
    return tryCatchWrapper(async () => {
      const result = await this.handleSQLQuery(
        `INSERT INTO teacher_school_subscriptions (teacher_id, school_id)
      VALUES (?, (SELECT id FROM schools WHERE (principal_id = ? OR vice_principal_id = ?)))`,
        [teacherId, principalId, principalId]
      )
      return result.insertId > 0
    }, 'Error assigning teacher.')
  }

  async dismissTeacher(id: K): Promise<boolean> {
    return tryCatchWrapper(async () => {
      const result = await this.handleSQLQuery(
        'DELETE FROM teacher_school_subscriptions WHERE teacher_id = ?',
        [id]
      )
      return result.affectedRows > 0
    }, 'Error dismissing teacher.')
  }
}

export default SchoolRepository
