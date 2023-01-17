import { Identifiable } from '../model/shared-types'
import { IRepository } from './shared-types'
import { tryCatchWrapper } from '../utils'
import { BaseRepository } from '.'

export interface IGroupRepository<K, V extends Identifiable<K>>
  extends IRepository<K, V> {
  getByTeacherId(id: K): Promise<V[]>
}

class GroupRepository<K, V extends Identifiable<K>>
  extends BaseRepository<K, V>
  implements IGroupRepository<K, V>
{
  constructor() {
    super()
  }

  private static readonly CREATE_QUERY =
    'INSERT INTO `groups` (name, type, teacher_id) VALUES (?,?,?)'
  private static readonly GET_ALL_QUERY =
    'SELECT `groups`.name, group_types.type, `groups`.teacher_id FROM `groups` JOIN group_types ON `groups`.type = group_types.id'
  private static readonly GET_BY_ID = `SELECT groups.name, group_types.type, groups.teacher_id
  FROM groups
  JOIN group_types ON groups.type = group_types.id WHERE groups.id = ?`
  private static readonly UPDATE_QUERY = ''
  private static readonly DELETE_QUERY = 'DELETE FROM `groups` WHERE id = ?'

  async create(entityWithoutId: Partial<V>): Promise<K> {
    return super.create(entityWithoutId, GroupRepository.CREATE_QUERY)
  }

  async getAll(): Promise<V[]> {
    return super.getAll(GroupRepository.GET_ALL_QUERY)
  }

  async getById(id: K): Promise<V> {
    return super.getById(id, GroupRepository.GET_BY_ID)
  }

  async update(entityWithOutId: Partial<V>, id: K): Promise<boolean> {
    return super.update(entityWithOutId, id, GroupRepository.UPDATE_QUERY)
  }

  async delete(id: K): Promise<boolean> {
    return super.delete(id, GroupRepository.DELETE_QUERY)
  }

  async getByTeacherId(id: K): Promise<V[]> {
    return tryCatchWrapper(async () => {
      const results = await this.handleSQLQuery(
        'WITH students_enrolled AS (SELECT group_id, COUNT(student_id) as studentsEnrolled FROM group_subscriptions GROUP BY group_id) SELECT `groups`.id, `groups`.name, `group_types`.type, `groups`.teacher_id as teacherId, COALESCE(students_enrolled.studentsEnrolled, 0) as studentsEnrolled FROM `groups` JOIN group_types ON `groups`.type = group_types.id LEFT JOIN students_enrolled ON `groups`.id = students_enrolled.group_id WHERE `groups`.teacher_id = ?',
        [id]
      )
      return results
    }, 'Error getting class.')
  }

  async deleteSubscriptions(id: K): Promise<boolean> {
    return tryCatchWrapper(async () => {
      const result = await this.handleSQLQuery(
        'DELETE FROM group_subscriptions WHERE group_id = ?',
        [id]
      )
      return result.affectedRows > 0
    }, 'Error deleting subscriptions.')
  }
}

export default GroupRepository
