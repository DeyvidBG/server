import { Identifiable } from '../model/shared-types'
import { tryCatchWrapper } from '../utils'
import { QueryExecutor } from './QueryExecutor'
import { IAPI } from './shared-types'

interface IBaseApi<K, V extends Identifiable<K>> extends IAPI<K, V> {}

abstract class BaseAPI<K, V extends Identifiable<K>>
  extends QueryExecutor<K, V>
  implements IBaseApi<K, V>
{
  constructor() {
    super()
  }

  async create(entityWithoutId: Omit<V, 'id'>, sqlQuery: string): Promise<K> {
    return tryCatchWrapper(async () => {
      const result = await this.handleSQLQuery(
        sqlQuery,
        Object.values(entityWithoutId)
      )
      return result.insertId
    }, 'Error creating new record.')
  }

  async getAll(sqlQuery: string): Promise<V[]> {
    return tryCatchWrapper(async () => {
      return this.handleSQLQuery(sqlQuery, [])
    }, 'Error getting all records.')
  }

  async getById(id: K, sqlQuery: string): Promise<V> {
    return tryCatchWrapper(async () => {
      const result = await this.handleSQLQuery(sqlQuery, [id])
      return result[0]
    }, 'Error getting record.')
  }

  async update(entity: V, id: K, sqlQuery: string): Promise<boolean> {
    return tryCatchWrapper(async () => {
      const result = await this.handleSQLQuery(sqlQuery, [
        ...Object.values(entity),
        id,
      ])
      return result.affectedRows > 0
    }, 'Error updating record.')
  }

  async delete(id: K, sqlQuery: string): Promise<boolean> {
    return tryCatchWrapper(async () => {
      const result = await this.handleSQLQuery(sqlQuery, [id])
      return result.affectedRows > 0
    }, 'Error deleting record.')
  }
}

export default BaseAPI
