import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const step2Schema = yup.object({
  platforms: yup
    .array()
    .of(yup.string())
    .min(1, 'Please select at least one platform')
    .required('Please select at least one platform'),
  contentTypes: yup
    .array()
    .of(yup.string()) 
    .min(1, 'Please select at least one content type')
    .required('Please select at least one content type')
})

export const step2Resolver = yupResolver(step2Schema)