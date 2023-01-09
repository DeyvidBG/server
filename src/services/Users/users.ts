import pool from '../db'
import { User, UserDTO } from './User'
import { Identifiable, IdType } from './../shared-types'
import { tryCatchWrapper } from '../../utils'

export interface UserApiInterface<K, V extends Identifiable<K>> {
  getAll(): Promise<V[]>
  getUserById(id: K): Promise<V>
  create(entityWithoutId: Omit<V, 'id'>): Promise<K>
  checkEmail(email: keyof V): Promise<boolean>
  getByEmail(email: keyof V): Promise<V[]>
  editById(entity: V): Promise<boolean>
  deleteById(id: K): Promise<boolean>
}

export class UserApi<K, V extends Identifiable<K>>
  implements UserApiInterface<K, V>
{
  async getAll(): Promise<V[]> {
    try {
      return await this.handleSQLQuery('SELECT * FROM users', [])
    } catch (error) {
      console.error(error)
    }
  }

  async getUserById(id: K): Promise<V> {
    try {
    } catch (error) {
      console.error(error)
    }
    return await this.handleSQLQuery('SELECT * FROM users WHERE id = ?', [id])
  }

  async create(entityWithoutId: Omit<V, 'id'>): Promise<K> {
    const result = await this.handleSQLQuery(
      'INSERT INTO users (firstName, middleName, lastName, email, password, phoneNumber, birthDate, gender, role) VALUES (?,?,?,?,?,?,?,?,?)',
      Object.values(entityWithoutId)
    )
    return result.insertId
  }

  async checkEmail(email: keyof V): Promise<boolean> {
    const result = await this.handleSQLQuery(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    return result.length > 0
  }

  async getByEmail(email: keyof V): Promise<V[]> {
    const result = await this.handleSQLQuery(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    return result
  }

  async editById(entity: V): Promise<boolean> {
    const result = await this.handleSQLQuery(
      'UPDATE users SET firstName = ?, middleName = ?, lastName = ?, email = ?, password = ?, phoneNumber = ?, birthNate = ?, gender = ?, role = ? WHERE id = ?',
      ...Object.values(entity)
    )
    return result.affectedRows > 0
  }

  async deleteById(id: K): Promise<boolean> {
    const result = await this.handleSQLQuery('DELETE FROM users WHERE id = ?', [
      id,
    ])
    return result.affectedRows > 0
  }

  private async handleSQLQuery(
    sql: string,
    properties?: (string | number | K | keyof V)[] // add values
  ) {
    try {
      const result = await pool.query(sql, properties)
      return result
    } catch (error) {
      throw new Error(error)
    }
  }
}
