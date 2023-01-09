import { Identifiable } from './shared-types'
import pool from '../db'

class SQLQueryHandler<K, V extends Identifiable<K>> {
  static async handleSQLQuery(
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
