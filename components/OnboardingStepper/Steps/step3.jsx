"use client"

import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { User, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const Step3 = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  const [photoPreview, setPhotoPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const firstName = watch('firstName')
  const lastName = watch('lastName')
  const profilePhoto = watch('profilePhoto')
  const profilePhotoFile = watch('profilePhotoFile')

  // Initialize photo preview from existing form data when component mounts
  useEffect(() => {
    const existingFile = profilePhotoFile
    if (existingFile && existingFile instanceof File) {
      try {
        // Recreate preview URL from existing file
        const previewUrl = URL.createObjectURL(existingFile)
        setPhotoPreview(previewUrl)
        
        // Cleanup function to revoke the object URL when component unmounts or photo changes
        return () => {
          URL.revokeObjectURL(previewUrl)
        }
      } catch (error) {
        console.error('Error recreating photo preview:', error)
        // If there's an error, clear the invalid file data
        setValue('profilePhotoFile', null)
        setValue('profilePhoto', '', { shouldValidate: true })
      }
    } else if (!existingFile) {
      // Clear preview if no file exists
      setPhotoPreview(null)
    }
  }, [profilePhotoFile, setValue]) // Watch for changes in profilePhotoFile

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, GIF, etc.)')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB')
      return
    }

    setIsUploading(true)
    
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPhotoPreview(previewUrl)
      
      // Store file for later upload to Appwrite
      setValue('profilePhotoFile', file, { shouldValidate: true })
      setValue('profilePhoto', file.name, { shouldValidate: true })
      
      console.log(`Photo selected: ${file.name} (${Math.round(file.size / 1024)}KB)`)
      
    } catch (error) {
      console.error('Error handling photo:', error)
      alert('Error processing photo. Please try again.')
      
      // Clean up on error
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
        setPhotoPreview(null)
      }
      setValue('profilePhotoFile', null)
      setValue('profilePhoto', '', { shouldValidate: true })
    } finally {
      setIsUploading(false)
    }
  }

  const removePhoto = () => {
    // Cleanup existing object URL to prevent memory leaks
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview)
    }
    
    setPhotoPreview(null)
    setValue('profilePhotoFile', null)
    setValue('profilePhoto', '', { shouldValidate: true })
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="space-y-4 md:space-y-6 w-full max-w-4xl mx-auto px-2 md:px-0">
      <div className="text-center space-y-2 px-2">
        <h2 className="text-xl md:text-2xl font-semibold">Complete Your Profile</h2>
        <p className="text-sm md:text-base text-muted-foreground">Add your personal information and photo</p>
      </div>
      
      <Card className="p-4 md:p-6 space-y-4 md:space-y-6 w-full">
        {/* Profile Photo Upload */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Profile Photo</Label>
          
          <div className="flex flex-col items-center space-y-4">
            {/* Photo Preview or Placeholder */}
            <div className="relative">
              {photoPreview && (
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full shadow-md z-10 bg-red-500 hover:bg-red-600"
                  onClick={removePhoto}
                >
                  <X className="w-3 h-3 text-white" />
                </Button>
              )}
              <div className={cn(
                "w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden",
                photoPreview ? "border-solid border-primary" : "hover:border-gray-400"
              )}>
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Upload Photo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <div className="flex items-center justify-center">
              <Label
                htmlFor="photo-upload"
                className={cn(
                  "cursor-pointer inline-flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors min-h-[44px]",
                  isUploading && "opacity-50 cursor-not-allowed"
                )}
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading...' : photoPreview ? 'Change Photo' : 'Upload Photo'}
              </Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={isUploading}
              />
            </div>
          </div>

          {errors.profilePhoto && (
            <p className="text-destructive text-sm text-center">
              {errors.profilePhoto.message}
            </p>
          )}
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
            <Input
              id="firstName"
              placeholder="John"
              {...register('firstName')}
              className={cn(
                "h-11 text-base",
                errors.firstName ? 'border-destructive' : ''
              )}
            />
            {errors.firstName && (
              <p className="text-destructive text-sm">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              {...register('lastName')}
              className={cn(
                "h-11 text-base",
                errors.lastName ? 'border-destructive' : ''
              )}
            />
            {errors.lastName && (
              <p className="text-destructive text-sm">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Step3
