import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const clientStep4Schema = yup.object().shape({
  budgetRange: yup
    .string()
    .oneOf(['micro', 'small', 'medium', 'large', 'enterprise'], "Please select a valid budget range")
    .required("Please select your budget range"),
    
  projectGoals: yup
    .array()
    .of(yup.string().oneOf([
      'subscribers', 'engagement', 'views', 
      'brand-awareness', 'monetization', 'professionalism'
    ]))
    .min(1, "Please select at least one project goal")
    .max(6, "You can select up to 6 project goals")
    .required("Please select your project goals"),
    
  communicationStyle: yup
    .string()
    .oneOf(['minimal', 'regular', 'collaborative', 'hands-off'], "Please select a valid communication style")
    .required("Please select your preferred communication style"),
    
  additionalRequirements: yup
    .string()
    .max(1000, "Additional requirements must be less than 1000 characters")
    .optional()
});

export const clientStep4Resolver = yupResolver(clientStep4Schema);