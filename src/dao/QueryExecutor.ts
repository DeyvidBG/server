import pool from './db'
import { Identifiable } from '../model/shared-types'
import { tryCatchWrapper } from '../utils'

export class QueryExecutor<K, V extends Identifiable<K>> {
  protected async handleSQLQuery(sql: string, values?: any[]): Promise<any> {
    return tryCatchWrapper(async () => {
      const result = await pool.query(sql, values)
      return result
    }, 'Error sending request to database.')
  }
}
