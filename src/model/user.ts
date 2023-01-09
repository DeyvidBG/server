import { IdType, Gender, Role } from './shared-types'

class User {
  constructor(
    public id: IdType,
    public firstName: string,
    public middleName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public phoneNumber: string,
    public birthDate: Date,
    public gender: Gender,
    public role: Role
  ) {}
}

export default User
