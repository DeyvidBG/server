export interface Identifiable<K> {
  id: K
}

export type Time = string

export type IdType = number | undefined

export enum Gender {
  Man = 1,
  Woman,
}

export enum Role {
  User = 1,
  Student,
  Parent,
  Teacher,
  Principal,
  Admin,
}
