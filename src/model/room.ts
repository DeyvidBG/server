import { IdType } from './shared-types'

export class Room {
  constructor(
    public id: IdType,
    public schoolId: IdType,
    public name: string,
    public capacity: number
  ) {}
}
