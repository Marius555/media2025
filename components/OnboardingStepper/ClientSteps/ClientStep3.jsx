"use client"

import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { 
  Video, 
  Image, 
  FileText, 
  Palette, 
  Music, 
  Scissors,
  Youtube,
  Instagram,
  Clock,
  AlertCircle,
  Calendar,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ClientStep3 = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  
  const servicesNeeded = watch('servicesNeeded') || []
  const contentType = watch('contentType') || ''
  const timeline = watch('timeline') || ''
  const platformFocus = watch('platformFocus') || []

  const serviceOptions = [
    { id: 'video-editing', label: 'Video Editing', icon: Scissors, description: 'Professional video editing and post-production' },
    { id: 'thumbnail-design', label: 'Thumbnail Design', icon: Image, description: 'Eye-catching thumbnails that drive clicks' },
    { id: 'script-writing', label: 'Script Writing', icon: FileText, description: 'Engaging scripts for your content' },
    { id: 'motion-graphics', label: 'Motion Graphics', icon: Palette, description: 'Animated graphics and visual effects' },
    { id: 'audio-editing', label: 'Audio Editing', icon: Music, description: 'Audio enhancement and sound design' },
    { id: 'content-strategy', label: 'Content Strategy', icon: Youtube, description: 'Planning and optimization for growth' }
  ]

  const contentTypeOptions = [
    { value: 'long-form', label: 'Long-form Videos', description: '10+ minutes, tutorials, vlogs' },
    { value: 'short-form', label: 'Short-form Content', description: 'Shorts, Reels, TikToks (under 60 seconds)' },
    { value: 'educational', label: 'Educational Content', description: 'How-to videos, courses, explanations' },
    { value: 'entertainment', label: 'Entertainment', description: 'Comedy, reactions, gaming content' },
    { value: 'promotional', label: 'Promotional Videos', description: 'Product launches, brand content, ads' },
    { value: 'mixed', label: 'Mixed Content', description: 'Various types of content' }
  ]

  const timelineOptions = [
    { value: 'rush', label: 'Rush (24-48 hours)', icon: Zap, color: 'text-red-500' },
    { value: 'urgent', label: 'Urgent (3-5 days)', icon: AlertCircle, color: 'text-orange-500' },
    { value: 'standard', label: 'Standard (1-2 weeks)', icon: Calendar, color: 'text-blue-500' },
    { value: 'flexible', label: 'Flexible (2+ weeks)', icon: Clock, color: 'text-green-500' }
  ]

  const platformOptions = [
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'tiktok', label: 'TikTok', icon: Video }
  ]

  const handleServiceToggle = (serviceId, checked) => {
    let updatedServices = [...servicesNeeded]
    
    if (checked) {
      if (!updatedServices.includes(serviceId)) {
        updatedServices.push(serviceId)
      }
    } else {
      updatedServices = updatedServices.filter(s => s !== serviceId)
    }
    
    setValue('servicesNeeded', updatedServices, { shouldValidate: true })
  }

  const handlePlatformToggle = (platformId, checked) => {
    let updatedPlatforms = [...platformFocus]
    
    if (checked) {
      if (!updatedPlatforms.includes(platformId)) {
        updatedPlatforms.push(platformId)
      }
    } else {
      updatedPlatforms = updatedPlatforms.filter(p => p !== platformId)
    }
    
    setValue('platformFocus', updatedPlatforms, { shouldValidate: true })
  }

  const handleContentTypeChange = (value) => {
    setValue('contentType', value, { shouldValidate: true })
  }

  const handleTimelineChange = (value) => {
    setValue('timeline', value, { shouldValidate: true })
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Project Requirements</h2>
        <p className="text-muted-foreground">Tell us about your project needs</p>
      </div>

      <div className="space-y-6">
        {/* Services Needed */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-medium">What services do you need? *</Label>
              <p className="text-sm text-muted-foreground mt-1">Select all services that apply to your project</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {serviceOptions.map((service) => {
                const Icon = service.icon
                const isSelected = servicesNeeded.includes(service.id)
                
                return (
                  <Card key={service.id} className={cn(
                    "transition-all duration-200 cursor-pointer p-4 hover:shadow-md h-full min-h-[120px] flex flex-col",
                    isSelected 
                      ? "ring-2 ring-primary ring-offset-0 shadow-none border-primary bg-primary/5" 
                      : "hover:border-gray-300 shadow-sm"
                  )} style={{width: '-webkit-fill-available'}}>
                    <Label 
                      htmlFor={service.id}
                      className="cursor-pointer flex flex-col h-full flex-grow"
                    >
                      <div className="flex items-start space-x-3 h-full flex-grow">
                        <Checkbox
                          id={service.id}
                          checked={isSelected}
                          onCheckedChange={(checked) => handleServiceToggle(service.id, checked)}
                          className="mt-1 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col h-full">
                          <div className="flex items-center space-x-2 mb-2">
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="font-medium text-sm">{service.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </Label>
                  </Card>
                )
              })}
            </div>
            
            {errors.servicesNeeded && (
              <p className="text-destructive text-sm">
                {errors.servicesNeeded.message}
              </p>
            )}
          </div>
        </Card>

        {/* Content Type */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-medium">What type of content do you create? *</Label>
              <p className="text-sm text-muted-foreground mt-1">Choose the content type that best describes your project</p>
            </div>
            
            <RadioGroup value={contentType} onValueChange={handleContentTypeChange}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {contentTypeOptions.map((option) => (
                  <Label key={option.value} htmlFor={option.value} className="cursor-pointer h-full">
                    <Card className={cn(
                      "transition-all duration-200 cursor-pointer p-4 hover:shadow-md h-full",
                      contentType === option.value 
                        ? "ring-2 ring-primary ring-offset-0 shadow-none border-primary bg-primary/5" 
                        : "hover:border-gray-300 shadow-sm"
                    )} style={{width: '-webkit-fill-available'}}>
                      <div className="flex items-start space-x-3 h-full">
                        <RadioGroupItem 
                          value={option.value} 
                          id={option.value}
                          className="mt-1"
                        />
                        <div className="flex-1 flex flex-col">
                          <div className="font-medium text-sm mb-2">{option.label}</div>
                          <p className="text-xs text-muted-foreground flex-grow">{option.description}</p>
                        </div>
                      </div>
                    </Card>
                  </Label>
                ))}
              </div>
            </RadioGroup>
            
            {errors.contentType && (
              <p className="text-destructive text-sm">
                {errors.contentType.message}
              </p>
            )}
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-medium">Project Timeline *</Label>
              <p className="text-sm text-muted-foreground mt-1">When do you need this completed?</p>
            </div>
            
            <RadioGroup value={timeline} onValueChange={handleTimelineChange}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
                {timelineOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <Label key={option.value} htmlFor={`timeline-${option.value}`} className="cursor-pointer h-full">
                      <Card className={cn(
                        "transition-all duration-200 cursor-pointer p-3 hover:shadow-sm h-full",
                        timeline === option.value 
                          ? "ring-2 ring-primary ring-offset-0 shadow-none border-primary bg-primary/5" 
                          : "hover:border-gray-300"
                      )} style={{width: '-webkit-fill-available'}}>
                        <div className="flex flex-col items-center justify-center space-y-2 text-center h-full">
                          <RadioGroupItem 
                            value={option.value} 
                            id={`timeline-${option.value}`}
                          />
                          <Icon className={cn("w-5 h-5", option.color)} />
                          <span className="font-medium text-xs leading-tight">{option.label}</span>
                        </div>
                      </Card>
                    </Label>
                  )
                })}
              </div>
            </RadioGroup>
            
            {errors.timeline && (
              <p className="text-destructive text-sm">
                {errors.timeline.message}
              </p>
            )}
          </div>
        </Card>

        {/* Platform Focus */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-medium">Platform Focus *</Label>
              <p className="text-sm text-muted-foreground mt-1">Which platforms will this content be used on?</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
              {platformOptions.map((platform) => {
                const Icon = platform.icon
                const isSelected = platformFocus.includes(platform.id)
                
                return (
                  <Label 
                    key={platform.id}
                    htmlFor={`platform-${platform.id}`}
                    className="cursor-pointer h-full"
                  >
                    <Card className={cn(
                      "transition-all duration-200 cursor-pointer p-4 hover:shadow-sm h-full",
                      isSelected 
                        ? "ring-2 ring-primary ring-offset-0 shadow-none border-primary bg-primary/5" 
                        : "hover:border-gray-300"
                    )} style={{width: '-webkit-fill-available'}}>
                      <div className="flex items-center justify-center space-x-3 w-full h-full">
                        <Checkbox
                          id={`platform-${platform.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => handlePlatformToggle(platform.id, checked)}
                        />
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="font-medium text-sm">{platform.label}</span>
                      </div>
                    </Card>
                  </Label>
                )
              })}
            </div>
            
            {errors.platformFocus && (
              <p className="text-destructive text-sm">
                {errors.platformFocus.message}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ClientStep3