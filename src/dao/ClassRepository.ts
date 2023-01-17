import { Identifiable } from '../model/shared-types'
import { IRepository } from './shared-types'
import { tryCatchWrapper } from '../utils'
import { BaseRepository } from '.'

export interface IClassRepository<K, V extends Identifiable<K>>
  extends IRepository<K, V> {}

class ClassRepository<K, V extends Identifiable<K>>
  extends BaseRepository<K, V>
  implements IClassRepository<K, V>
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
  private static readonly DELETE_QUERY = 'DELETE FROM classes WHERE id = ?'

  async create(entityWithoutId: Partial<V>): Promise<K> {
    return super.create(entityWithoutId, ClassRepository.CREATE_QUERY)
  }

  async getAll(): Promise<V[]> {
    return super.getAll(ClassRepository.GET_ALL_QUERY)
  }

  async getById(id: K): Promise<V> {
    return super.getById(id, ClassRepository.GET_BY_ID)
  }

  async update(entityWithOutId: Partial<V>, id: K): Promise<boolean> {
    return super.update(entityWithOutId, id, ClassRepository.UPDATE_QUERY)
  }

  async delete(id: K): Promise<boolean> {
    return super.delete(id, ClassRepository.DELETE_QUERY)
  }
}

export default ClassRepository
