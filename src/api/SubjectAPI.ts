import { Identifiable } from '../model/shared-types'
import { IAPI } from './shared-types'
import { tryCatchWrapper } from '../utils'
import { QueryExecutor } from './QueryExecutor'
import { BaseAPI } from '.'

export interface ISubjectAPI<K, V extends Identifiable<K>> extends IAPI<K, V> {}

class SubjectAPI<K, V extends Identifiable<K>>
  extends BaseAPI<K, V>
  implements ISubjectAPI<K, V>
{
  constructor() {
    super()
  }

  private static readonly CREATE_QUERY =
    'INSERT INTO subjects (school_id, name, description) VALUES (?,?,?)'
  private static readonly GET_ALL_QUERY =
    'SELECT school_id AS schoolId, name, description FROM subjects'
  private static readonly GET_BY_ID =
    'SELECT school_id AS schoolId, name, description FROM subjects WHERE id = ?'
  private static readonly UPDATE_QUERY =
    'UPDATE subjects SET school_id = ?, name = ?, description = ? WHERE id = ?'
  private static readonly DELETE_QUERY = 'DELETE FROM subjects WHERE id = ?'

  async create(entityWithoutId: Omit<V, 'id'>): Promise<K> {
    return super.create(entityWithoutId, SubjectAPI.CREATE_QUERY)
  }

  async getAll(): Promise<V[]> {
    return super.getAll(SubjectAPI.GET_ALL_QUERY)
  }

  async getById(id: K): Promise<V> {
    return super.getById(id, SubjectAPI.GET_BY_ID)
  }

  async update(entityWithOutId: V, id: K): Promise<boolean> {
    return super.update(entityWithOutId, id, SubjectAPI.UPDATE_QUERY)
  }

  async delete(id: K): Promise<boolean> {
    return super.delete(id, SubjectAPI.DELETE_QUERY)
  }
}

export default SubjectAPI
