"use client"

import React, { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import PricingPlans from '@/components/freelancer/PricingPlans'
import ReviewsSection from '@/components/freelancer/ReviewsSection'
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
  BookOpen,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { 
  getPlatformInfo, 
  formatPrice, 
} from '@/lib/platform-utils'
import { getConsistentAvatar } from '@/lib/avatar-utils'
import { getFreelancerById } from '@/appwrite/utils/getFreelancerById'
import { cn } from '@/lib/utils'

const FreelancerProfilePage = ({ params }) => {
  const resolvedParams = use(params)
  const [freelancer, setFreelancer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(initialTab)


  useEffect(() => {
    const loadFreelancer = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const result = await getFreelancerById(resolvedParams.id)
        
        if (result.success) {
          setFreelancer(result.data)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError('Failed to load freelancer profile')
      } finally {
        setLoading(false)
      }
    }

    if (resolvedParams.id) {
      loadFreelancer()
    }
  }, [resolvedParams.id])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading freelancer profile...</span>
        </div>
      </div>
    )
  }

  if (error || !freelancer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || 'This freelancer profile could not be found.'}</p>
          <Button onClick={() => router.push('/freelancer')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Freelancers
          </Button>
        </div>
      </div>
    )
  }

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
  const avatarInfo = getConsistentAvatar({ profilePhoto, firstName, lastName }, 120)
  const platformInfo = getPlatformInfo(platforms)
  const PlatformIcon = platformInfo.icon

  const skillCategories = [
    { title: 'YouTube Skills', skills: youtubeSkills },
    { title: 'Instagram Skills', skills: instagramSkills },
    { title: 'TikTok Skills', skills: tiktokSkills },
    { title: 'General Skills', skills: generalSkills }
  ].filter(category => category.skills && category.skills.length > 0)

  const handleContact = () => {
    console.log('Contact freelancer:', freelancer)
    // TODO: Implement contact functionality
  }

  const handleSelectPlan = (plan) => {
    console.log('Selected plan:', plan)
    // TODO: Implement plan selection
  }

  const hasEducation = educationLevel || institutionName || fieldOfStudy
  const educationText = [degreeTitle, fieldOfStudy].filter(Boolean).join(' in ') || educationLevel

  // Tab configuration for animated navigation
  const tabsConfig = [
    { value: 'overview', label: 'Overview', icon: User },
    { value: 'pricing', label: 'Pricing', icon: DollarSign },
    { value: 'reviews', label: 'Reviews', icon: Star }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Back Button */}
        <Button 
          onClick={() => router.push('/freelancer')} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Freelancers
        </Button>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            
            {/* Left Side - Freelancer Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <Avatar className="w-24 h-24 lg:w-32 lg:h-32">
                <AvatarImage src={avatarInfo.url} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-2xl font-medium">
                  {avatarInfo.initials}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                  {displayName}
                </h1>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl ${platformInfo.bgLight}`}>
                    <PlatformIcon className={`w-5 h-5 ${platformInfo.textColor}`} />
                  </div>
                  <Badge variant="secondary" className="text-sm font-medium">
                    {platformInfo.label} Specialist
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>{completedProjects} projects completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Responds {responseTime.toLowerCase()}</span>
                  </div>
                  {rating > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{rating.toFixed(1)} ({reviewCount} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Price & Actions */}
            <div className="text-center lg:text-right flex-shrink-0">
              <div className="mb-6">
                <div className="text-3xl lg:text-4xl font-bold text-primary">
                  {formatPrice(hourlyRate)}
                </div>
                <div className="text-sm text-muted-foreground">starting price</div>
              </div>
              
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                <Button 
                  onClick={handleContact}
                  size="lg"
                  className="px-8"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            
            {/* Custom Animated Tab Navigation */}
            <div className="border-b border-gray-200 bg-gray-50/50">
              <div className="relative bg-gray-100 text-muted-foreground inline-flex h-14 w-full items-center justify-center rounded-none p-1">
                {/* Sliding background indicator */}
                <div
                  className="absolute top-1 bg-white shadow-sm border rounded-lg h-12 z-0 transition-all duration-300 ease-in-out"
                  style={{
                    left: `${1 + (tabsConfig.findIndex(tab => tab.value === activeTab) * (100 / tabsConfig.length))}%`,
                    width: `calc(${100 / tabsConfig.length}% - 8px)`
                  }}
                />
                
                {/* Tab Buttons */}
                {tabsConfig.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={cn(
                        "relative z-10 flex-1 flex items-center justify-center gap-2 h-12 px-4 text-sm font-medium rounded-lg transition-all duration-200",
                        activeTab === tab.value 
                          ? "text-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">
                        {tab.value === 'overview' ? 'Info' :
                         tab.value === 'pricing' ? '$' : 'Rev'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0">
                <div className="grid lg:grid-cols-2 gap-6">
                  
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Specialization Section */}
                    {(platforms.length > 0 || contentTypes.length > 0) && (
                      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2.5 rounded-lg bg-primary/10">
                            <PlatformIcon className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold text-foreground">Specialization</h3>
                        </div>
                        
                        {platforms.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                              Primary Platforms
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              {platforms.slice(0, 6).map((platform, index) => (
                                <div 
                                  key={index} 
                                  className="bg-background border border-border rounded-lg p-3 hover:border-primary/50 transition-colors"
                                >
                                  <span className="text-sm font-medium text-foreground">{platform}</span>
                                </div>
                              ))}
                              {platforms.length > 6 && (
                                <div className="bg-muted border border-border rounded-lg p-3 flex items-center justify-center">
                                  <span className="text-sm text-muted-foreground">+{platforms.length - 6} more</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {contentTypes.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                              Content Expertise
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              {contentTypes.slice(0, 6).map((type, index) => (
                                <div 
                                  key={index} 
                                  className="bg-background border border-border rounded-lg p-3 hover:border-primary/50 transition-colors"
                                >
                                  <span className="text-sm font-medium text-foreground">{type}</span>
                                </div>
                              ))}
                              {contentTypes.length > 6 && (
                                <div className="bg-muted border border-border rounded-lg p-3 flex items-center justify-center">
                                  <span className="text-sm text-muted-foreground">+{contentTypes.length - 6} more</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Education */}
                    {hasEducation && (
                      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2.5 rounded-lg bg-primary/10">
                            <GraduationCap className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold text-foreground">Education</h3>
                        </div>
                        
                        <div className="border border-border rounded-lg p-6 bg-background/50">
                          {educationText && (
                            <div className="text-lg font-medium text-foreground mb-2">
                              {educationText}
                            </div>
                          )}
                          {institutionName && (
                            <div className="text-muted-foreground">
                              {institutionName}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Portfolio Highlights */}
                    {portfolioHighlights.length > 0 && (
                      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2.5 rounded-lg bg-primary/10">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold text-foreground">Portfolio Highlights</h3>
                        </div>
                        
                        <div className="space-y-4">
                          {portfolioHighlights.map((highlight, index) => (
                            <div key={index} className="border border-border rounded-lg p-4 bg-background/50 hover:bg-background transition-colors">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                                  {index + 1}
                                </div>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                  {highlight}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Skills Section */}
                    {skillCategories.length > 0 && (
                      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2.5 rounded-lg bg-primary/10">
                            <Award className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold text-foreground">Skills & Expertise</h3>
                        </div>
                        <div className="space-y-6">
                          {skillCategories.map((category, index) => (
                            <div key={index} className="border border-border rounded-lg p-4 bg-background/50">
                              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                                {category.title}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {category.skills.slice(0, 8).map((skill, skillIndex) => (
                                  <span 
                                    key={skillIndex} 
                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {category.skills.length > 8 && (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-muted-foreground">
                                    +{category.skills.length - 8} more
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {certifications.length > 0 && (
                      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2.5 rounded-lg bg-primary/10">
                            <Award className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold text-foreground">Certifications</h3>
                        </div>
                        
                        <div className="space-y-3">
                          {certifications.map((cert, index) => (
                            <div key={index} className="border border-border rounded-lg p-4 bg-background/50 hover:bg-background transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <span className="font-medium text-foreground text-sm">
                                  {cert}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Background Information Empty State - spans full width */}
                  {!hasEducation && certifications.length === 0 && portfolioHighlights.length === 0 && (
                    <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h4 className="text-lg font-medium text-foreground mb-2">Additional Background</h4>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                          Education, certifications, and portfolio highlights will appear here when available.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="mt-0">
                <PricingPlans freelancer={freelancer} onSelectPlan={handleSelectPlan} />
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-0">
                <div className="space-y-8">
                  {/* Rating Summary */}
                  {rating > 0 && (
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-lg bg-primary/10">
                          <Star className="w-5 h-5 text-primary fill-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Client Reviews</h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Overall Rating */}
                        <div className="text-center">
                          <div className="text-4xl font-bold text-foreground mb-2">{rating.toFixed(1)}</div>
                          <div className="flex items-center justify-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-5 h-5 ${star <= Math.floor(rating) ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground">{reviewCount} reviews</p>
                        </div>
                        
                        {/* Rating Breakdown */}
                        <div className="space-y-3">
                          {[5, 4, 3, 2, 1].map((stars) => {
                            const percentage = Math.random() * 100;
                            return (
                              <div key={stars} className="flex items-center gap-3">
                                <span className="text-sm font-medium w-8 text-muted-foreground">{stars}★</span>
                                <div className="flex-1 bg-secondary rounded-full h-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-muted-foreground w-10">{Math.round(percentage)}%</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Individual Reviews */}
                  <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 rounded-lg bg-primary/10">
                        <MessageCircle className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">Recent Reviews</h3>
                    </div>
                    
                    {reviewCount > 0 ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((review) => (
                          <div key={review} className="border border-border rounded-lg p-4 bg-background/50 hover:bg-background transition-colors">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                                {`U${review}`}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-foreground">Anonymous Client</h4>
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star key={star} className="w-4 h-4 text-primary fill-primary" />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-muted-foreground mb-3 leading-relaxed text-sm">
                                  "Excellent work! The freelancer delivered high-quality content that exceeded our expectations. Communication was clear and professional throughout the project."
                                </p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span>2 weeks ago</span>
                                  <span>•</span>
                                  <span>YouTube Campaign</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                          <Star className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h4 className="text-lg font-medium text-foreground mb-2">No Reviews Yet</h4>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                          This freelancer is just getting started. Be the first to work with them and leave a review!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default FreelancerProfilePage