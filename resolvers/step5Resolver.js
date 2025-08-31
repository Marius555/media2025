import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const step5Schema = yup.object().shape({
  educationLevel: yup
    .string()
    .oneOf([
      'high-school', 'associate', 'bachelor', 'master', 'doctorate', 
      'certification', 'self-taught', 'other'
    ], "Please select a valid education level")
    .required("Please select your education level"),
  
  institutionName: yup
    .string()
    .when('educationLevel', {
      is: (val) => val && !['self-taught', 'other'].includes(val),
      then: (schema) => schema.required("Institution name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  fieldOfStudy: yup
    .string()
    .when('educationLevel', {
      is: (val) => ['associate', 'bachelor', 'master', 'doctorate'].includes(val),
      then: (schema) => schema.required("Field of study is required for degree programs"),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  degreeTitle: yup
    .string()
    .when('educationLevel', {
      is: (val) => ['associate', 'bachelor', 'master', 'doctorate'].includes(val),
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  studyYears: yup
    .string()
    .when('educationLevel', {
      is: (val) => val && !['self-taught', 'other'].includes(val),
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  certifications: yup
    .array()
    .of(yup.string().min(1, "Each certification must have at least 1 character"))
    .max(10, "You can add up to 10 certifications maximum")
    .default([]),
});

export const step5Resolver = yupResolver(step5Schema);