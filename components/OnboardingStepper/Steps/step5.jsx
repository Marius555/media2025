"use client"

import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { motion, AnimatePresence } from 'motion/react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { GraduationCap, School, Award, Plus, X, Calendar as CalendarIcon, Check } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const educationLevels = [
  { value: 'high-school', label: 'High School', icon: School },
  { value: 'associate', label: 'Associate Degree', icon: GraduationCap },
  { value: 'bachelor', label: "Bachelor's Degree", icon: GraduationCap },
  { value: 'master', label: "Master's Degree", icon: GraduationCap },
  { value: 'doctorate', label: 'Doctorate/PhD', icon: GraduationCap },
  { value: 'certification', label: 'Professional Certification', icon: Award },
  { value: 'self-taught', label: 'Self-Taught', icon: School },
  { value: 'other', label: 'Other', icon: School }
]

const Step5 = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  
  const educationLevel = watch('educationLevel') || ''
  const institutionName = watch('institutionName') || ''
  const fieldOfStudy = watch('fieldOfStudy') || ''
  const degreeTitle = watch('degreeTitle') || ''
  const studyYears = watch('studyYears') || ''
  const certifications = watch('certifications') || []
  
  const [newCertification, setNewCertification] = useState('')
  const [showAdditionalFields, setShowAdditionalFields] = useState(false)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [isPresent, setIsPresent] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  // Show additional fields for formal education levels
  useEffect(() => {
    const formalEducation = ['associate', 'bachelor', 'master', 'doctorate']
    setShowAdditionalFields(formalEducation.includes(educationLevel))
  }, [educationLevel])

  const handleEducationLevelChange = (value) => {
    setValue('educationLevel', value, { shouldValidate: true })
  }

  const handleAddCertification = () => {
    if (newCertification.trim() && !certifications.includes(newCertification.trim())) {
      const updatedCertifications = [...certifications, newCertification.trim()]
      setValue('certifications', updatedCertifications, { shouldValidate: true })
      setNewCertification('')
    }
  }

  const handleRemoveCertification = (certToRemove) => {
    const updatedCertifications = certifications.filter(cert => cert !== certToRemove)
    setValue('certifications', updatedCertifications, { shouldValidate: true })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddCertification()
    }
  }

  // Date range picker handlers
  const handleDateRangeChange = (range) => {
    if (range?.from) {
      setStartDate(range.from)
      if (range.to) {
        setEndDate(range.to)
        setIsPresent(false)
      }
      updateStudyYearsField(range.from, range.to, false)
    }
  }

  const handlePresentToggle = () => {
    const newIsPresent = !isPresent
    setIsPresent(newIsPresent)
    if (newIsPresent) {
      setEndDate(undefined)
    }
    updateStudyYearsField(startDate, newIsPresent ? undefined : endDate, newIsPresent)
  }

  const updateStudyYearsField = (start, end, present) => {
    if (!start) {
      setValue('studyYears', '', { shouldValidate: true })
      return
    }
    
    const startFormatted = format(start, 'MMM yyyy')
    let endFormatted = 'Present'
    
    if (!present && end) {
      endFormatted = format(end, 'MMM yyyy')
    }
    
    const dateRange = `${startFormatted} - ${endFormatted}`
    setValue('studyYears', dateRange, { shouldValidate: true })
  }

  const getDateRangeDisplayText = () => {
    if (!startDate) return 'Select study period'
    
    const startFormatted = format(startDate, 'MMM yyyy')
    if (isPresent) return `${startFormatted} - Present`
    if (endDate) return `${startFormatted} - ${format(endDate, 'MMM yyyy')}`
    return `${startFormatted} - Select end date`
  }

  const requiresInstitution = () => {
    return !['self-taught', 'other'].includes(educationLevel)
  }

  const requiresDegree = () => {
    return ['associate', 'bachelor', 'master', 'doctorate'].includes(educationLevel)
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Education Background</h2>
        <p className="text-muted-foreground">Tell us about your educational experience</p>
      </div>
      
      <Card className="p-6 space-y-6">
        {/* Education Level Selection */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Label className="text-sm font-medium">Education Level *</Label>
          <RadioGroup value={educationLevel} onValueChange={handleEducationLevelChange}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {educationLevels.map((level, index) => (
                <motion.div
                  key={level.value}
                  className="h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Label
                    htmlFor={level.value}
                    className="cursor-pointer h-full block"
                  >
                    <motion.div
                      className={cn(
                        "flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-200 hover:shadow-sm cursor-pointer h-full",
                        educationLevel === level.value
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RadioGroupItem
                        value={level.value}
                        id={level.value}
                        className="mb-2"
                      />
                      <level.icon className={cn(
                        "w-6 h-6 mb-2",
                        educationLevel === level.value ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className="text-xs text-center font-medium leading-tight">
                        {level.label}
                      </span>
                    </motion.div>
                  </Label>
                </motion.div>
              ))}
            </div>
          </RadioGroup>
          {errors.educationLevel && (
            <p className="text-destructive text-sm">
              {errors.educationLevel.message}
            </p>
          )}
        </motion.div>

        {/* Institution Details */}
        <AnimatePresence>
          {educationLevel && requiresInstitution() && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="institutionName">Institution Name *</Label>
                  <Input
                    id="institutionName"
                    placeholder="e.g., Stanford University"
                    {...register('institutionName')}
                    className={errors.institutionName ? 'border-destructive' : ''}
                  />
                  {errors.institutionName && (
                    <p className="text-destructive text-sm">
                      {errors.institutionName.message}
                    </p>
                  )}
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label>Study Period</Label>
                  <div className="space-y-2">
                    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground",
                            errors.studyYears && "border-destructive"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {getDateRangeDisplayText()}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-4 space-y-4">
                          <Calendar
                            mode="range"
                            captionLayout="dropdown"
                            selected={{ from: startDate, to: endDate }}
                            onSelect={handleDateRangeChange}
                            defaultMonth={startDate || new Date(2020, 0)}
                            startMonth={new Date(1960, 0)}
                            endMonth={new Date()}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            hideNavigation={true}
                          />
                          <div className="border-t pt-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant={isPresent ? "default" : "outline"}
                                size="sm"
                                onClick={handlePresentToggle}
                                className="flex items-center gap-2"
                              >
                                {isPresent && <Check className="w-3 h-3" />}
                                Currently studying
                              </Button>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    {errors.studyYears && (
                      <p className="text-destructive text-sm">
                        {errors.studyYears.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Field of Study & Degree Details */}
        <AnimatePresence>
          {showAdditionalFields && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="fieldOfStudy">Field of Study *</Label>
                  <Input
                    id="fieldOfStudy"
                    placeholder="e.g., Computer Science"
                    {...register('fieldOfStudy')}
                    className={errors.fieldOfStudy ? 'border-destructive' : ''}
                  />
                  {errors.fieldOfStudy && (
                    <p className="text-destructive text-sm">
                      {errors.fieldOfStudy.message}
                    </p>
                  )}
                </motion.div>

                {requiresDegree() && (
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="degreeTitle">Degree Title</Label>
                    <Input
                      id="degreeTitle"
                      placeholder="e.g., Bachelor of Science"
                      {...register('degreeTitle')}
                      className={errors.degreeTitle ? 'border-destructive' : ''}
                    />
                    {errors.degreeTitle && (
                      <p className="text-destructive text-sm">
                        {errors.degreeTitle.message}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certifications Section */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label className="text-sm font-medium">
            Certifications & Additional Qualifications
          </Label>
          <p className="text-xs text-muted-foreground">
            Add any relevant certifications, courses, or additional qualifications
          </p>
          
          <div className="flex gap-2">
            <motion.div className="flex-1" whileFocus={{ scale: 1.01 }}>
              <Input
                placeholder="e.g., AWS Certified Developer, Google Analytics..."
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyPress={handleKeyPress}
                className="transition-all duration-200"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="button"
                onClick={handleAddCertification}
                disabled={!newCertification.trim()}
                className="px-4 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* Certifications Display */}
          <AnimatePresence>
            {certifications.length > 0 && (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {certifications.map((cert, index) => (
                      <motion.div
                        key={cert}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                      >
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1 transition-all duration-200 hover:shadow-sm"
                        >
                          {cert}
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveCertification(cert)}
                            className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </Card>
    </div>
  )
}

export default Step5
