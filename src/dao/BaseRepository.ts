import { Identifiable } from '../model/shared-types'
import { tryCatchWrapper } from '../utils'
import { QueryExecutor } from './QueryExecutor'
import { IRepository } from './shared-types'

interface IBaseRepository<K, V extends Identifiable<K>>
  extends IRepository<K, V> {}

abstract class BaseRepository<K, V extends Identifiable<K>>
  extends QueryExecutor<K, V>
  implements IBaseRepository<K, V>
{
  constructor() {
    super()
  }

  async create(entityWithoutId: Partial<V>, sqlQuery: string): Promise<K> {
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

  async update(
    entityWithoutId: Partial<V>,
    id: K,
    sqlQuery: string
  ): Promise<boolean> {
    return tryCatchWrapper(async () => {
      const result = await this.handleSQLQuery(sqlQuery, [
        ...Object.values(entityWithoutId),
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

export default BaseRepository
