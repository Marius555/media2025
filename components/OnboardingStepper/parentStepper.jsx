"use client"

import { useState } from "react"
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
import StepTransition from "./StepTransition"
import { step1Resolver } from "@/resolvers/step1Resolver"
import { step2Resolver } from "@/resolvers/step2Resolver"
import { step3Resolver } from "@/resolvers/step3Resolver"
import { step4Resolver } from "@/resolvers/step4Resolver"
import { step5Resolver } from "@/resolvers/step5Resolver"
import { createOnboardingUser, completeOnboarding } from "@/appwrite/utils/createOnboardingUser"


const steps = [1, 2, 3, 4, 5]

export default function ParentStepper() {
  const [currentStep, setCurrentStep] = useState(1)
  const [previousStep, setPreviousStep] = useState(1)
  const [onboardingId, setOnboardingId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const getResolverForStep = (step) => {
    switch(step) {
      case 1: return step1Resolver
      case 2: return step2Resolver
      case 3: return step3Resolver
      case 4: return step4Resolver
      case 5: return step5Resolver
      default: return step1Resolver
    }
  }

  const methods = useForm({
    resolver: getResolverForStep(currentStep),
    mode: "onChange",
    defaultValues: {
      userType: "",
      platforms: [],
      contentTypes: [],
      firstName: "",
      lastName: "",
      profilePhoto: "",
      profilePhotoFile: null,
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
    },
  })

  const { handleSubmit, trigger, formState: { isValid, errors } } = methods

  const handleNextStep = async () => {
    if (currentStep === 1) {
      const isStepValid = await trigger("userType")
      if (!isStepValid) return
      
      // Create initial Appwrite row when moving from step 1
      if (!onboardingId) {
        const formData = methods.getValues()
        const result = await createOnboardingUser(formData)
        if (result.success) {
          setOnboardingId(result.data.$id)
          console.log("Onboarding row created:", result.data.$id)
        } else {
          console.error("Failed to create onboarding row:", result.error)
          return
        }
      }
    }
    
    if (currentStep === 2) {
      // Validate Step2 fields before proceeding
      const isStep2Valid = await methods.trigger(["platforms", "contentTypes"])
      if (!isStep2Valid) return
      
      // Update Appwrite row with Step2 data
      if (onboardingId) {
        const formData = methods.getValues()
        const { updateOnboardingUser } = await import("@/appwrite/utils/createOnboardingUser")
        const result = await updateOnboardingUser(onboardingId, {
          platforms: formData.platforms || [],
          contentTypes: formData.contentTypes || []
        })
        if (result.success) {
          console.log("Step2 data saved:", result.data)
        } else {
          console.error("Failed to save Step2 data:", result.error)
          return
        }
      }
    }
    
    if (currentStep === 3) {
      // Validate Step3 fields before proceeding
      const isStep3Valid = await methods.trigger(["firstName", "lastName"])
      if (!isStep3Valid) return
      
      // Update Appwrite row with Step3 data and handle photo upload
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
              return
            }
          } catch (error) {
            console.error("Error uploading photo:", error)
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
          console.log("Step3 data saved:", result.data)
        } else {
          console.error("Failed to save Step3 data:", result.error)
          return
        }
      }
    }
    
    if (currentStep === 4) {
      // Validate Step4 fields before proceeding to final submission
      const isStep4Valid = await methods.trigger(["youtubeSkills", "instagramSkills", "tiktokSkills", "generalSkills"])
      if (!isStep4Valid) return
      
      // Update Appwrite row with Step4 data (platform-specific skills)
      if (onboardingId) {
        const formData = methods.getValues()
        const { updateOnboardingUser } = await import("@/appwrite/utils/createOnboardingUser")
        const result = await updateOnboardingUser(onboardingId, {
          youtubeSkills: formData.youtubeSkills || [],
          instagramSkills: formData.instagramSkills || [],
          tiktokSkills: formData.tiktokSkills || [],
          generalSkills: formData.generalSkills || []
        })
        if (result.success) {
          console.log("Step4 data saved:", result.data)
        } else {
          console.error("Failed to save Step4 data:", result.error)
          return
        }
      }
    }
    
    if (currentStep === 5) {
      // Validate Step5 fields before final submission
      const isStep5Valid = await methods.trigger(["educationLevel", "institutionName", "fieldOfStudy", "degreeTitle", "studyYears", "certifications"])
      if (!isStep5Valid) return
      
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
          return
        }
      }
    }
    
    if (currentStep < steps.length) {
      setPreviousStep(currentStep)
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setPreviousStep(currentStep)
      setCurrentStep((prev) => prev - 1)
    }
  }

  const onFinalSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      console.log("Final form submission:", data)
      console.log("Onboarding ID:", onboardingId)
      
      if (onboardingId) {
        // Final validation and save Step 5 education data
        const isStep5Valid = await methods.trigger(["educationLevel", "institutionName", "fieldOfStudy", "degreeTitle", "studyYears", "certifications"])
        if (!isStep5Valid) {
          console.error("Step 5 validation failed")
          return
        }

        // Save Step 5 education data before completing onboarding
        const formData = methods.getValues()
        const { updateOnboardingUser } = await import("@/appwrite/utils/createOnboardingUser")
        const educationResult = await updateOnboardingUser(onboardingId, {
          educationLevel: formData.educationLevel || "",
          institutionName: formData.institutionName || "",
          fieldOfStudy: formData.fieldOfStudy || "",
          degreeTitle: formData.degreeTitle || "",
          studyYears: formData.studyYears || "",
          certifications: formData.certifications || []
        })
        
        if (!educationResult.success) {
          console.error("Failed to save Step 5 education data:", educationResult.error)
          return
        }
        
        console.log("Step 5 education data saved successfully:", educationResult.data)
        
        // Now complete the onboarding process
        const result = await completeOnboarding(onboardingId)
        if (result.success) {
          console.log("Onboarding completed successfully!")
          // You can add redirect logic here
        } else {
          console.error("Failed to complete onboarding:", result.error)
        }
      }
    } catch (error) {
      console.error("Error during final submission:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isNextDisabled = () => {
    if (currentStep === 1) {
      return !methods.watch("userType") || !!errors.userType
    }
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
      const userType = methods.watch("userType")
      
      const totalSkills = youtubeSkills.length + instagramSkills.length + tiktokSkills.length + generalSkills.length
      
      // Only require skills for freelancers
      if (userType === "freelancer") {
        return totalSkills === 0 || !!errors.youtubeSkills || !!errors.instagramSkills || !!errors.tiktokSkills || !!errors.generalSkills
      }
      return !!errors.youtubeSkills || !!errors.instagramSkills || !!errors.tiktokSkills || !!errors.generalSkills
    }
    if (currentStep === 5) {
      const educationLevel = methods.watch("educationLevel") || ""
      return !educationLevel || !!errors.educationLevel || !!errors.institutionName || !!errors.fieldOfStudy || !!errors.certifications
    }
    return currentStep >= steps.length
  }

  // Calculate animation direction based on step change
  const getStepDirection = () => {
    return currentStep > previousStep ? 1 : -1
  }

  // Render step content based on current step
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return <Step1 />
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFinalSubmit)}>
        <div className="mx-auto max-w-4xl text-center py-4 md:py-8 space-y-6 md:space-y-8 px-4">
          <div className="overflow-x-auto">
            <Stepper value={currentStep} onValueChange={setCurrentStep} className="min-w-[300px]">
              {steps.map((step) => (
                <StepperItem key={step} step={step} className="not-last:flex-1">
                  <StepperTrigger asChild>
                    <StepperIndicator />
                  </StepperTrigger>
                  {step < steps.length && <StepperSeparator />}
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
              disabled={currentStep === 1}
            >
              Prev step
            </Button>
            
            {currentStep < steps.length ? (
              <Button
                type="button"
                className="w-full sm:w-32 h-11 text-sm font-medium"
                onClick={handleNextStep}
                disabled={isNextDisabled()}
              >
                Next step
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full sm:w-32 h-11 text-sm font-medium"
                disabled={!isValid || isSubmitting}
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
