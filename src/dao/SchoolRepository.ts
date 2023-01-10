import { Identifiable } from '../model/shared-types'
import { IRepository } from './shared-types'
import { tryCatchWrapper } from '../utils'
import { BaseRepository } from '.'

export interface ISchoolRepository<K, V extends Identifiable<K>>
  extends IRepository<K, V> {}

class SchoolRepository<K, V extends Identifiable<K>>
  extends BaseRepository<K, V>
  implements ISchoolRepository<K, V>
{
  constructor() {
    super()
  }

  private static readonly CREATE_QUERY =
    'INSERT INTO schools (id, name, welcome_text, country, city, zip_code, street_address, website) VALUES (?,?,?,?,?,?,?)'
  private static readonly GET_ALL_QUERY =
    'SELECT id, name, welcome_text AS welcomeText, principal_id AS principalId, vice_principal_id AS vicePrincipalId, country, city, zip_code as zipCode, street_address AS streetAddress, website FROM schools'
  private static readonly GET_BY_ID =
    'SELECT id, name, welcome_text AS welcomeText, principal_id AS principalId, vice_principal_id AS vicePrincipalId, country, city, zip_code as zipCode, street_address AS streetAddress, website FROM schools WHERE id = ?'
  private static readonly UPDATE_QUERY =
    'UPDATE subjects SET name = ?, welcome_text = ?, principal_id = ?, vice_principal_id = ?, country = ?, city=?, zip_code=?, street_address = ?, website = ? WHERE id = ?'
  private static readonly DELETE_QUERY = 'DELETE FROM schools WHERE id = ?'

  async create(entityWithoutId: Partial<V>): Promise<K> {
    return super.create(entityWithoutId, SchoolRepository.CREATE_QUERY)
  }

  async getAll(): Promise<V[]> {
    return super.getAll(SchoolRepository.GET_ALL_QUERY)
  }

  async getById(id: K): Promise<V> {
    return super.getById(id, SchoolRepository.GET_BY_ID)
  }

  async update(entityWithOutId: Partial<V>, id: K): Promise<boolean> {
    return super.update(entityWithOutId, id, SchoolRepository.UPDATE_QUERY)
  }

  async delete(id: K): Promise<boolean> {
    return super.delete(id, SchoolRepository.DELETE_QUERY)
  }
}

export default SchoolRepository
