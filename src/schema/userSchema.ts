import * as yup from 'yup'

const userSchema = yup.object({
  body: yup.object({
    firstName: yup
      .string()
      .max(25, 'First name too long.')
      .required('This field is required!'),
    middleName: yup
      .string()
      .max(25, 'Middle name too long.')
      .required('This field is required!'),
    lastName: yup
      .string()
      .max(25, 'Last name too long.')
      .required('This field is required!'),
    email: yup
      .string()
      .email()
      .max(50, 'Email too long.')
      .required('This field is required!'),
    password: yup
      .string()
      .min(8, 'Password too short.')
      .max(10, 'Password too long.')
      .test(
        'isValidPass',
        'Password should contain at least one character from the groups A-Z, a-z, 0-9 and !@#%&',
        (value, context) => {
          const hasUpperCase = /[A-Z]/.test(value!)
          const hasLowerCase = /[a-z]/.test(value!)
          const hasNumber = /[0-9]/.test(value!)
          const hasSymbole = /[!@#%&]/.test(value!)
          let validConditions = 0
          const numberOfMustBeValidConditions = 4
          const conditions = [hasLowerCase, hasUpperCase, hasNumber, hasSymbole]
          conditions.forEach((condition) =>
            condition ? validConditions++ : null
          )
          if (validConditions >= numberOfMustBeValidConditions) {
            return true
          }
          return false
        }
      )
      .required('This field is required!'),
    phoneNumber: yup.string().max(50).required('This field is required!'),
    birthDate: yup
      .date()
      .typeError('Please provide a valid date!')
      .required('This field is required!'),
  }),
})

const userSignInSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .email()
      .max(50, 'Email too long.')
      .required('This field is required!'),
    password: yup
      .string()
      .min(8, 'Password too short.')
      .max(10, 'Password too long.')
      .test(
        'isValidPass',
        'Password should contain at least one character from the groups A-Z, a-z, 0-9 and !@#%&',
        (value, context) => {
          const hasUpperCase = /[A-Z]/.test(value!)
          const hasLowerCase = /[a-z]/.test(value!)
          const hasNumber = /[0-9]/.test(value!)
          const hasSymbole = /[!@#%&]/.test(value!)
          let validConditions = 0
          const numberOfMustBeValidConditions = 4
          const conditions = [hasLowerCase, hasUpperCase, hasNumber, hasSymbole]
          conditions.forEach((condition) =>
            condition ? validConditions++ : null
          )
          if (validConditions >= numberOfMustBeValidConditions) {
            return true
          }
          return false
        }
      )
      .required('This field is required!'),
  }),
})

const userIdSchema = yup.object({
  params: yup.object({
    userId: yup
      .string()
      .test(
        'Is it a digit?',
        'The id should contain only digits.',
        (value, context) => {
          return /^\d+$/.test(value)
        }
      )
      .required(),
  }),
})

export { userSchema, userSignInSchema, userIdSchema }
