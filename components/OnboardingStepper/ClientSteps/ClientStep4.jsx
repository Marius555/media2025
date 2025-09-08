"use client"

import React, { useState, useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { 
  DollarSign,
  Target,
  Users,
  TrendingUp,
  Award,
  MessageCircle,
  Phone,
  Mail,
  Video,
  Zap,
  Heart,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ClientStep4 = () => {
  const { register, control, formState: { errors } } = useFormContext()

  const budgetOptions = [
    { value: 'micro', label: '$25 - $100', description: 'Quick edits, simple thumbnails', icon: DollarSign },
    { value: 'small', label: '$100 - $500', description: 'Professional editing, multiple revisions', icon: DollarSign },
    { value: 'medium', label: '$500 - $1,500', description: 'Complex projects, motion graphics', icon: DollarSign },
    { value: 'large', label: '$1,500 - $5,000', description: 'Premium production, multiple videos', icon: DollarSign },
    { value: 'enterprise', label: '$5,000+', description: 'Ongoing partnership, comprehensive strategy', icon: DollarSign }
  ]

  const goalOptions = [
    { id: 'subscribers', label: 'Increase Subscribers', icon: Users, description: 'Grow your follower base' },
    { id: 'engagement', label: 'Boost Engagement', icon: Heart, description: 'More likes, comments, shares' },
    { id: 'views', label: 'Increase Views', icon: Eye, description: 'Reach a larger audience' },
    { id: 'brand-awareness', label: 'Brand Awareness', icon: Target, description: 'Strengthen your brand presence' },
    { id: 'monetization', label: 'Monetization', icon: TrendingUp, description: 'Generate revenue from content' },
    { id: 'professionalism', label: 'Professional Quality', icon: Award, description: 'Elevate content production value' }
  ]

  const communicationOptions = [
    { value: 'minimal', label: 'Minimal Updates', description: 'Just the essentials, final delivery', icon: MessageCircle },
    { value: 'regular', label: 'Regular Check-ins', description: 'Progress updates and feedback rounds', icon: Mail },
    { value: 'collaborative', label: 'Highly Collaborative', description: 'Frequent communication and iterations', icon: Video },
    { value: 'hands-off', label: 'Hands-off Approach', description: 'Creative freedom with final approval', icon: Zap }
  ]


  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Budget & Expectations</h2>
        <p className="text-muted-foreground">Help us match you with the right freelancers</p>
      </div>

      <div className="space-y-6">
        {/* Budget Range */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-medium">Budget Range *</Label>
              <p className="text-sm text-muted-foreground mt-1">What's your budget for this project?</p>
            </div>
            
            <Controller
              name="budgetRange"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
                    {budgetOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <Label key={option.value} htmlFor={`budget-${option.value}`} className="cursor-pointer h-full">
                          <Card className={cn(
                            "transition-all duration-200 cursor-pointer p-4 hover:shadow-sm h-full",
                            field.value === option.value 
                              ? "ring-2 ring-primary ring-offset-0 shadow-none border-primary bg-primary/5" 
                              : "hover:border-gray-300"
                          )} style={{width: '-webkit-fill-available'}}>
                            <div className="flex items-start space-x-3 h-full">
                              <RadioGroupItem 
                                value={option.value} 
                                id={`budget-${option.value}`}
                                className="mt-1 flex-shrink-0"
                              />
                              <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                              <div className="flex-1 flex flex-col">
                                <div className="font-semibold text-sm mb-2">{option.label}</div>
                                <p className="text-xs text-muted-foreground flex-grow">{option.description}</p>
                              </div>
                            </div>
                          </Card>
                        </Label>
                      )
                    })}
                  </div>
                </RadioGroup>
              )}
            />
            
            {errors.budgetRange && (
              <p className="text-destructive text-sm">
                {errors.budgetRange.message}
              </p>
            )}
          </div>
        </Card>

        {/* Project Goals */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-medium">Project Goals *</Label>
              <p className="text-sm text-muted-foreground mt-1">What are you hoping to achieve with this project?</p>
            </div>
            
            <Controller
              name="projectGoals"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                  {goalOptions.map((goal) => {
                    const Icon = goal.icon
                    const isSelected = field.value?.includes(goal.id) || false
                    
                    const handleToggle = (checked) => {
                      const current = field.value || []
                      const updated = checked 
                        ? current.includes(goal.id) ? current : [...current, goal.id]
                        : current.filter(id => id !== goal.id)
                      field.onChange(updated)
                    }
                    
                    return (
                      <Card key={goal.id} className={cn(
                        "transition-all duration-200 cursor-pointer p-4 hover:shadow-md h-full",
                        isSelected 
                          ? "ring-2 ring-primary ring-offset-0 shadow-none border-primary bg-primary/5" 
                          : "hover:border-gray-300 shadow-sm"
                      )} style={{width: '-webkit-fill-available'}}>
                        <Label htmlFor={`goal-${goal.id}`} className="cursor-pointer block h-full">
                          <div className="flex items-start space-x-3 h-full">
                            <Checkbox
                              id={`goal-${goal.id}`}
                              checked={isSelected}
                              onCheckedChange={handleToggle}
                              className="mt-1 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0 flex flex-col">
                              <div className="flex items-center space-x-2 mb-2">
                                <Icon className="w-4 h-4 text-primary" />
                                <span className="font-medium text-sm">{goal.label}</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed flex-grow">
                                {goal.description}
                              </p>
                            </div>
                          </div>
                        </Label>
                      </Card>
                    )
                  })}
                </div>
              )}
            />
            
            {errors.projectGoals && (
              <p className="text-destructive text-sm">
                {errors.projectGoals.message}
              </p>
            )}
          </div>
        </Card>

        {/* Communication Style */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-medium">Preferred Communication Style *</Label>
              <p className="text-sm text-muted-foreground mt-1">How would you like to work with freelancers?</p>
            </div>
            
            <Controller
              name="communicationStyle"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                    {communicationOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <Label key={option.value} htmlFor={`comm-${option.value}`} className="cursor-pointer h-full">
                          <Card className={cn(
                            "transition-all duration-200 cursor-pointer p-4 hover:shadow-md h-full",
                            field.value === option.value 
                              ? "ring-2 ring-primary ring-offset-0 shadow-none border-primary bg-primary/5" 
                              : "hover:border-gray-300 shadow-sm"
                          )} style={{width: '-webkit-fill-available'}}>
                            <div className="flex items-start space-x-3 h-full">
                              <RadioGroupItem 
                                value={option.value} 
                                id={`comm-${option.value}`}
                                className="mt-1"
                              />
                              <Icon className="w-5 h-5 text-primary mt-0.5" />
                              <div className="flex-1">
                                <div className="font-medium text-sm mb-1">{option.label}</div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{option.description}</p>
                              </div>
                            </div>
                          </Card>
                        </Label>
                      )
                    })}
                  </div>
                </RadioGroup>
              )}
            />
            
            {errors.communicationStyle && (
              <p className="text-destructive text-sm">
                {errors.communicationStyle.message}
              </p>
            )}
          </div>
        </Card>

        {/* Additional Requirements */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-medium">Additional Requirements</Label>
              <p className="text-sm text-muted-foreground mt-1">Any specific requirements, style preferences, or special instructions?</p>
            </div>
            
            <Textarea
              placeholder="e.g., Brand colors to use, specific style references, deadlines, file formats needed, revision limits, etc."
              {...register('additionalRequirements')}
              className="min-h-[100px] resize-none"
            />
            
            {errors.additionalRequirements && (
              <p className="text-destructive text-sm">
                {errors.additionalRequirements.message}
              </p>
            )}
          </div>
        </Card>

        {/* Summary Card */}
        <Card className="p-6 bg-muted/50 border-dashed">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">Ready to Find Your Perfect Match!</h3>
            <p className="text-sm text-muted-foreground">
              Based on your requirements, we'll connect you with skilled freelancers who specialize in your type of projects and budget range.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ClientStep4