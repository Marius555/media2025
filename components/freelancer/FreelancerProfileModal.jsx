"use client"

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/ui/star-rating'
import { Separator } from '@/components/ui/separator'
import { 
  Clock, 
  CheckCircle2, 
  GraduationCap, 
  Award,
  Mail,
  MessageCircle
} from 'lucide-react'
import { 
  getPlatformInfo, 
  formatPrice, 
  getProjectCountText 
} from '@/lib/platform-utils'
import { getConsistentAvatar } from '@/lib/avatar-utils'

const FreelancerProfileModal = ({ freelancer, isOpen, onClose, onContact }) => {
  if (!freelancer) return null

  const {
    firstName = '',
    lastName = '',
    profilePhoto = '',
    platforms = [],
    contentTypes = [],
    youtubeSkills = [],
    instagramSkills = [],
    tiktokSkills = [],
    generalSkills = [],
    educationLevel = '',
    institutionName = '',
    fieldOfStudy = '',
    degreeTitle = '',
    certifications = [],
    rating = 0,
    reviewCount = 0,
    hourlyRate = 0,
    responseTime = 'Within 24 hours',
    completedProjects = 0,
    portfolioHighlights = []
  } = freelancer

  const displayName = `${firstName} ${lastName}`.trim() || 'Anonymous Freelancer'
  const avatarInfo = getConsistentAvatar({ profilePhoto, firstName, lastName }, 80)
  const platformInfo = getPlatformInfo(platforms)
  const PlatformIcon = platformInfo.icon

  const skillCategories = [
    { title: 'YouTube Skills', skills: youtubeSkills, color: 'bg-red-100 text-red-800' },
    { title: 'Instagram Skills', skills: instagramSkills, color: 'bg-pink-100 text-pink-800' },
    { title: 'TikTok Skills', skills: tiktokSkills, color: 'bg-gray-100 text-gray-800' },
    { title: 'General Skills', skills: generalSkills, color: 'bg-blue-100 text-blue-800' }
  ].filter(category => category.skills && category.skills.length > 0)

  const handleContact = () => {
    if (onContact) {
      onContact(freelancer)
    }
    onClose()
  }

  const hasEducation = educationLevel || institutionName || fieldOfStudy
  const educationText = [degreeTitle, fieldOfStudy].filter(Boolean).join(' in ') || educationLevel

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          {/* Header with Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 ring-4 ring-offset-4 ring-primary/20">
                <AvatarImage src={avatarInfo.url} alt={displayName} />
                <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  {avatarInfo.initials}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <DialogTitle className="text-2xl font-bold mb-2">
                  {displayName}
                </DialogTitle>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${platformInfo.bgLight}`}>
                    <PlatformIcon className={`w-5 h-5 ${platformInfo.textColor}`} />
                  </div>
                  <Badge variant="secondary" className="font-medium">
                    {platformInfo.label} Specialist
                  </Badge>
                </div>
                
                {rating > 0 && (
                  <StarRating 
                    rating={rating} 
                    reviewCount={reviewCount} 
                    size="md" 
                  />
                )}
              </div>
            </div>

            {/* Price and Actions */}
            <div className="sm:ml-auto text-right">
              <div className="text-2xl font-bold text-primary mb-3">
                {formatPrice(hourlyRate)}
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={handleContact} className="w-full sm:w-auto">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-6" />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-semibold text-green-900">
                {completedProjects}
              </div>
              <div className="text-sm text-green-700">
                Projects Completed
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-semibold text-blue-900">
                {responseTime}
              </div>
              <div className="text-sm text-blue-700">
                Response Time
              </div>
            </div>
          </div>

          {rating > 0 && (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl">⭐</div>
              <div>
                <div className="font-semibold text-yellow-900">
                  {rating.toFixed(1)}/5
                </div>
                <div className="text-sm text-yellow-700">
                  Client Rating
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Platforms and Content Types */}
        {(platforms.length > 0 || contentTypes.length > 0) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Specialization</h3>
            <div className="space-y-3">
              {platforms.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((platform, index) => (
                      <Badge key={index} variant="secondary">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {contentTypes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Content Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {contentTypes.map((type, index) => (
                      <Badge key={index} variant="outline">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {skillCategories.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Skills & Expertise</h3>
            <div className="space-y-4">
              {skillCategories.map((category, index) => (
                <div key={index}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    {category.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {hasEducation && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Education
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {educationText && (
                <div className="font-medium text-gray-900 mb-1">
                  {educationText}
                </div>
              )}
              {institutionName && (
                <div className="text-gray-700">
                  {institutionName}
                </div>
              )}
              {educationLevel && !educationText && (
                <div className="text-gray-700">
                  {educationLevel}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="py-1">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Highlights */}
        {portfolioHighlights.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Portfolio Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolioHighlights.map((highlight, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-700">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default FreelancerProfileModal