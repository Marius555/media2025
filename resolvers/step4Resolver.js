import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const step4Schema = yup.object().shape({
  youtubeSkills: yup
    .array()
    .of(yup.string().min(1, "Each skill must have at least 1 character"))
    .max(10, "You can select up to 10 YouTube skills maximum")
    .default([]),
  instagramSkills: yup
    .array()
    .of(yup.string().min(1, "Each skill must have at least 1 character"))
    .max(10, "You can select up to 10 Instagram skills maximum")
    .default([]),
  tiktokSkills: yup
    .array()
    .of(yup.string().min(1, "Each skill must have at least 1 character"))
    .max(10, "You can select up to 10 TikTok skills maximum")
    .default([]),
  generalSkills: yup
    .array()
    .of(yup.string().min(1, "Each skill must have at least 1 character"))
    .max(10, "You can select up to 10 general skills maximum")
    .default([]),
  userType: yup.string(), // Include userType for validation context
}).test(
  "skills-required-for-freelancer",
  "Please select at least one skill from any platform",
  function(values) {
    if (values.userType === "freelancer") {
      const totalSkills = (values.youtubeSkills?.length || 0) + 
                         (values.instagramSkills?.length || 0) + 
                         (values.tiktokSkills?.length || 0) + 
                         (values.generalSkills?.length || 0)
      
      if (totalSkills === 0) {
        return this.createError({
          path: "youtubeSkills",
          message: "Please select at least one skill from any platform"
        })
      }
    }
    return true
  }
);

export const step4Resolver = yupResolver(step4Schema);