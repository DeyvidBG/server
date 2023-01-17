import * as yup from 'yup'

export const roomSchema = yup.object({
  body: yup.object({
    name: yup
      .string()
      .max(50, 'Room name too long.')
      .required('This field is required!'),
    capacity: yup.number().required('This field is required!'),
  }),
})

export const roomIdSchema = yup.object({
  params: yup.object({
    roomId: yup
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
