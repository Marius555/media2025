import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const step3Schema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces")
    .required("First name is required"),
  
  lastName: yup
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces")
    .required("Last name is required"),
    
  profilePhoto: yup
    .string()
    .nullable()
    .optional(),
    
  profilePhotoFile: yup
    .mixed()
    .nullable()
    .optional()
    .test('fileSize', 'File size should be less than 5MB', (value) => {
      if (!value) return true; // Photo is optional
      return value.size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return true; // Photo is optional
      return value.type && value.type.startsWith('image/');
    })
});

export const step3Resolver = yupResolver(step3Schema);