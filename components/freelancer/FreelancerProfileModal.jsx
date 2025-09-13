"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import PricingPlans from './PricingPlans'
import ReviewsSection from './ReviewsSection'
import { 
  Clock, 
  CheckCircle2, 
  GraduationCap, 
  Award,
  Mail,
  MessageCircle,
  User,
  DollarSign,
  Star,
  BookOpen
} from 'lucide-react'
import { 
  getPlatformInfo, 
  formatPrice, 
} from '@/lib/platform-utils'
import { getConsistentAvatar } from '@/lib/avatar-utils'

const FreelancerProfileModal = ({ freelancer, isOpen, onClose, onContact, initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(initialTab)
  
  React.useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])
  
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
    { title: 'YouTube Skills', skills: youtubeSkills },
    { title: 'Instagram Skills', skills: instagramSkills },
    { title: 'TikTok Skills', skills: tiktokSkills },
    { title: 'General Skills', skills: generalSkills }
  ].filter(category => category.skills && category.skills.length > 0)

  const handleContact = () => {
    if (onContact) {
      onContact(freelancer)
    }
    onClose()
  }

  const hasEducation = educationLevel || institutionName || fieldOfStudy
  const educationText = [degreeTitle, fieldOfStudy].filter(Boolean).join(' in ') || educationLevel

  const handleSelectPlan = (plan) => {
    console.log('Selected plan:', plan)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
        
        {/* Clean Header */}
        <DialogHeader className="border-b pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Left Side - Freelancer Info */}
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 md:w-16 md:h-16">
                <AvatarImage src={avatarInfo.url} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-sm font-medium">
                  {avatarInfo.initials}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <DialogTitle className="text-lg md:text-xl font-bold mb-2">
                  {displayName}
                </DialogTitle>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${platformInfo.bgLight}`}>
                    <PlatformIcon className={`w-3 h-3 ${platformInfo.textColor}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs font-medium">
                    {platformInfo.label} Specialist
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>{completedProjects} projects completed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Responds quickly</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Price & Actions */}
            <div className="text-center md:text-right flex-shrink-0">
              <div className="mb-3">
                <div className="text-xl md:text-2xl font-bold">
                  {formatPrice(hourlyRate)}
                </div>
                <div className="text-xs text-muted-foreground">starting price</div>
              </div>
              
              <div className="flex gap-2 justify-center md:justify-end">
                <Button 
                  onClick={handleContact}
                  size="sm"
                  className="px-4"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Contact
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="px-4"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Tab Navigation & Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            
            {/* Clean Tab Navigation */}
            <TabsList className="grid w-full grid-cols-4 mb-0 bg-gray-50">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Pricing</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span className="hidden sm:inline">Reviews</span>
              </TabsTrigger>
              <TabsTrigger value="background" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Background</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto py-4">
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0 space-y-6">
                
                {/* Specialization Section */}
                {(platforms.length > 0 || contentTypes.length > 0) && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialization</h3>
                    
                    {platforms.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Platforms</h4>
                        <div className="flex flex-wrap gap-2">
                          {platforms.slice(0, 6).map((platform, index) => (
                            <Badge key={index} variant="secondary">
                              {platform}
                            </Badge>
                          ))}
                          {platforms.length > 6 && (
                            <Badge variant="outline">+{platforms.length - 6} more</Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {contentTypes.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Content Types</h4>
                        <div className="flex flex-wrap gap-2">
                          {contentTypes.slice(0, 6).map((type, index) => (
                            <Badge key={index} variant="outline">
                              {type}
                            </Badge>
                          ))}
                          {contentTypes.length > 6 && (
                            <Badge variant="outline">+{contentTypes.length - 6} more</Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Skills Section */}
                {skillCategories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                    <div className="grid gap-4">
                      {skillCategories.map((category, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">{category.title}</h4>
                          <div className="flex flex-wrap gap-2">
                            {category.skills.slice(0, 8).map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                            {category.skills.length > 8 && (
                              <Badge variant="outline">+{category.skills.length - 8} more</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="mt-0">
                <PricingPlans freelancer={freelancer} onSelectPlan={handleSelectPlan} />
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-0">
                <ReviewsSection freelancer={freelancer} />
              </TabsContent>

              {/* Background Tab */}
              <TabsContent value="background" className="mt-0 space-y-6">
                
                {/* Education */}
                {hasEducation && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
                        <div className="text-gray-600">
                          {institutionName}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Certifications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="py-2 px-3">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Portfolio Highlights */}
                {portfolioHighlights.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Highlights</h3>
                    <div className="space-y-3">
                      {portfolioHighlights.map((highlight, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!hasEducation && certifications.length === 0 && portfolioHighlights.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No background information available</p>
                  </div>
                )}
              </TabsContent>
              
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FreelancerProfileModal