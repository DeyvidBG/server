import * as yup from 'yup'

const schoolSchema = yup.object({
  body: yup.object({
    name: yup
      .string()
      .max(100, 'Name is too long.')
      .required('Name is required!'),
    welcomeText: yup
      .string()
      .max(1000, 'Welcome text is too long.')
      .required('Welcome text is required!'),
    principalEmail: yup
      .string()
      .email()
      .max(50, 'Email too long.')
      .required('This field is required!'),
    vicePrincipalEmail: yup
      .string()
      .email()
      .max(50, 'Email is too long.')
      .required('This field is required!'),
    country: yup
      .string()
      .max(100, 'Name of country is too long.')
      .required('This field is required!'),
    city: yup
      .string()
      .max(50, 'Name of city is too long.')
      .required('This field is required!'),
    zipCode: yup
      .string()
      .max(4, 'Zip code is too long.')
      .required('This field is required!'),
    streetAddress: yup
      .string()
      .max(100, 'Street address is too long.')
      .required('This field is required!'),
    website: yup
      .string()
      .max(100, 'Website address is too long.')
      .required('This field is required!'),
  }),
})

export { schoolSchema }
