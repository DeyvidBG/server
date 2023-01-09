import { Identifiable } from '../model/shared-types'
import { QueryExecutor } from './QueryExecutor'
import { IAPI } from './shared-types'
import { tryCatchWrapper } from '../utils'
import { BaseAPI } from '.'

export interface IUserAPI<K, V extends Identifiable<K>> extends IAPI<K, V> {
  getByEmail(email: Partial<V>): Promise<V>
  checkIfEmailExists(email: Partial<V>): Promise<boolean>
}

class UserAPI<K, V extends Identifiable<K>>
  extends BaseAPI<K, V>
  implements IUserAPI<K, V>
{
  constructor() {
    super()
  }

  private static readonly CREATE_QUERY =
    'INSERT INTO users (first_name, middle_name, last_name, email, password, phone_number, birth_date, gender, role) VALUES (?,?,?,?,?,?,?,?,?)'
  private static readonly GET_ALL_QUERY =
    'SELECT first_name AS firstName, middle_name AS middleName, last_name AS lastName, email, password, phone_number AS phoneNumber, birth_date AS birthDate, gender, role FROM users'
  private static readonly GET_BY_ID =
    'SELECT first_name AS firstName, middle_name AS middleName, last_name AS lastName, email, password, phone_number AS phoneNumber, birth_date AS birthDate, gender, role FROM users WHERE id = ?'
  private static readonly UPDATE_QUERY =
    'UPDATE users SET first_name = ?, middle_name = ?, last_name = ?, email = ?, password = ?, phone_number = ?, birth_date = ?, gender = ?, role = ? WHERE id = ?'
  private static readonly DELETE_QUERY = 'DELETE FROM users WHERE id = ?'

  // Basic CRUD operations

  async create(entityWithoutId: Omit<V, 'id'>): Promise<K> {
    return super.create(entityWithoutId, UserAPI.CREATE_QUERY)
  }

  async getAll(): Promise<V[]> {
    return super.getAll(UserAPI.GET_ALL_QUERY)
  }

  async getById(id: K): Promise<V> {
    return super.getById(id, UserAPI.GET_BY_ID)
  }

  async update(entityWithOutId: V, id: K): Promise<boolean> {
    return super.update(entityWithOutId, id, UserAPI.UPDATE_QUERY)
  }

  async delete(id: K): Promise<boolean> {
    return super.delete(id, UserAPI.DELETE_QUERY)
  }

  // Extended CRUD operations

  async getByEmail(email: Partial<V>): Promise<V> {
    return tryCatchWrapper<V>(async () => {
      const result = await this.handleSQLQuery(
        'SELECT first_name AS firstName, middle_name AS middleName, last_name AS lastName, email, password, phone_number AS phoneNumber, birth_date AS birthDate, gender, role FROM users WHERE email = ?',
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
}

export default UserAPI
