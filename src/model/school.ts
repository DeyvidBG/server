import { IdType } from './shared-types'

export class School {
  constructor(
    public id: IdType,
    public name: string,
    public welcomeText: string,
    public principalId: string,
    public vicePrincipalId: IdType,
    public country: string,
    public city: string,
    public zipCode: string,
    public streetAddress: string
  ) {}
}
