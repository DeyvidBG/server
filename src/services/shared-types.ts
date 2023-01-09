export interface Identifiable<K> {
  id: K
}

export type IdType = number | undefined

export enum Gender {
  Man = 1,
  Woman,
}

export enum Role {
  Student = 1,
  Parent,
  Teacher,
  Principal,
  Admin,
}
