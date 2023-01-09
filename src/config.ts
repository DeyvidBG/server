import * as dotenv from 'dotenv'
dotenv.config()

const db = {
  connectionsLimit: 10000,
  host: 'localhost',
  user: 'root',
  password: '@Dedi178@',
  database: 'schoolspace',
}

export default db
