"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Youtube, Instagram, Video, Monitor, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// Custom checkbox component that matches shadcn/ui styling
const CustomCheckbox = ({ id, checked, onChange, className }) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className={cn(
          // Base styling matching shadcn/ui checkbox
          "peer size-4 shrink-0 rounded-[4px] border border-input bg-background shadow-xs transition-all duration-200 outline-none",
          // Focus states
          "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring",
          // Checked states
          "checked:bg-primary checked:border-primary",
          // Disabled states
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Hide default checkbox appearance
          "appearance-none cursor-pointer",
          className
        )}
      />
      {/* Checkmark icon overlay */}
      {checked && (
        <Check className="absolute inset-0 w-3 h-3 m-auto text-primary-foreground pointer-events-none" />
      )}
    </div>
  )
}

const Step2 = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  const [customPlatform, setCustomPlatform] = useState('')
  const [customContentType, setCustomContentType] = useState('')
  const [isOtherPlatformSelected, setIsOtherPlatformSelected] = useState(false)
  const [isOtherContentSelected, setIsOtherContentSelected] = useState(false)
  
  const selectedPlatforms = watch('platforms') || []
  const selectedContentTypes = watch('contentTypes') || []

  // Register form fields with React Hook Form
  useEffect(() => {
    register('platforms')
    register('contentTypes')
    
    // Initialize with empty arrays if not set
    if (!selectedPlatforms.length && !watch('platforms')) {
      setValue('platforms', [], { shouldValidate: false })
    }
    if (!selectedContentTypes.length && !watch('contentTypes')) {
      setValue('contentTypes', [], { shouldValidate: false })
    }
  }, [register, setValue])
  
  // For UI display, include 'other' and 'other-content' when selected
  const displayPlatforms = useMemo(() => {
    const platforms = [...selectedPlatforms]
    if (isOtherPlatformSelected && !platforms.includes('other')) {
      platforms.push('other')
    }
    return platforms
  }, [selectedPlatforms, isOtherPlatformSelected])
  
  const displayContentTypes = useMemo(() => {
    const contentTypes = [...selectedContentTypes]
    if (isOtherContentSelected && !contentTypes.includes('other-content')) {
      contentTypes.push('other-content')
    }
    return contentTypes
  }, [selectedContentTypes, isOtherContentSelected])

  const socialPlatforms = [
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'tiktok', label: 'TikTok', icon: Video },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'other', label: 'Other', icon: Monitor }
  ]

  const contentTypes = [
    { id: 'long-form', label: 'Long form videos' },
    { id: 'short-form', label: 'Short form videos' },
    { id: 'other-content', label: 'Other content' }
  ]

  const handlePlatformChange = (platformId, checked) => {
    let updatedPlatforms = [...selectedPlatforms]
    
    if (checked) {
      if (!updatedPlatforms.includes(platformId)) {
        updatedPlatforms.push(platformId)
      }
      if (platformId === 'other') {
        setIsOtherPlatformSelected(true)
      }
    } else {
      updatedPlatforms = updatedPlatforms.filter(p => p !== platformId)
      if (platformId === 'other') {
        setIsOtherPlatformSelected(false)
        setCustomPlatform('')
        updatedPlatforms = updatedPlatforms.filter(p => !customPlatform || p !== customPlatform)
      }
    }
    
    // Filter out 'other' when setting final values for submission
    const finalPlatforms = updatedPlatforms.filter(p => p !== 'other')
    setValue('platforms', finalPlatforms, { shouldValidate: true })
  }

  const handleContentTypeChange = (contentTypeId, checked) => {
    let updatedContentTypes = [...selectedContentTypes]
    
    if (checked) {
      if (!updatedContentTypes.includes(contentTypeId)) {
        updatedContentTypes.push(contentTypeId)
      }
      if (contentTypeId === 'other-content') {
        setIsOtherContentSelected(true)
      }
    } else {
      updatedContentTypes = updatedContentTypes.filter(ct => ct !== contentTypeId)
      if (contentTypeId === 'other-content') {
        setIsOtherContentSelected(false)
        setCustomContentType('')
        updatedContentTypes = updatedContentTypes.filter(ct => !customContentType || ct !== customContentType)
      }
    }
    
    // Filter out 'other-content' when setting final values for submission
    const finalContentTypes = updatedContentTypes.filter(ct => ct !== 'other-content')
    setValue('contentTypes', finalContentTypes, { shouldValidate: true })
  }

  const handleCustomPlatformChange = (value) => {
    setCustomPlatform(value)
    let updatedPlatforms = [...selectedPlatforms.filter(p => p !== 'other' && (customPlatform ? p !== customPlatform : true))]
    
    if (value.trim()) {
      updatedPlatforms.push(value.trim())
    }
    
    setValue('platforms', updatedPlatforms, { shouldValidate: true })
  }

  const handleCustomContentTypeChange = (value) => {
    setCustomContentType(value)
    let updatedContentTypes = [...selectedContentTypes.filter(ct => ct !== 'other-content' && (customContentType ? ct !== customContentType : true))]
    
    if (value.trim()) {
      updatedContentTypes.push(value.trim())
    }
    
    setValue('contentTypes', updatedContentTypes, { shouldValidate: true })
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Tell us about your content</h2>
        <p className="text-muted-foreground">Select the platforms and content types you work with</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Which platforms do you create content for?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon
              const isChecked = displayPlatforms.includes(platform.id)
              
              return (
                <Card 
                  key={platform.id} 
                  className={cn(
                    "transition-all duration-200 hover:shadow-md cursor-pointer p-4 relative",
                    isChecked 
                      ? "ring-2 ring-primary ring-offset-0 shadow-none border-primary" 
                      : "hover:border-gray-300 shadow-sm"
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handlePlatformChange(platform.id, !isChecked)
                  }}
                >
                  <div className="flex items-center space-x-3 w-full h-full">
                    <CustomCheckbox
                      id={platform.id}
                      checked={isChecked}
                      onChange={() => {}} // Controlled by card click
                      className="pointer-events-none"
                    />
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="font-medium">{platform.label}</span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
          
          {isOtherPlatformSelected && (
            <div className="mt-4">
              <Input
                placeholder="Specify other platform..."
                value={customPlatform}
                onChange={(e) => handleCustomPlatformChange(e.target.value)}
                className="max-w-sm"
              />
            </div>
          )}
          
          {errors.platforms && (
            <p className="text-destructive text-sm mt-2">
              {errors.platforms.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">What type of content do you create?</h3>
          <div className="space-y-3">
            {contentTypes.map((contentType) => {
              const isChecked = displayContentTypes.includes(contentType.id)
              
              return (
                <Card 
                  key={contentType.id} 
                  className={cn(
                    "transition-all duration-200 hover:shadow-md cursor-pointer p-4 relative",
                    isChecked 
                      ? "ring-2 ring-primary ring-offset-0 shadow-none border-primary" 
                      : "hover:border-gray-300 shadow-sm"
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleContentTypeChange(contentType.id, !isChecked)
                  }}
                >
                  <div className="flex items-center space-x-3 w-full h-full">
                    <CustomCheckbox
                      id={contentType.id}
                      checked={isChecked}
                      onChange={() => {}} // Controlled by card click
                      className="pointer-events-none"
                    />
                    <span className="font-medium">{contentType.label}</span>
                  </div>
                </Card>
              )
            })}
          </div>
          
          {isOtherContentSelected && (
            <div className="mt-4">
              <Input
                placeholder="Specify other content type..."
                value={customContentType}
                onChange={(e) => handleCustomContentTypeChange(e.target.value)}
                className="max-w-sm"
              />
            </div>
          )}
          
          {errors.contentTypes && (
            <p className="text-destructive text-sm mt-2">
              {errors.contentTypes.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step2
