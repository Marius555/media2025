"use client"

import { useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper"
import Step1 from "./Steps/step1"
import Step2 from "./Steps/step2"
import Step3 from "./Steps/step3"
import Step4 from "./Steps/step4"
import Step5 from "./Steps/step5"
import ClientStep2 from "./ClientSteps/ClientStep2"
import ClientStep3 from "./ClientSteps/ClientStep3"
import ClientStep4 from "./ClientSteps/ClientStep4"
import StepTransition from "./StepTransition"
import { step1Resolver } from "@/resolvers/step1Resolver"
import { step2Resolver } from "@/resolvers/step2Resolver"
import { step3Resolver } from "@/resolvers/step3Resolver"
import { step4Resolver } from "@/resolvers/step4Resolver"
import { step5Resolver } from "@/resolvers/step5Resolver"
import { clientStep2Resolver } from "@/resolvers/clientStep2Resolver"
import { clientStep3Resolver } from "@/resolvers/clientStep3Resolver"
import { clientStep4Resolver } from "@/resolvers/clientStep4Resolver"
import { createOnboardingUser, completeOnboarding, getOnboardingUser, getOnboardingUserByUserId } from "@/appwrite/utils/createOnboardingUser"

export default function ParentStepper ({userid}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [previousStep, setPreviousStep] = useState(1)
  const [onboardingId, setOnboardingId] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem('onboardingId') || null
    }
    return null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [userType, setUserType] = useState("")
  
  // Dynamic steps based on user type
  const getSteps = () => {
    if (userType === "client") {
      return [1, 2, 3, 4] // Client flow: account type, profile, requirements, budget
    }
    return [1, 2, 3, 4, 5] // Freelancer flow: account type, content, profile, skills, education
  }

  const getResolverForStep = (step) => {
    if (userType === "client") {
      switch(step) {
        case 1: return step1Resolver
        case 2: return clientStep2Resolver
        case 3: return clientStep3Resolver
        case 4: return clientStep4Resolver
        default: return step1Resolver
      }
    } else {
      // Freelancer resolvers
      switch(step) {
        case 1: return step1Resolver
        case 2: return step2Resolver
        case 3: return step3Resolver
        case 4: return step4Resolver
        case 5: return step5Resolver
        default: return step1Resolver
      }
    }
  }

  // Helper function to convert budget range internal values to display labels
  const getBudgetRangeLabel = (value) => {
    const budgetMapping = {
      'micro': '$25 - $100',
      'small': '$100 - $500',
      'medium': '$500 - $1,500', 
      'large': '$1,500 - $5,000',
      'enterprise': '$5,000+'
    }
    return budgetMapping[value] || value
  }

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      userid: userid,
      userType: "",
      // Freelancer fields
      platforms: [],
      contentTypes: [],
      youtubeSkills: [],
      instagramSkills: [],
      tiktokSkills: [],
      generalSkills: [],
      educationLevel: "",
      institutionName: "",
      fieldOfStudy: "",
      degreeTitle: "",
      studyYears: "",
      certifications: [],
      // Client fields
      servicesNeeded: [],
      contentType: "",
      timeline: "",
      platformFocus: [],
      budgetRange: "",
      projectGoals: [],
      communicationStyle: "",
      additionalRequirements: "",
      // Common fields
      firstName: "",
      lastName: "",
      profilePhoto: "",
      profilePhotoFile: null,
    },
  })

  const { handleSubmit, trigger, formState: { isValid, errors } } = methods

  // Helper function to ensure we have a valid onboardingId by checking userid
  const ensureOnboardingIdByUserId = async (formData) => {
    // First check if we have a valid localStorage onboardingId
    if (onboardingId) {
      const result = await getOnboardingUser(onboardingId)
      if (result.success) {
        console.log("Using existing localStorage onboarding ID:", onboardingId)
        return onboardingId
      } else {
        // Clear invalid ID
        localStorage.removeItem('onboardingId')
        setOnboardingId(null)
      }
    }

    // Check if user already has an onboarding record by userid
    const existingUserRecord = await getOnboardingUserByUserId(formData.userid)
    if (existingUserRecord.success) {
      const existingId = existingUserRecord.data.$id
      setOnboardingId(existingId)
      localStorage.setItem('onboardingId', existingId)
      console.log("Found existing onboarding record for user:", existingId)
      
      // Restore user type from existing data if available
      if (existingUserRecord.data.userType) {
        setUserType(existingUserRecord.data.userType)
      }
      
      return existingId
    }

    // Create new onboarding record if none exists
    const result = await createOnboardingUser(formData)
    if (result.success) {
      const newId = result.data.$id
      setOnboardingId(newId)
      localStorage.setItem('onboardingId', newId)
      console.log("New onboarding row created:", newId)
      return newId
    } else {
      throw new Error(result.error)
    }
  }

  // Keep the old function for backward compatibility in other parts
  const ensureOnboardingId = async (formData) => {
    return await ensureOnboardingIdByUserId(formData)
  }

  // Verify onboardingId exists in database on component mount
  useEffect(() => {
    const verifyOnboardingId = async () => {
      if (onboardingId) {
        const result = await getOnboardingUser(onboardingId)
        if (!result.success) {
          console.warn("Stored onboardingId is invalid, clearing localStorage")
          localStorage.removeItem('onboardingId')
          setOnboardingId(null)
          
          // After clearing invalid localStorage ID, check if user has existing record
          if (userid) {
            await checkForExistingUserRecord()
          }
        } else {
          // Restore user type from existing data
          setUserType(result.data.userType || "")
        }
      } else if (userid) {
        // No localStorage ID, check if user has existing onboarding record
        await checkForExistingUserRecord()
      }
    }
    
    const checkForExistingUserRecord = async () => {
      const existingUserRecord = await getOnboardingUserByUserId(userid)
      if (existingUserRecord.success) {
        const existingId = existingUserRecord.data.$id
        setOnboardingId(existingId)
        localStorage.setItem('onboardingId', existingId)
        console.log("Found existing onboarding record for user on mount:", existingId)
        
        // Restore user type and form data from existing record
        if (existingUserRecord.data.userType) {
          setUserType(existingUserRecord.data.userType)
        }
      }
    }

    if (userid) {
      verifyOnboardingId()
    }
  }, [userid]) // Changed dependency to userid since that's what we're checking against


  const handleNextStep = async () => {
    // Prevent multiple simultaneous navigation attempts
    if (isNavigating) {
      console.log("Navigation already in progress, ignoring click")
      return
    }
    
    setIsNavigating(true)
    
    try {
      const steps = getSteps()
    
    if (currentStep === 1) {
      const isStepValid = await trigger("userType")
      if (!isStepValid) {
        setIsNavigating(false)
        return
      }
      
      // Set user type for conditional flow
      const formData = methods.getValues()
      setUserType(formData.userType)
      
      // Ensure we have a valid onboarding record
      try {
        await ensureOnboardingId(formData)
      } catch (error) {
        console.error("Failed to create onboarding row:", error.message)
        setIsNavigating(false)
        return
      }
    }
    
    if (currentStep === 2) {
      if (userType === "client") {
        // Client Step 2: Profile completion
        const isStep2Valid = await methods.trigger(["firstName", "lastName"])
        if (!isStep2Valid) {
          setIsNavigating(false)
          return
        }
        
        if (onboardingId) {
          const formData = methods.getValues()
          let profilePhotoUrl = ""
          
          // Handle photo upload if there's a file
          if (formData.profilePhotoFile) {
            try {
              const { uploadProfilePhoto } = await import("@/appwrite/utils/createOnboardingUser")
              const uploadResult = await uploadProfilePhoto(formData.profilePhotoFile)
              if (uploadResult.success) {
                profilePhotoUrl = uploadResult.data.url
              } else {
                console.error("Failed to upload photo:", uploadResult.error)
                setIsNavigating(false)
                return
              }
            } catch (error) {
              console.error("Error uploading photo:", error)
              setIsNavigating(false)
              return
            }
          }
          
          const { updateOnboardingUser } = await import("@/appwrite/utils/createOnboardingUser")
          const result = await updateOnboardingUser(onboardingId, {
            firstName: formData.firstName || "",
            lastName: formData.lastName || "",
            profilePhoto: profilePhotoUrl
          })
          if (result.success) {
            console.log("Client Step2 data saved:", result.data)
          } else {
            console.error("Failed to save Client Step2 data:", result.error)
            setIsNavigating(false)
            return
          }
        }
      } else {
        // Freelancer Step 2: Platforms and content types
        const isStep2Valid = await methods.trigger(["platforms", "contentTypes"])
        if (!isStep2Valid) {
          setIsNavigating(false)
          return
        }
        
        if (onboardingId) {
          const formData = methods.getValues()
          const { updateOnboardingUser } = await import("@/appwrite/utils/createOnboardingUser")
          const result = await updateOnboardingUser(onboardingId, {
            platforms: formData.platforms || [],
            contentTypes: formData.contentTypes || []
          })
          if (result.success) {
            console.log("Freelancer Step2 data saved:", result.data)
          } else {
            console.error("Failed to save Freelancer Step2 data:", result.error)
            setIsNavigating(false)
            return
          }
        }
      }
    }
    
    if (currentStep === 3) {
      if (userType === "client") {
        // Client Step 3: Project requirements
        const isStep3Valid = await methods.trigger(["servicesNeeded", "contentType", "timeline", "platformFocus"])
        if (!isStep3Valid) {
          setIsNavigating(false)
          return
        }
        
        if (onboardingId) {
          const formData = methods.getValues()
          const { updateOnboardingUser } = await import("@/appwrite/utils/createOnboardingUser")
          const result = await updateOnboardingUser(onboardingId, {
            servicesNeeded: formData.servicesNeeded || [],
            contentType: formData.contentType || "",
            timeline: formData.timeline || "",
            platformFocus: formData.platformFocus || []
          })
          if (result.success) {
            console.log("Client Step3 data saved:", result.data)
          } else {
            console.error("Failed to save Client Step3 data:", result.error)
            setIsNavigating(false)
            return
          }
        }
      } else {
        // Freelancer Step 3: Profile completion
        const isStep3Valid = await methods.trigger(["firstName", "lastName"])
        if (!isStep3Valid) {
          setIsNavigating(false)
          return
        }
        
        if (onboardingId) {
          const formData = methods.getValues()
          let profilePhotoUrl = ""
          
          // Handle photo upload if there's a file
          if (formData.profilePhotoFile) {
            try {
              const { uploadProfilePhoto } = await import("@/appwrite/utils/createOnboardingUser")
              const uploadResult = await uploadProfilePhoto(formData.profilePhotoFile)
              if (uploadResult.success) {
                profilePhotoUrl = uploadResult.data.url
              } else {
                console.error("Failed to upload photo:", uploadResult.error)
                setIsNavigating(false)
                return
              }
            } catch (error) {
              console.error("Error uploading photo:", error)
              setIsNavigating(false)
              return
            }
          }
          
          const { updateOnboardingUser } = await import("@/appwrite/utils/createOnboardingUser")
          const result = await updateOnboardingUser(onboardingId, {
            firstName: formData.firstName || "",
            lastName: formData.lastName || "",
            profilePhoto: profilePhotoUrl
          })
          if (result.success) {
            console.log("Freelancer Step3 data saved:", result.data)
          } else {
            console.error("Failed to save Freelancer Step3 data:", result.error)
            setIsNavigating(false)
            return
          }
        }
      }
    }
    
    if (currentStep === 4) {
      if (userType === "client") {
        // Client Step 4: Budget & expectations (final step for clients)
        const formData = methods.getValues()
        
        // Manual validation for required fields
        const isStep4Valid = formData.budgetRange && 
                           formData.projectGoals?.length > 0 && 
                           formData.communicationStyle
        if (!isStep4Valid) {
          console.error("ClientStep4 validation failed:", {
            budgetRange: formData.budgetRange,
            projectGoals: formData.projectGoals,
            communicationStyle: formData.communicationStyle
          })
          setIsNavigating(false)
          return
        }
        
        if (onboardingId) {
          const { updateOnboardingUser } = await import("@/appwrite/utils/createOnboardingUser")
          const result = await updateOnboardingUser(onboardingId, {
            budgetRange: getBudgetRangeLabel(formData.budgetRange) || "",
            projectGoals: formData.projectGoals || [],
            communicationStyle: formData.communicationStyle || "",
            additionalRequirements: formData.additionalRequirements || ""
          })
          if (result.success) {
            console.log("Client Step4 data saved:", result.data)
          } else {
            console.error("Failed to save Client Step4 data:", result.error)
            setIsNavigating(false)
            return
          }
        }
      } else {
        // Freelancer Step 4: Skills
        console.log("=== DEBUGGING FREELANCER STEP 4 SKILLS ===")
        
        // Get current form data before validation
        const formDataBeforeValidation = methods.getValues()
        console.log("Form data BEFORE validation:", {
          youtubeSkills: formDataBeforeValidation.youtubeSkills,
          instagramSkills: formDataBeforeValidation.instagramSkills,
          tiktokSkills: formDataBeforeValidation.tiktokSkills,
          generalSkills: formDataBeforeValidation.generalSkills
        })
        
        const isStep4Valid = await methods.trigger(["youtubeSkills", "instagramSkills", "tiktokSkills", "generalSkills"])
        console.log("Step4 validation result:", isStep4Valid)
        console.log("Form errors after validation:", {
          youtubeSkills: errors.youtubeSkills,
          instagramSkills: errors.instagramSkills,
          tiktokSkills: errors.tiktokSkills,
          generalSkills: errors.generalSkills
        })
        
        if (!isStep4Valid) {
          console.log("Step4 validation failed, stopping navigation")
          setIsNavigating(false)
          return
        }
        
        if (onboardingId) {
          const formData = methods.getValues()
          console.log("Form data AFTER validation (being sent to database):", {
            youtubeSkills: formData.youtubeSkills,
            instagramSkills: formData.instagramSkills,
            tiktokSkills: formData.tiktokSkills,
            generalSkills: formData.generalSkills
          })
          
          const skillsData = {
            youtubeSkills: formData.youtubeSkills || [],
            instagramSkills: formData.instagramSkills || [],
            tiktokSkills: formData.tiktokSkills || [],
            generalSkills: formData.generalSkills || []
          }
          console.log("Skills data object being sent to updateOnboardingUser:", skillsData)
          
          const { updateOnboardingUser } = await import("@/appwrite/utils/createOnboardingUser")
          const result = await updateOnboardingUser(onboardingId, skillsData)
          if (result.success) {
            console.log("Freelancer Step4 data saved successfully:", result.data)
          } else {
            console.error("Failed to save Freelancer Step4 data:", result.error)
            setIsNavigating(false)
            return
          }
        }
        console.log("=== END FREELANCER STEP 4 DEBUGGING ===")
      }
    }
    
    if (currentStep === 5) {
      // Validate Step5 fields before final submission
      const isStep5Valid = await methods.trigger(["educationLevel", "institutionName", "fieldOfStudy", "degreeTitle", "studyYears", "certifications"])
      if (!isStep5Valid) {
        setIsNavigating(false)
        return
      }
      
      // Update Appwrite row with Step5 data (education details)
      if (onboardingId) {
        const formData = methods.getValues()
        const { updateOnboardingUser } = await import("@/appwrite/utils/createOnboardingUser")
        const result = await updateOnboardingUser(onboardingId, {
          educationLevel: formData.educationLevel || "",
          institutionName: formData.institutionName || "",
          fieldOfStudy: formData.fieldOfStudy || "",
          degreeTitle: formData.degreeTitle || "",
          studyYears: formData.studyYears || "",
          certifications: formData.certifications || []
        })
        if (result.success) {
          console.log("Step5 data saved:", result.data)
        } else {
          console.error("Failed to save Step5 data:", result.error)
          setIsNavigating(false)
          return
        }
      }
    }
    
      if (currentStep < steps.length) {
        setPreviousStep(currentStep)
        setCurrentStep((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Unexpected error in handleNextStep:", error)
    } finally {
      setIsNavigating(false)
    }
  }

  const handlePrevStep = () => {
    // Prevent navigation during async operations
    if (isNavigating) {
      return
    }
    
    if (currentStep > 1) {
      setPreviousStep(currentStep)
      setCurrentStep((prev) => prev - 1)
    }
  }

  const onFinalSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      console.log("=== FINAL FORM SUBMISSION DEBUG ===")
      console.log("Final form submission data parameter:", data)
      console.log("Onboarding ID:", onboardingId)
      console.log("User Type:", userType)
      
      const formData = methods.getValues()
      console.log("COMPLETE form data from getValues():", formData)
      console.log("Skills data in final submission:", {
        youtubeSkills: formData.youtubeSkills,
        instagramSkills: formData.instagramSkills,
        tiktokSkills: formData.tiktokSkills,
        generalSkills: formData.generalSkills
      })
      
      // Ensure we have a valid onboarding ID before final submission
      let validOnboardingId
      try {
        validOnboardingId = await ensureOnboardingId(formData)
      } catch (error) {
        console.error("Failed to ensure onboarding ID:", error.message)
        return
      }
      
      if (userType === "client") {
          // Client final submission: Save Step 4 data
          console.log("Processing client final submission...")
          
          // Manual validation for client Step 4 fields
          const isStep4Valid = formData.budgetRange && 
                             formData.projectGoals?.length > 0 && 
                             formData.communicationStyle
          if (!isStep4Valid) {
            console.error("Client Step4 validation failed:", {
              budgetRange: formData.budgetRange,
              projectGoals: formData.projectGoals,
              communicationStyle: formData.communicationStyle
            })
            return
          }

          // Save ClientStep4 data to Appwrite
          const { updateOnboardingUser } = await import("@/appwrite/utils/createOnboardingUser")
          const clientResult = await updateOnboardingUser(validOnboardingId, {
            budgetRange: getBudgetRangeLabel(formData.budgetRange) || "",
            projectGoals: formData.projectGoals || [],
            communicationStyle: formData.communicationStyle || "",
            additionalRequirements: formData.additionalRequirements || ""
          })
          
          if (!clientResult.success) {
            console.error("Failed to save Client Step4 data:", clientResult.error)
            return
          }
          
          console.log("Client Step4 data saved successfully:", clientResult.data)
        } else {
          // Freelancer final submission: Save BOTH Step 4 skills data AND Step 5 education data
          console.log("Processing freelancer final submission...")
          
          // Final validation for Step 5 education data
          const isStep5Valid = await methods.trigger(["educationLevel", "institutionName", "fieldOfStudy", "degreeTitle", "studyYears", "certifications"])
          if (!isStep5Valid) {
            console.error("Step 5 validation failed")
            return
          }

          // Combine Step 4 skills data with Step 5 education data for final submission
          const completeFreelancerData = {
            // Step 4 Skills Data (re-save to ensure it's not lost)
            youtubeSkills: formData.youtubeSkills || [],
            instagramSkills: formData.instagramSkills || [],
            tiktokSkills: formData.tiktokSkills || [],
            generalSkills: formData.generalSkills || [],
            // Step 5 Education Data
            educationLevel: formData.educationLevel || "",
            institutionName: formData.institutionName || "",
            fieldOfStudy: formData.fieldOfStudy || "",
            degreeTitle: formData.degreeTitle || "",
            studyYears: formData.studyYears || "",
            certifications: formData.certifications || []
          }
          
          console.log("Complete freelancer data being saved (skills + education):", completeFreelancerData)

          // Save complete freelancer data (skills + education) in final submission
          const { updateOnboardingUser } = await import("@/appwrite/utils/createOnboardingUser")
          const finalResult = await updateOnboardingUser(validOnboardingId, completeFreelancerData)
          
          if (!finalResult.success) {
            console.error("Failed to save complete freelancer data:", finalResult.error)
            return
          }
          
          console.log("Complete freelancer data (skills + education) saved successfully:", finalResult.data)
        }
        
        // Complete the onboarding process for both clients and freelancers
        const result = await completeOnboarding(validOnboardingId)
        if (result.success) {
          console.log("Onboarding completed successfully!")
          // Clear localStorage since onboarding is complete
          localStorage.removeItem('onboardingId')
          setOnboardingId(null)
          // You can add redirect logic here
        } else {
          console.error("Failed to complete onboarding:", result.error)
        }
    } catch (error) {
      console.error("Error during final submission:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to validate final step fields
  const isFinalStepValid = () => {
    const steps = getSteps()
    
    if (currentStep !== steps.length) {
      return true // Not on final step, so validation doesn't apply
    }
    
    if (userType === "client") {
      // Client Step 4: Budget & expectations
      const budgetRange = methods.watch("budgetRange") || ""
      const projectGoals = methods.watch("projectGoals") || []
      const communicationStyle = methods.watch("communicationStyle") || ""
      return budgetRange && projectGoals.length > 0 && communicationStyle && 
             !errors.budgetRange && !errors.projectGoals && !errors.communicationStyle
    } else {
      // Freelancer Step 5: Education
      const educationLevel = methods.watch("educationLevel") || ""
      return educationLevel && !errors.educationLevel && !errors.institutionName && !errors.fieldOfStudy && !errors.certifications
    }
  }

  const isNextDisabled = () => {
    const steps = getSteps()
    const watchedUserType = methods.watch("userType")
    
    // Disable during navigation to prevent race conditions
    if (isNavigating) {
      return true
    }
    
    if (currentStep === 1) {
      return !watchedUserType || !!errors.userType
    }
    
    if (userType === "client" || watchedUserType === "client") {
      if (currentStep === 2) {
        // Client Step 2: Profile completion
        const firstName = methods.watch("firstName") || ""
        const lastName = methods.watch("lastName") || ""
        return firstName.trim() === "" || lastName.trim() === "" || !!errors.firstName || !!errors.lastName
      }
      if (currentStep === 3) {
        // Client Step 3: Project requirements
        const servicesNeeded = methods.watch("servicesNeeded") || []
        const contentType = methods.watch("contentType") || ""
        const timeline = methods.watch("timeline") || ""
        const platformFocus = methods.watch("platformFocus") || []
        return servicesNeeded.length === 0 || !contentType || !timeline || platformFocus.length === 0 || 
               !!errors.servicesNeeded || !!errors.contentType || !!errors.timeline || !!errors.platformFocus
      }
      if (currentStep === 4) {
        // Client Step 4: Budget & expectations
        const budgetRange = methods.watch("budgetRange") || ""
        const projectGoals = methods.watch("projectGoals") || []
        const communicationStyle = methods.watch("communicationStyle") || ""
        return !budgetRange || projectGoals.length === 0 || !communicationStyle || 
               !!errors.budgetRange || !!errors.projectGoals || !!errors.communicationStyle
      }
    } else {
      // Freelancer flow
      if (currentStep === 2) {
        const platforms = methods.watch("platforms") || []
        const contentTypes = methods.watch("contentTypes") || []
        return platforms.length === 0 || contentTypes.length === 0 || !!errors.platforms || !!errors.contentTypes
      }
      if (currentStep === 3) {
        const firstName = methods.watch("firstName") || ""
        const lastName = methods.watch("lastName") || ""
        return firstName.trim() === "" || lastName.trim() === "" || !!errors.firstName || !!errors.lastName
      }
      if (currentStep === 4) {
        const youtubeSkills = methods.watch("youtubeSkills") || []
        const instagramSkills = methods.watch("instagramSkills") || []
        const tiktokSkills = methods.watch("tiktokSkills") || []
        const generalSkills = methods.watch("generalSkills") || []
        
        const totalSkills = youtubeSkills.length + instagramSkills.length + tiktokSkills.length + generalSkills.length
        
        return totalSkills === 0 || !!errors.youtubeSkills || !!errors.instagramSkills || !!errors.tiktokSkills || !!errors.generalSkills
      }
      if (currentStep === 5) {
        const educationLevel = methods.watch("educationLevel") || ""
        return !educationLevel || !!errors.educationLevel || !!errors.institutionName || !!errors.fieldOfStudy || !!errors.certifications
      }
    }
    
    return currentStep >= steps.length
  }

  // Calculate animation direction based on step change
  const getStepDirection = () => {
    return currentStep > previousStep ? 1 : -1
  }

  // Render step content based on current step and user type
  const renderStepContent = () => {
    const watchedUserType = methods.watch("userType")
    
    if (currentStep === 1) {
      return <Step1 />
    }
    
    if (userType === "client" || watchedUserType === "client") {
      // Client flow
      switch(currentStep) {
        case 2:
          return <ClientStep2 />
        case 3:
          return <ClientStep3 />
        case 4:
          return <ClientStep4 />
        default:
          return <Step1 />
      }
    } else {
      // Freelancer flow
      switch(currentStep) {
        case 2:
          return <Step2 />
        case 3:
          return <Step3 />
        case 4:
          return <Step4 />
        case 5:
          return <Step5 />
        default:
          return <Step1 />
      }
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFinalSubmit)}>
        <div className="mx-auto max-w-4xl text-center py-4 md:py-8 space-y-6 md:space-y-8 px-4">
          <div className="overflow-x-auto">
            <Stepper value={currentStep} onValueChange={setCurrentStep} className="min-w-[300px]">
              {getSteps().map((step) => (
                <StepperItem key={step} step={step} className="not-last:flex-1">
                  <StepperTrigger asChild>
                    <StepperIndicator />
                  </StepperTrigger>
                  {step < getSteps().length && <StepperSeparator />}
                </StepperItem>
              ))}
            </Stepper>
          </div>
          
          <div className="min-h-[400px] px-2 md:px-4">
            <StepTransition currentStep={currentStep} direction={getStepDirection()}>
              {renderStepContent()}
            </StepTransition>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-32 h-11 text-sm font-medium"
              onClick={handlePrevStep}
              disabled={currentStep === 1 || isNavigating}
            >
              Prev step
            </Button>
            
            {currentStep < getSteps().length ? (
              <Button
                type="button"
                className="w-full sm:w-32 h-11 text-sm font-medium"
                onClick={handleNextStep}
                disabled={isNextDisabled()}
              >
                {isNavigating ? "Loading..." : "Next step"}
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full sm:w-32 h-11 text-sm font-medium"
                disabled={!isValid || isSubmitting || !isFinalStepValid() || isNavigating}
              >
                {isSubmitting ? "Completing..." : "Complete"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
