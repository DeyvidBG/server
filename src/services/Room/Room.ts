import { IdType } from '../shared-types'

export class RoomDTO {
  constructor(public schoolId: IdType, public name: string) {}
}

export class Room extends RoomDTO {
  constructor(public id: IdType, public schoolId: IdType, public name: string) {
    super(schoolId, name)
  }
}
