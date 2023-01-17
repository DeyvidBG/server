import * as yup from 'yup'

export const addGroupSchema = yup.object({
  body: yup.object({
    name: yup
      .string()
      .max(50, 'Room name too long.')
      .required('This field is required!'),
    type: yup.number().required('This field is required!'),
  }),
})

export const teacherIdSchema = yup.object({
  params: yup.object({
    teacherId: yup
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

export const groupIdSchema = yup.object({
  params: yup.object({
    teacherId: yup
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
