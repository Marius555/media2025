import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const clientStep2Schema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .matches(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, hyphens, and apostrophes")
    .required("First name is required"),
    
  lastName: yup
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .matches(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes")
    .required("Last name is required"),
    
  profilePhoto: yup
    .string()
    .optional(),
    
  profilePhotoFile: yup
    .mixed()
    .optional()
});

export const clientStep2Resolver = yupResolver(clientStep2Schema);