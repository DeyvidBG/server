import { Identifiable } from '../model/shared-types'
import { IRepository } from './shared-types'
import { tryCatchWrapper } from '../utils'
import { BaseRepository } from '.'

export interface ISubjectRepository<K, V extends Identifiable<K>>
  extends IRepository<K, V> {
  getSubjectsByTeacherId(id: K): Promise<V[]>
}

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
    'SELECT schools.name AS schoolName, subjects.id, subjects.name, subjects.description FROM subjects LEFT JOIN schools ON subjects.school_id = schools.id'
  private static readonly GET_BY_ID =
    'SELECT school_id AS schoolId, name, description FROM subjects WHERE id = ?'
  private static readonly UPDATE_QUERY =
    'UPDATE subjects SET school_id = ?, name = ?, description = ? WHERE id = ?'
  private static readonly DELETE_QUERY = 'DELETE FROM subjects WHERE id = ?'

  async create(entityWithoutId: Partial<V>): Promise<K> {
    return super.create(entityWithoutId, SubjectRepository.CREATE_QUERY)
  }

  async getAll(): Promise<V[]> {
    return super.getAll(SubjectRepository.GET_ALL_QUERY)
  }

  async getById(id: K): Promise<V> {
    return super.getById(id, SubjectRepository.GET_BY_ID)
  }

  async update(entityWithOutId: Partial<V>, id: K): Promise<boolean> {
    return super.update(entityWithOutId, id, SubjectRepository.UPDATE_QUERY)
  }

  async delete(id: K): Promise<boolean> {
    return super.delete(id, SubjectRepository.DELETE_QUERY)
  }

  async getSubjectsByTeacherId(id: K): Promise<V[]> {
    return tryCatchWrapper(async () => {
      const results = await this.handleSQLQuery(
        `WITH teacher_school AS (
        SELECT school_id FROM teacher_school_subscriptions WHERE teacher_id = ?
    )
    SELECT subjects.id, subjects.name, subjects.description
    FROM subjects 
    WHERE subjects.school_id IN (SELECT school_id FROM teacher_school)`,
        [id]
      )
      return results
    }, 'Error getting subject by teacher id.')
  }
}

export default SubjectRepository
