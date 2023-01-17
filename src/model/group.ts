import { IdType, Time } from './shared-types'

export class Group {
  constructor(
    public id: IdType,
    public name: string,
    public type: string,
    public teacherId: IdType,
    public studentsEnrolled: number
  ) {}
}
