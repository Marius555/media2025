"use client"

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Users, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'

const USER_TYPES = [
  {
    id: "freelancer",
    title: "Freelancer", 
    description: "Offer your services and work on projects",
    icon: Briefcase
  },
  {
    id: "client",
    title: "Client",
    description: "Find and hire talented freelancers", 
    icon: Users
  }
]

const Step1 = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  const selectedUserType = watch('userType')

  const handleCardSelect = (value) => {
    setValue('userType', value, { shouldValidate: true })
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Choose your account type</h2>
        <p className="text-muted-foreground">Select how you'll be using our platform</p>
      </div>
      
      <RadioGroup 
        value={selectedUserType} 
        onValueChange={handleCardSelect}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {USER_TYPES.map((userType) => {
          const Icon = userType.icon
          const isSelected = selectedUserType === userType.id
          
          return (
            <Label key={userType.id} htmlFor={userType.id} className="cursor-pointer">
              <Card className={cn(
                "transition-all duration-200 hover:shadow-md cursor-pointer h-[200px] relative p-6 flex flex-col justify-center",
                isSelected 
                  ? "ring-2 ring-primary ring-offset-0 shadow-none border-primary" 
                  : "hover:border-gray-300 shadow-sm"
              )}>
                <RadioGroupItem 
                  value={userType.id}
                  id={userType.id}
                  {...register('userType')}
                  className="absolute top-4 right-4"
                />
                <div className="space-y-3">
                  <div className="flex items-center flex-col gap-3">
                    <div className="p-4 rounded-full bg-primary/10 shrink-0">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{userType.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    {userType.description}
                  </p>
                </div>
              </Card>
            </Label>
          )
        })}
      </RadioGroup>

      {errors.userType && (
        <p className="text-destructive text-sm text-center mt-2">
          {errors.userType.message}
        </p>
      )}
    </div>
  )
}

export default Step1
