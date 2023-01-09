import { Identifiable } from '../model/shared-types'

export interface IAPI<K, V extends Identifiable<K>> {
  create(entityWithoutId: Omit<V, 'id'>, sqlQuery?: string): Promise<K>
  getAll(sqlQuery?: string): Promise<V[]>
  getById(id: K, sqlQuery?: string): Promise<V>
  update(entityWithoutId: V, id: K, sqlQuery?: string): Promise<boolean>
  delete(id: K, sqlQuery?: string): Promise<boolean>
}
