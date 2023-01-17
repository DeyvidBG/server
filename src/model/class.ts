import { IdType, Time } from './shared-types'

export class Class {
  constructor(
    public id: IdType,
    public teacherId: IdType,
    public groupId: IdType,
    public subjectId: IdType,
    public roomId: IdType,
    public name: string,
    public description: string,
    public date: Date,
    public startTime: Time,
    public endTime: Time
  ) {}
}
