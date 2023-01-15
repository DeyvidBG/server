import { Identifiable, Role } from '../model/shared-types'
import { IRepository } from './shared-types'
import { tryCatchWrapper } from '../utils'
import { BaseRepository } from '.'

export interface IUserRepository<K, V extends Identifiable<K>>
  extends IRepository<K, V> {
  getByEmail(email: Partial<V>): Promise<V>
  checkIfEmailExists(email: Partial<V>): Promise<boolean>
  updateUsersRole(id: K, role: Role): Promise<boolean>
}

class UserRepository<K, V extends Identifiable<K>>
  extends BaseRepository<K, V>
  implements IUserRepository<K, V>
{
  constructor() {
    super()
  }

  private static readonly CREATE_QUERY =
    'INSERT INTO users (first_name, middle_name, last_name, email, password, phone_number, birth_date, gender, role) VALUES (?,?,?,?,?,?,?,?,?)'
  private static readonly GET_ALL_QUERY =
    'SELECT id, first_name AS firstName, middle_name AS middleName, last_name AS lastName, email, password, phone_number AS phoneNumber, DATE_FORMAT(birth_date, "%Y-%m-%d") birthDate, gender, role FROM users'
  private static readonly GET_BY_ID =
    'SELECT id, first_name AS firstName, middle_name AS middleName, last_name AS lastName, email, password, phone_number AS phoneNumber, DATE_FORMAT(birth_date, "%Y-%m-%d") AS birthDate, gender, role FROM users WHERE id = ?'
  private static readonly UPDATE_QUERY =
    'UPDATE users SET first_name = ?, middle_name = ?, last_name = ?, email = ?, password = ?, phone_number = ?, birth_date = ?, gender = ?, role = ? WHERE id = ?'
  private static readonly DELETE_QUERY = 'DELETE FROM users WHERE id = ?'

  // Basic CRUD operations

  async create(entityWithoutId: Partial<V>): Promise<K> {
    return super.create(entityWithoutId, UserRepository.CREATE_QUERY)
  }

  async getAll(): Promise<V[]> {
    return super.getAll(UserRepository.GET_ALL_QUERY)
  }

  async getById(id: K): Promise<V> {
    return super.getById(id, UserRepository.GET_BY_ID)
  }

  async update(entityWithOutId: Partial<V>, id: K): Promise<boolean> {
    return super.update(entityWithOutId, id, UserRepository.UPDATE_QUERY)
  }

  async delete(id: K): Promise<boolean> {
    return super.delete(id, UserRepository.DELETE_QUERY)
  }

  // Extended CRUD operations

  async getByEmail(email: Partial<V>): Promise<V> {
    return tryCatchWrapper<V>(async () => {
      const result = await this.handleSQLQuery(
        'SELECT id, first_name AS firstName, middle_name AS middleName, last_name AS lastName, email, password, phone_number AS phoneNumber, birth_date AS birthDate, gender, role FROM users WHERE email = ?',
        [email]
      )
      return result[0]
    }, 'Error getting user by email.')
  }

  async checkIfEmailExists(email: Partial<V>): Promise<boolean> {
    return tryCatchWrapper<boolean>(async () => {
      const result = await this.handleSQLQuery(
        'SELECT * FROM users WHERE email = ?',
        [email]
      )
      return result.length > 0
    }, 'Error checking whether email exists or does not.')
  }

  async updateUsersRole(id: K, role: Role): Promise<boolean> {
    return tryCatchWrapper<boolean>(async () => {
      const result = await this.handleSQLQuery(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, id]
      )
      return result.affectedRows > 0
    }, 'Error updating users role.')
  }
}

export default UserRepository
