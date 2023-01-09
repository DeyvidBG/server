import * as yup from 'yup'

const subjectSchema = yup.object({
  body: yup.object({
    schoolId: yup
      .string()
      .test(
        'Is it a digit?',
        'The id should contain only digits.',
        (value, context) => {
          return /^\d+$/.test(value)
        }
      )
      .required(),
    name: yup.string().max(50, 'Name is too long.').required(),
    description: yup.string().max(100, 'Description is too long.').required(),
  }),
})

const subjectIdSchema = yup.object({
  params: yup.object({
    subjectId: yup
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

export { subjectSchema, subjectIdSchema }
