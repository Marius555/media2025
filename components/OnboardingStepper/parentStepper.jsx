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

// Utility functions for common operations
const handleDocumentNotFound = async (error, setOnboardingId, methods, userid, getCurrentUserType, ensureOnboardingId) => {
  if (!error?.includes('could not be found') && !error?.includes('not found')) {
    return null
  }

  // Clear stale onboarding ID
  setOnboardingId(null)
  if (typeof window !== 'undefined') {
    localStorage.removeItem('onboardingId')
  }

  // Create new onboarding document
  const currentFormData = methods.getValues()
  
  return await ensureOnboardingId({
    userid: currentFormData.userid || userid,
    userType: currentFormData.userType || getCurrentUserType()
  })
}

const createStepProcessor = (stepConfig) => {
  return async (methods, onboardingId, setOnboardingId, userid, getCurrentUserType, ensureOnboardingId, uploadPhoto) => {
    const { fields, validation, updateDataFn } = stepConfig

    // Validate step
    let isValid = false
    if (validation) {
      isValid = await validation(methods)
    } else if (fields) {
      isValid = await methods.trigger(fields)
    }

    if (!isValid) {
      return false
    }

    // Ensure onboarding ID exists
    if (!onboardingId) {
      try {
        const newOnboardingId = await ensureOnboardingId(methods.getValues())
        if (!newOnboardingId) {
          return false
        }
      } catch (error) {
        return false
      }
    }

    // Prepare update data (await if needed for async operations like photo upload)
    const updateData = updateDataFn ? await updateDataFn(methods.getValues(), uploadPhoto) : {}

    // Update onboarding user
    const { updateOnboardingUser } = await import("@/appwrite/utils/createOnboardingUser")
    const result = await updateOnboardingUser(onboardingId, updateData)

    if (!result.success) {
      // Handle document not found errors
      const freshOnboardingId = await handleDocumentNotFound(
        result.error, 
        setOnboardingId, 
        methods, 
        userid, 
        getCurrentUserType,
        ensureOnboardingId
      )
      
      if (freshOnboardingId) {
        const retryResult = await updateOnboardingUser(freshOnboardingId, updateData)
        return retryResult.success
      }
      
      return false
    }

    return true
  }
}

// Step configurations
const STEP_CONFIG = {
  client: {
    steps: [1, 2, 3, 4],
    components: { 1: Step1, 2: ClientStep2, 3: ClientStep3, 4: ClientStep4 },
    resolvers: { 1: step1Resolver, 2: clientStep2Resolver, 3: clientStep3Resolver, 4: clientStep4Resolver },
    fields: {
      2: ['firstName', 'lastName'],
      3: ['servicesNeeded', 'contentType', 'timeline', 'platformFocus'],
      4: ['budgetRange', 'projectGoals', 'communicationStyle']
    }
  },
  freelancer: {
    steps: [1, 2, 3, 4, 5],
    components: { 1: Step1, 2: Step2, 3: Step3, 4: Step4, 5: Step5 },
    resolvers: { 1: step1Resolver, 2: step2Resolver, 3: step3Resolver, 4: step4Resolver, 5: step5Resolver },
    fields: {
      2: ['platforms', 'contentTypes'],
      3: ['firstName', 'lastName'],
      4: ['youtubeSkills', 'instagramSkills', 'tiktokSkills', 'generalSkills'],
      5: ['educationLevel', 'institutionName', 'fieldOfStudy', 'degreeTitle', 'studyYears', 'certifications']
    }
  }
}

const BUDGET_MAPPING = {
  'micro': '$25 - $100',
  'small': '$100 - $500',
  'medium': '$500 - $1,500',
  'large': '$1,500 - $5,000',
  'enterprise': '$5,000+'
}

