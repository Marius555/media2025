"use client"

import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Youtube, Instagram, Video, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

const Step2 = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  const [customPlatform, setCustomPlatform] = useState('')
  const [customContentType, setCustomContentType] = useState('')
  const [isOtherPlatformSelected, setIsOtherPlatformSelected] = useState(false)
  const [isOtherContentSelected, setIsOtherContentSelected] = useState(false)
  
  const selectedPlatforms = watch('platforms') || []
  const selectedContentTypes = watch('contentTypes') || []
  
  // For UI display, include 'other' and 'other-content' when selected
  const displayPlatforms = [...selectedPlatforms]
  if (isOtherPlatformSelected && !displayPlatforms.includes('other')) {
    displayPlatforms.push('other')
  }
  
  const displayContentTypes = [...selectedContentTypes]
  if (isOtherContentSelected && !displayContentTypes.includes('other-content')) {
    displayContentTypes.push('other-content')
  }

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
                <Card key={platform.id} className={cn(
                  "transition-all duration-200 hover:shadow-md cursor-pointer p-4 relative",
                  isChecked 
                    ? "ring-2 ring-primary ring-offset-0 shadow-none border-primary" 
                    : "hover:border-gray-300 shadow-sm"
                )}>
                  <Label 
                    htmlFor={platform.id}
                    className="cursor-pointer flex items-center space-x-3 w-100% h-100%"
                  >
                    <Checkbox
                      id={platform.id}
                      checked={isChecked}
                      onCheckedChange={(checked) => handlePlatformChange(platform.id, checked)}
                    />
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="font-medium">{platform.label}</span>
                    </div>
                  </Label>
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
                <Card key={contentType.id} className={cn(
                  "transition-all duration-200 hover:shadow-md cursor-pointer p-4 relative",
                  isChecked 
                    ? "ring-2 ring-primary ring-offset-0 shadow-none border-primary" 
                    : "hover:border-gray-300 shadow-sm"
                )}>
                  <Label 
                    htmlFor={contentType.id}
                    className="cursor-pointer flex items-center space-x-3"
                  >
                    <Checkbox
                      id={contentType.id}
                      checked={isChecked}
                      onCheckedChange={(checked) => handleContentTypeChange(contentType.id, checked)}
                    />
                    <span className="font-medium">{contentType.label}</span>
                  </Label>
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
