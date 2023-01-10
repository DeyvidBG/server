import { Identifiable } from '../model/shared-types'

export interface IRepository<K, V extends Identifiable<K>> {
  create(entityWithoutId: Partial<V>, sqlQuery?: string): Promise<K>
  getAll(sqlQuery?: string): Promise<V[]>
  getById(id: K, sqlQuery?: string): Promise<V>
  update(
    entityWithoutId: Partial<V>,
    id: K,
    sqlQuery?: string
  ): Promise<boolean>
  delete(id: K, sqlQuery?: string): Promise<boolean>
}
