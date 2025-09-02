import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const clientStep3Schema = yup.object().shape({
  servicesNeeded: yup
    .array()
    .of(yup.string().oneOf([
      'video-editing', 'thumbnail-design', 'script-writing', 
      'motion-graphics', 'audio-editing', 'content-strategy'
    ]))
    .min(1, "Please select at least one service")
    .max(6, "You can select up to 6 services")
    .required("Please select the services you need"),
    
  contentType: yup
    .string()
    .oneOf([
      'long-form', 'short-form', 'educational', 
      'entertainment', 'promotional', 'mixed'
    ], "Please select a valid content type")
    .required("Please select your content type"),
    
  timeline: yup
    .string()
    .oneOf(['rush', 'urgent', 'standard', 'flexible'], "Please select a valid timeline")
    .required("Please select your preferred timeline"),
    
  platformFocus: yup
    .array()
    .of(yup.string().oneOf(['youtube', 'instagram', 'tiktok']))
    .min(1, "Please select at least one platform")
    .max(3, "You can select up to 3 platforms")
    .required("Please select your platform focus")
});

export const clientStep3Resolver = yupResolver(clientStep3Schema);