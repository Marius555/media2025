import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const step1Schema = yup.object().shape({
  userType: yup
    .string()
    .oneOf(["freelancer", "client"], "Please select either Freelancer or Client")
    .required("Please select your account type")
});

export const step1Resolver = yupResolver(step1Schema);