export default function ParentStepper ({userid}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [previousStep, setPreviousStep] = useState(1)
  const [onboardingId, setOnboardingId] = useState(() => 
    typeof window !== 'undefined' ? localStorage.getItem('onboardingId') || null : null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  // Helper functions using form values as single source of truth
  const getCurrentUserType = () => {
    return methods.getValues().userType || ""
  }
  
  const getSteps = () => {
    const currentUserType = getCurrentUserType()
    return STEP_CONFIG[currentUserType]?.steps || [1, 2, 3, 4, 5]
  }
  
  const getConfig = () => {
    const currentUserType = getCurrentUserType()
    return STEP_CONFIG[currentUserType] || STEP_CONFIG.freelancer
  }
  
  const getCurrentStepComponent = () => {
    const currentUserType = getCurrentUserType()
    const config = getConfig()
    const StepComponent = config.components[currentStep]
    
    
    return StepComponent
  }
  const getBudgetLabel = (value) => BUDGET_MAPPING[value] || value

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      userid, userType: "",
      platforms: [], contentTypes: [], youtubeSkills: [], instagramSkills: [], tiktokSkills: [], generalSkills: [],
      educationLevel: "", institutionName: "", fieldOfStudy: "", degreeTitle: "", studyYears: "", certifications: [],
      servicesNeeded: [], contentType: "", timeline: "", platformFocus: [], budgetRange: "", projectGoals: [],
      communicationStyle: "", additionalRequirements: "", firstName: "", lastName: "", profilePhoto: "", profilePhotoFile: null,
    },
  })

  const { handleSubmit, trigger, setValue, reset, getValues, formState: { isValid, errors } } = methods

  // Synchronous reset of onboarding state when userType changes
  const resetOnboardingState = (newUserType) => {
    setIsResetting(true)
    
    // Clear onboarding ID to force fresh start
    setOnboardingId(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboardingId')
    }
    
    // Reset to step 1 
    setCurrentStep(1)
    setPreviousStep(1)
    
    // Immediately reset form with new userType - this is synchronous
    reset({
      userid: userid,
      userType: newUserType,
      // Reset all other fields to default values
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
      servicesNeeded: [], 
      contentType: "", 
      timeline: "", 
      platformFocus: [], 
      budgetRange: "", 
      projectGoals: [],
      communicationStyle: "", 
      additionalRequirements: "", 
      firstName: "", 
      lastName: "", 
      profilePhoto: "", 
      profilePhotoFile: null
    })
    
    setIsResetting(false)
  }


  // Optimized onboarding ID management
  const ensureOnboardingId = async (formData) => {
    // Defensive check for missing formData
    if (!formData || !formData.userid) {
      formData = { userid, userType: getCurrentUserType() }
    }
    
    if (onboardingId) {
      const result = await getOnboardingUser(onboardingId)
      if (result.success) {
        return onboardingId
      }
      localStorage.removeItem('onboardingId')
      setOnboardingId(null)
    }

    const existingUserRecord = await getOnboardingUserByUserId(formData.userid)
    if (existingUserRecord.success) {
      const existingId = existingUserRecord.data.$id
      setOnboardingId(existingId)
      localStorage.setItem('onboardingId', existingId)
      return existingId
    }

    const result = await createOnboardingUser(formData)
    if (result.success) {
      const newId = result.data.$id
      setOnboardingId(newId)
      localStorage.setItem('onboardingId', newId)
      return newId
    }
    throw new Error(result.error)
  }

  // Photo upload helper
  const uploadPhoto = async (file) => {
    if (!file) return ""
    try {
      const { uploadProfilePhoto } = await import("@/appwrite/utils/createOnboardingUser")
      const result = await uploadProfilePhoto(file)
      return result.success ? result.data.url : ""
    } catch (error) {
      return ""
    }
  }

  // Verify and restore onboarding data on mount
  useEffect(() => {
    if (!userid) return

    const initializeOnboarding = async () => {
      if (onboardingId) {
        const result = await getOnboardingUser(onboardingId)
        if (result.success) {
          // Update form with existing userType if available
          if (result.data.userType && result.data.userType !== getCurrentUserType()) {
            setValue("userType", result.data.userType)
          }
          return
        }
        localStorage.removeItem('onboardingId')
        setOnboardingId(null)
      }

      const existingRecord = await getOnboardingUserByUserId(userid)
      if (existingRecord.success) {
        const { $id, userType } = existingRecord.data
        setOnboardingId($id)
        localStorage.setItem('onboardingId', $id)
        // Update form with existing userType if available
        if (userType && userType !== getCurrentUserType()) {
          setValue("userType", userType)
        }
      }
    }

    initializeOnboarding()
  }, [userid])

  // Handle userType changes to ensure proper step navigation  
  useEffect(() => {
    const currentUserType = getCurrentUserType()
    if (currentUserType) {
      const config = getConfig()
      const maxSteps = config.steps.length
      const validComponent = config.components[currentStep]
      
      // Reset to step 1 if component mapping is broken or step is invalid
      if (currentStep > maxSteps || !validComponent) {
        setCurrentStep(1)
        setPreviousStep(1)
      }
    }
  }, [methods.watch("userType"), currentStep])

  // Step processing configurations using utility functions
  const STEP_PROCESSORS = {
    1: async () => {
      const isValid = await trigger("userType")
      if (!isValid) return false
      
      const formData = getValues()
      const newUserType = formData.userType
      const currentUserType = getCurrentUserType()
      
      // Check if this is a userType change (not initial selection)
      const userTypeChanged = currentStep > 1 && currentUserType && currentUserType !== newUserType
      
      // If userType changed from previous selection, reset everything
      if (userTypeChanged) {
        resetOnboardingState(newUserType)
        return true // Allow progression to next step
      }
      
      // Normal flow - ensure onboarding ID exists and update userType
      const validOnboardingId = await ensureOnboardingId(formData)
      
      // Update the userType in Appwrite database
      if (validOnboardingId) {
        const { updateOnboardingUser } = await import("@/appwrite/utils/createOnboardingUser")
        await updateOnboardingUser(validOnboardingId, {
          userType: newUserType
        })
      }
      
      return true
    },
    
    2: async () => {
      const config = getConfig()
      const currentUserType = getCurrentUserType()
      
      const processor = createStepProcessor({
        fields: config.fields[2],
        updateDataFn: async (formData, uploadPhoto) => {
          if (currentUserType === "client") {
            const photoUrl = await uploadPhoto(formData.profilePhotoFile)
            return {
              firstName: formData.firstName || "",
              lastName: formData.lastName || "",
              profilePhoto: photoUrl
            }
          } else {
            return {
              platforms: formData.platforms || [],
              contentTypes: formData.contentTypes || []
            }
          }
        }
      })
      
      return processor(methods, onboardingId, setOnboardingId, userid, getCurrentUserType, ensureOnboardingId, uploadPhoto)
    },
    
    3: async () => {
      const config = getConfig()
      const currentUserType = getCurrentUserType()
      
      const processor = createStepProcessor({
        fields: config.fields[3],
        updateDataFn: async (formData, uploadPhoto) => {
          if (currentUserType === "client") {
            return {
              servicesNeeded: formData.servicesNeeded || [],
              contentType: formData.contentType || "",
              timeline: formData.timeline || "",
              platformFocus: formData.platformFocus || []
            }
          } else {
            const photoUrl = await uploadPhoto(formData.profilePhotoFile)
            return {
              firstName: formData.firstName || "",
              lastName: formData.lastName || "",
              profilePhoto: photoUrl
            }
          }
        }
      })
      
      return processor(methods, onboardingId, setOnboardingId, userid, getCurrentUserType, ensureOnboardingId, uploadPhoto)
    },
    
    4: async () => {
      const config = getConfig()
      const currentUserType = getCurrentUserType()
      
      const processor = createStepProcessor({
        fields: currentUserType === "freelancer" ? config.fields[4] : null,
        validation: currentUserType === "client" ? async (methods) => {
          const formData = methods.getValues()
          return formData.budgetRange && formData.projectGoals?.length > 0 && formData.communicationStyle
        } : null,
        updateDataFn: (formData) => {
          if (currentUserType === "client") {
            return {
              budgetRange: getBudgetLabel(formData.budgetRange) || "",
              projectGoals: formData.projectGoals || [],
              communicationStyle: formData.communicationStyle || "",
              additionalRequirements: formData.additionalRequirements || ""
            }
          } else {
            return {
              youtubeSkills: formData.youtubeSkills || [],
              instagramSkills: formData.instagramSkills || [],
              tiktokSkills: formData.tiktokSkills || [],
              generalSkills: formData.generalSkills || []
            }
          }
        }
      })
      
      return processor(methods, onboardingId, setOnboardingId, userid, getCurrentUserType, ensureOnboardingId, uploadPhoto)
    },
    
    5: async () => {
      const config = getConfig()
      
      const processor = createStepProcessor({
        fields: config.fields[5],
        updateDataFn: async (formData) => ({
          educationLevel: formData.educationLevel || "",
          institutionName: formData.institutionName || "",
          fieldOfStudy: formData.fieldOfStudy || "",
          degreeTitle: formData.degreeTitle || "",
          studyYears: formData.studyYears || "",
          certifications: formData.certifications || []
        })
      })
      
      return processor(methods, onboardingId, setOnboardingId, userid, getCurrentUserType, ensureOnboardingId, uploadPhoto)
    }
  }

  const handleNextStep = async () => {
    if (isNavigating) return
    setIsNavigating(true)
    
    try {
      const processor = STEP_PROCESSORS[currentStep]
      
      if (processor) {
        const success = await processor()
        if (!success) return
      }
      
      const steps = getSteps()
      if (currentStep < steps.length) {
        setPreviousStep(currentStep)
        setCurrentStep(prev => prev + 1)
      }
    } catch (error) {
      // Handle silently or add proper error handling if needed
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

  const onFinalSubmit = async () => {
    setIsSubmitting(true)
    try {
      const formData = methods.getValues()
      const currentUserType = getCurrentUserType()
      const validOnboardingId = await ensureOnboardingId(formData)
      
      let finalData = {}
      if (currentUserType === "client") {
        const isValid = formData.budgetRange && formData.projectGoals?.length > 0 && formData.communicationStyle
        if (!isValid) return
        
        finalData = {
          budgetRange: getBudgetLabel(formData.budgetRange) || "",
          projectGoals: formData.projectGoals || [],
          communicationStyle: formData.communicationStyle || "",
          additionalRequirements: formData.additionalRequirements || ""
        }
      } else {
        const isValid = await methods.trigger(["educationLevel", "institutionName", "fieldOfStudy", "degreeTitle", "studyYears", "certifications"])
        if (!isValid) return
        
        finalData = {
          youtubeSkills: formData.youtubeSkills || [],
          instagramSkills: formData.instagramSkills || [],
          tiktokSkills: formData.tiktokSkills || [],
          generalSkills: formData.generalSkills || [],
          educationLevel: formData.educationLevel || "",
          institutionName: formData.institutionName || "",
          fieldOfStudy: formData.fieldOfStudy || "",
          degreeTitle: formData.degreeTitle || "",
          studyYears: formData.studyYears || "",
          certifications: formData.certifications || []
        }
      }
      
      const { updateOnboardingUser } = await import("@/appwrite/utils/createOnboardingUser")
      const updateResult = await updateOnboardingUser(validOnboardingId, finalData)
      if (!updateResult.success) return
      
      const result = await completeOnboarding(validOnboardingId)
      if (result.success) {
        localStorage.removeItem('onboardingId')
        setOnboardingId(null)
      }
    } catch (error) {
      // Handle silently
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFinalStepValid = () => {
    const steps = getSteps()
    if (currentStep !== steps.length) return true
    
    const validator = STEP_VALIDATORS[getCurrentUserType()]?.[currentStep]
    return validator ? !validator() : true
  }

  // Validation helper functions
  const hasFormErrors = (fields) => fields.some(field => errors[field])
  const hasRequiredFields = (fields, formData = methods.getValues()) => 
    fields.every(field => {
      const value = formData[field] || methods.watch(field)
      return Array.isArray(value) ? value.length > 0 : value && value.toString().trim()
    })

  // Step validation configurations
  const STEP_VALIDATORS = {
    1: () => !methods.watch("userType") || !!errors.userType,
    
    client: {
      2: () => !hasRequiredFields(["firstName", "lastName"]) || hasFormErrors(["firstName", "lastName"]),
      3: () => !hasRequiredFields(["servicesNeeded", "contentType", "timeline", "platformFocus"]) || 
               hasFormErrors(["servicesNeeded", "contentType", "timeline", "platformFocus"]),
      4: () => !hasRequiredFields(["budgetRange", "projectGoals", "communicationStyle"]) || 
               hasFormErrors(["budgetRange", "projectGoals", "communicationStyle"])
    },
    
    freelancer: {
      2: () => !hasRequiredFields(["platforms", "contentTypes"]) || hasFormErrors(["platforms", "contentTypes"]),
      3: () => !hasRequiredFields(["firstName", "lastName"]) || hasFormErrors(["firstName", "lastName"]),
      4: () => {
        const skills = [
          methods.watch("youtubeSkills") || [],
          methods.watch("instagramSkills") || [],
          methods.watch("tiktokSkills") || [],
          methods.watch("generalSkills") || []
        ]
        const totalSkills = skills.reduce((sum, arr) => sum + arr.length, 0)
        return totalSkills === 0 || hasFormErrors(["youtubeSkills", "instagramSkills", "tiktokSkills", "generalSkills"])
      },
      5: () => !methods.watch("educationLevel") || hasFormErrors(["educationLevel", "institutionName", "fieldOfStudy", "certifications"])
    }
  }

  const isNextDisabled = () => {
    if (isNavigating || isResetting) return true
    
    const currentUserType = getCurrentUserType()
    
    if (currentStep === 1) {
      return STEP_VALIDATORS[1]()
    }
    
    const validator = STEP_VALIDATORS[currentUserType]?.[currentStep]
    if (validator) {
      const isDisabled = validator()
      
      
      return isDisabled
    }
    
    return currentStep >= getSteps().length
  }

  // Calculate animation direction based on step change
  const getStepDirection = () => {
    return currentStep > previousStep ? 1 : -1
  }

  const renderStepContent = () => {
    // Show loading during reset to prevent flash of wrong component
    if (isResetting) {
      return <div key="loading">Loading...</div>
    }
    
    if (currentStep === 1) return <Step1 key="step-1" />
    
    const currentUserType = getCurrentUserType()
    const StepComponent = getCurrentStepComponent()
    
    // Always fallback to Step1 if component mapping fails or we have no userType
    if (!StepComponent || !currentUserType) {
      return <Step1 key={`fallback-${currentUserType || 'unknown'}`} />
    }
    
    return <StepComponent key={`step-${currentStep}-${currentUserType}`} />
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
