import { Identifiable } from '../model/shared-types'
import { IRepository } from './shared-types'
import { tryCatchWrapper } from '../utils'
import { BaseRepository } from '.'

export interface ISubjectRepository<K, V extends Identifiable<K>>
  extends IRepository<K, V> {}

class SubjectRepository<K, V extends Identifiable<K>>
  extends BaseRepository<K, V>
  implements ISubjectRepository<K, V>
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
    return super.create(entityWithoutId, SubjectRepository.CREATE_QUERY)
  }

  async getAll(): Promise<V[]> {
    return super.getAll(SubjectRepository.GET_ALL_QUERY)
  }

  async getById(id: K): Promise<V> {
    return super.getById(id, SubjectRepository.GET_BY_ID)
  }

  async update(entityWithOutId: V, id: K): Promise<boolean> {
    return super.update(entityWithOutId, id, SubjectRepository.UPDATE_QUERY)
  }

  async delete(id: K): Promise<boolean> {
    return super.delete(id, SubjectRepository.DELETE_QUERY)
  }
}

export default SubjectRepository
