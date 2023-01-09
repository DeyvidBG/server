import bcrypt from 'bcryptjs'

export const encryptPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  } catch (error) {
    console.error(error)
  }
}

export const checkPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash)
  } catch (error) {
    console.error(error)
  }
}

export const tryCatchWrapper = async <T>(
  func: () => Promise<T>,
  errorMessage: string = 'An error occurred'
): Promise<T> => {
  try {
    return await func()
  } catch (error) {
    console.error(errorMessage + ' Specifications: ' + error)
  }
}
