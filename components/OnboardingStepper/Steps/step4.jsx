"use client"

import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
// Temporarily removed motion imports for debugging
// import { motion, AnimatePresence } from 'motion/react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs } from '@/components/ui/tabs'
import { Youtube, Instagram, Music, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const skillsData = {
  youtube: [
    'Video Editing', 'Thumbnail Design', 'YouTube SEO', 'Content Strategy',
    'Live Streaming', 'YouTube Analytics', 'Channel Management', 'Monetization Strategy',
    'Community Management', 'Video Production', 'Script Writing', 'Voice Over'
  ],
  instagram: [
    'Instagram Stories', 'Reels Creation', 'Photo Editing', 'Instagram Shopping',
    'Influencer Marketing', 'IGTV Production', 'Instagram Analytics', 'Content Planning',
    'Hashtag Strategy', 'Brand Partnerships', 'Instagram Ads', 'Community Building'
  ],
  tiktok: [
    'Short-form Video Creation', 'TikTok Trends', 'Viral Content Strategy', 'TikTok Ads',
    'Dance Choreography', 'Comedy Content', 'Educational Content', 'TikTok Analytics',
    'Hashtag Challenges', 'Creator Fund', 'Trend Analysis', 'Music Selection'
  ],
  general: [
    'Content Creation', 'Graphic Design', 'Copywriting', 'Social Media Marketing',
    'Brand Strategy', 'Audience Growth', 'Cross-platform Marketing', 'Content Calendar',
    'Social Media Analytics', 'Engagement Strategy', 'Creative Direction', 'Project Management'
  ]
}

const FIELD_MAP = {
  youtube: 'youtubeSkills',
  instagram: 'instagramSkills',
  tiktok: 'tiktokSkills',
  general: 'generalSkills'
}

const PLATFORM_DISPLAY = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  general: 'General'
}

