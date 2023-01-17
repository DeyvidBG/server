import { Identifiable, Role } from '../model/shared-types'
import { IRepository } from './shared-types'
import { tryCatchWrapper } from '../utils'
import { BaseRepository } from '.'

export interface IClassRepository<K, V extends Identifiable<K>>
  extends IRepository<K, V> {}

class ClassRepository<K, V extends Identifiable<K>>
  extends BaseRepository<K, V>
  implements IClassRepository<K, V>
{
  constructor() {
    super()
  }

  private static readonly CREATE_QUERY =
    'INSERT INTO classes (teacher_id, group_id, subject_id, room_id, name, description, date, start_time, end_time) VALUES (?,?,?,?,?,?,?,?,?)'
  private static readonly GET_ALL_QUERY = ''
  private static readonly GET_BY_ID = ''
  private static readonly UPDATE_QUERY = ''
  private static readonly DELETE_QUERY = 'DELETE FROM classes WHERE id = ?'

  // Basic CRUD operations

  async create(entityWithoutId: Partial<V>): Promise<K> {
    return super.create(entityWithoutId, ClassRepository.CREATE_QUERY)
  }

  async getAll(): Promise<V[]> {
    return super.getAll(ClassRepository.GET_ALL_QUERY)
  }

  async getById(id: K): Promise<V> {
    return super.getById(id, ClassRepository.GET_BY_ID)
  }

  async update(entityWithOutId: Partial<V>, id: K): Promise<boolean> {
    return super.update(entityWithOutId, id, ClassRepository.UPDATE_QUERY)
  }

  async delete(id: K): Promise<boolean> {
    return super.delete(id, ClassRepository.DELETE_QUERY)
  }
}

export default ClassRepository
