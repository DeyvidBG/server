import { IdType } from './shared-types'

class Subject {
  constructor(
    public id: IdType,
    public schoolId: IdType,
    public name: string,
    public description: string
  ) {}
}

export default Subject
