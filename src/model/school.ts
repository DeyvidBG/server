import { IdType } from './shared-types'

class School {
  constructor(
    public id: IdType,
    public name: string,
    public welcomeText: string,
    public principalId: IdType,
    public principalEmail: string,
    public vicePrincipalId: IdType,
    public vicePrincipalEmail: string,
    public country: string,
    public city: string,
    public zipCode: string,
    public streetAddress: string,
    public website: string,
    public isVerified: 0 | 1
  ) {}
}

export { School }
