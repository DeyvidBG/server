import pool from '../db'
import { Identifiable } from '../shared-types'

export interface RoomsApiInterface<K, V extends Identifiable<K>> {
  create(entityWithOutId: Omit<V, 'id'>): Promise<V>
}

export class RoomsApi<K, V extends Identifiable<K>>
  implements RoomsApiInterface<K, V>
{
  async create(entityWithOutId: Omit<V, 'id'>): Promise<V> {
    return await this.handleSQLQuery(
      'INSERT INTO rooms (school_id, name) VALUES(?,?)',
      Object.values(entityWithOutId)
    )
  }

  private async handleSQLQuery(
    sql: string,
    properties?: (string | number | K)[]
  ) {
    try {
      const result = await pool.query(sql, properties)
      return result
    } catch (error) {
      throw new Error(error)
    }
  }
}