const Step4 = () => {
  const { register, watch, setValue, formState: { errors }, getValues } = useFormContext()
  
  // Watch platform-specific skill arrays
  const youtubeSkills = watch('youtubeSkills') || []
  const instagramSkills = watch('instagramSkills') || []
  const tiktokSkills = watch('tiktokSkills') || []
  const generalSkills = watch('generalSkills') || []
  
  const [platformSkills, setPlatformSkills] = useState({
    youtube: youtubeSkills,
    instagram: instagramSkills,
    tiktok: tiktokSkills,
    general: generalSkills
  })
  const [customSkill, setCustomSkill] = useState('')
  const [activeTab, setActiveTab] = useState('youtube')
  const [previousTab, setPreviousTab] = useState('youtube')

  // Tab order for direction-aware animations
  const tabOrder = ['youtube', 'instagram', 'tiktok', 'general']

  // Handle tab change with direction tracking
  const handleTabChange = (newTab) => {
    setPreviousTab(activeTab)
    setActiveTab(newTab)
  }

  // Get animation direction based on tab order
  const getAnimationDirection = () => {
    const currentIndex = tabOrder.indexOf(activeTab)
    const previousIndex = tabOrder.indexOf(previousTab)
    return currentIndex > previousIndex ? 1 : -1 // 1 for right, -1 for left
  }

  // Initialize form fields
  useEffect(() => {
    register('youtubeSkills')
    register('instagramSkills')
    register('tiktokSkills')
    register('generalSkills')

    const currentSkills = {
      youtube: youtubeSkills || [],
      instagram: instagramSkills || [],
      tiktok: tiktokSkills || [],
      general: generalSkills || []
    }

    setValue('youtubeSkills', currentSkills.youtube, { shouldValidate: false, shouldDirty: false })
    setValue('instagramSkills', currentSkills.instagram, { shouldValidate: false, shouldDirty: false })
    setValue('tiktokSkills', currentSkills.tiktok, { shouldValidate: false, shouldDirty: false })
    setValue('generalSkills', currentSkills.general, { shouldValidate: false, shouldDirty: false })

    setPlatformSkills(currentSkills)
  }, [])

  // Sync local state when form values change externally
  useEffect(() => {
    setPlatformSkills({
      youtube: youtubeSkills || [],
      instagram: instagramSkills || [],
      tiktok: tiktokSkills || [],
      general: generalSkills || []
    })
  }, [youtubeSkills, instagramSkills, tiktokSkills, generalSkills])

  const handleSkillToggle = (skill, platform) => {
    const currentPlatformSkills = platformSkills[platform] || []
    const updatedPlatformSkills = currentPlatformSkills.includes(skill)
      ? currentPlatformSkills.filter(s => s !== skill)
      : [...currentPlatformSkills, skill]
    
    const updatedAllSkills = {
      ...platformSkills,
      [platform]: updatedPlatformSkills
    }
    
    setPlatformSkills(updatedAllSkills)
    setValue(FIELD_MAP[platform], updatedPlatformSkills, { 
      shouldValidate: true, 
      shouldDirty: true,
      shouldTouch: true 
    })
  }

  const handleAddCustomSkill = () => {
    if (customSkill.trim()) {
      // Check if skill already exists in any platform
      const allSkills = [
        ...(platformSkills.youtube || []),
        ...(platformSkills.instagram || []),
        ...(platformSkills.tiktok || []),
        ...(platformSkills.general || [])
      ]
      
      if (!allSkills.includes(customSkill.trim())) {
        const updatedPlatformSkills = [...(platformSkills[activeTab] || []), customSkill.trim()]
        const updatedAllSkills = {
          ...platformSkills,
          [activeTab]: updatedPlatformSkills
        }
        
        setPlatformSkills(updatedAllSkills)
        setValue(FIELD_MAP[activeTab], updatedPlatformSkills, { 
          shouldValidate: true, 
          shouldDirty: true,
          shouldTouch: true 
        })
        
        setCustomSkill('')
      }
    }
  }

  const handleRemoveSkill = (skill, platform) => {
    const updatedPlatformSkills = (platformSkills[platform] || []).filter(s => s !== skill)
    const updatedAllSkills = {
      ...platformSkills,
      [platform]: updatedPlatformSkills
    }
    
    setPlatformSkills(updatedAllSkills)
    setValue(FIELD_MAP[platform], updatedPlatformSkills, { 
      shouldValidate: true, 
      shouldDirty: true,
      shouldTouch: true 
    })
  }

  // Get all selected skills across platforms for display
  const getAllSelectedSkills = () => {
    return Object.entries(platformSkills).flatMap(([platformKey, skills]) => 
      skills.map(skill => ({ 
        skill, 
        platform: PLATFORM_DISPLAY[platformKey],
        platformKey 
      }))
    )
  }

  const getTotalSkillsCount = () => {
    return platformSkills.youtube.length + 
           platformSkills.instagram.length + 
           platformSkills.tiktok.length + 
           platformSkills.general.length
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation() // Prevent event bubbling to form wrapper
      handleAddCustomSkill()
    }
  }

  return (
    <div className="space-y-4 md:space-y-6 w-full max-w-4xl mx-auto px-2 md:px-0">
      <div className="text-center space-y-2 px-2">
        <h2 className="text-xl md:text-2xl font-semibold">Select Your Skills</h2>
        <p className="text-sm md:text-base text-muted-foreground">Choose the services you can offer to clients</p>
      </div>
      
      <Card className="p-4 md:p-6 space-y-4 md:space-y-6 flex flex-col">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex-1 flex flex-col">
          {/* Custom TabsList with sliding background */}
          <div className="relative bg-muted text-muted-foreground inline-flex h-12 w-full items-center justify-center rounded-lg p-1">
            {/* Sliding background indicator - SIMPLIFIED */}
            <div
              className="absolute top-1 bg-background dark:bg-background border shadow-sm rounded-md h-10 z-0 transition-all duration-300"
              style={{
                left: `${2 + (tabOrder.indexOf(activeTab) * 25)}%`,
                width: `calc(25% - 4px)`
              }}
            />
            
            {/* Tab Buttons - SIMPLIFIED */}
            {tabOrder.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "relative z-10 flex-1 flex items-center justify-center gap-1 sm:gap-2 h-10 px-2 sm:px-4 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 min-h-[44px]",
                  activeTab === tab 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === 'youtube' && <Youtube className="w-3 h-3 sm:w-4 sm:h-4" />}
                {tab === 'instagram' && <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />}
                {tab === 'tiktok' && <Music className="w-3 h-3 sm:w-4 sm:h-4" />}
                {tab === 'general' && <Plus className="w-3 h-3 sm:w-4 sm:h-4" />}
                <span className="hidden md:inline">
                  {tab === 'youtube' && 'YouTube'}
                  {tab === 'instagram' && 'Instagram'}
                  {tab === 'tiktok' && 'TikTok'}
                  {tab === 'general' && 'General'}
                </span>
                <span className="md:hidden">
                  {tab === 'youtube' && 'YT'}
                  {tab === 'instagram' && 'IG'}
                  {tab === 'tiktok' && 'TT'}
                  {tab === 'general' && 'Gen'}
                </span>
              </button>
            ))}
          </div>

          <div className="relative flex-1 flex flex-col">
            {Object.entries(skillsData).map(([platform, skills]) => (
              activeTab === platform && (
                <div key={platform} className="space-y-4 flex-1 flex flex-col">
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3">
                    {skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill, platform)}
                        className={cn(
                          "p-3 text-left border rounded-lg transition-all duration-200 hover:shadow-md flex-shrink-0 min-h-[44px] text-sm",
                          platformSkills[platform].includes(skill)
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-background hover:bg-accent hover:text-accent-foreground border-border shadow-sm"
                        )}
                      >
                        <span className="text-sm font-medium">{skill}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </Tabs>

        {/* Custom Skill Input */}
        <div className="space-y-3">
          <Label htmlFor="custom-skill" className="text-sm font-medium">
            Add Custom Skill
          </Label>
          <div className="flex gap-2">
            <Input
              id="custom-skill"
              placeholder="Enter a skill not listed above..."
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 transition-all duration-200"
            />
            <Button
              type="button"
              onClick={handleAddCustomSkill}
              disabled={!customSkill.trim()}
              className="px-4 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Selected Skills Display */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Selected Skills ({getTotalSkillsCount()})
          </Label>
          <div className="w-full h-[120px] overflow-y-auto border rounded-lg p-3 bg-muted/20">
            {getTotalSkillsCount() > 0 ? (
              <div className="flex flex-wrap gap-2 w-full">
                {getAllSelectedSkills().map(({ skill, platform, platformKey }) => (
                  <Badge
                    key={`${platform}-${skill}`}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1 transition-all duration-200 hover:shadow-sm whitespace-nowrap"
                  >
                    <span className="text-xs text-muted-foreground mr-1">{platform}:</span>
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill, platformKey)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No skills selected yet. Choose from the options above or add custom skills.
              </div>
            )}
          </div>
        </div>

        {/* Register form fields - these are handled through setValue in useEffect */}

        {(errors.youtubeSkills || errors.instagramSkills || errors.tiktokSkills || errors.generalSkills) && (
          <p className="text-destructive text-sm">
            {errors.youtubeSkills?.message || errors.instagramSkills?.message || errors.tiktokSkills?.message || errors.generalSkills?.message}
          </p>
        )}
      </Card>
    </div>
  )
}

export default Step4
