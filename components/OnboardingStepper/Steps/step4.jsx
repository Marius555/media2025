"use client"

import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { motion, AnimatePresence } from 'motion/react'
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

const Step4 = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  
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

  // Sync with form state when component mounts or form values change
  useEffect(() => {
    setPlatformSkills({
      youtube: youtubeSkills,
      instagram: instagramSkills,
      tiktok: tiktokSkills,
      general: generalSkills
    })
  }, [youtubeSkills, instagramSkills, tiktokSkills, generalSkills])

  const handleSkillToggle = (skill, platform) => {
    const currentPlatformSkills = platformSkills[platform]
    const updatedPlatformSkills = currentPlatformSkills.includes(skill)
      ? currentPlatformSkills.filter(s => s !== skill)
      : [...currentPlatformSkills, skill]
    
    const updatedAllSkills = {
      ...platformSkills,
      [platform]: updatedPlatformSkills
    }
    
    setPlatformSkills(updatedAllSkills)
    
    // Update the specific form field
    const fieldMap = {
      youtube: 'youtubeSkills',
      instagram: 'instagramSkills',
      tiktok: 'tiktokSkills',
      general: 'generalSkills'
    }
    setValue(fieldMap[platform], updatedPlatformSkills, { shouldValidate: true })
  }

  const handleAddCustomSkill = () => {
    if (customSkill.trim()) {
      // Check if skill already exists in any platform
      const allSkills = [
        ...platformSkills.youtube,
        ...platformSkills.instagram,
        ...platformSkills.tiktok,
        ...platformSkills.general
      ]
      
      if (!allSkills.includes(customSkill.trim())) {
        const updatedPlatformSkills = [...platformSkills[activeTab], customSkill.trim()]
        const updatedAllSkills = {
          ...platformSkills,
          [activeTab]: updatedPlatformSkills
        }
        
        setPlatformSkills(updatedAllSkills)
        
        // Update the form field for current platform
        const fieldMap = {
          youtube: 'youtubeSkills',
          instagram: 'instagramSkills', 
          tiktok: 'tiktokSkills',
          general: 'generalSkills'
        }
        setValue(fieldMap[activeTab], updatedPlatformSkills, { shouldValidate: true })
        setCustomSkill('')
      }
    }
  }

  const handleRemoveSkill = (skill, platform) => {
    const updatedPlatformSkills = platformSkills[platform].filter(s => s !== skill)
    const updatedAllSkills = {
      ...platformSkills,
      [platform]: updatedPlatformSkills
    }
    
    setPlatformSkills(updatedAllSkills)
    
    // Update the specific form field
    const fieldMap = {
      youtube: 'youtubeSkills',
      instagram: 'instagramSkills',
      tiktok: 'tiktokSkills', 
      general: 'generalSkills'
    }
    setValue(fieldMap[platform], updatedPlatformSkills, { shouldValidate: true })
  }

  // Get all selected skills across platforms for display
  const getAllSelectedSkills = () => {
    return [
      ...platformSkills.youtube.map(skill => ({ skill, platform: 'YouTube' })),
      ...platformSkills.instagram.map(skill => ({ skill, platform: 'Instagram' })),
      ...platformSkills.tiktok.map(skill => ({ skill, platform: 'TikTok' })),
      ...platformSkills.general.map(skill => ({ skill, platform: 'General' }))
    ]
  }

  const getTotalSkillsCount = () => {
    return platformSkills.youtube.length + 
           platformSkills.instagram.length + 
           platformSkills.tiktok.length + 
           platformSkills.general.length
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddCustomSkill()
    }
  }

  return (
    <div className="space-y-4 md:space-y-6 w-full max-w-4xl mx-auto px-2 md:px-0">
      <div className="text-center space-y-2 px-2">
        <h2 className="text-xl md:text-2xl font-semibold">Select Your Skills</h2>
        <p className="text-sm md:text-base text-muted-foreground">Choose the services you can offer to clients</p>
      </div>
      
      <Card className="p-4 md:p-6 space-y-4 md:space-y-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Custom TabsList with sliding background */}
          <div className="relative bg-muted text-muted-foreground inline-flex h-12 w-full items-center justify-center rounded-lg p-1">
            {/* Sliding background indicator */}
            <motion.div
              className="absolute top-1 bg-background dark:bg-background border shadow-sm rounded-md h-10 z-0"
              animate={{
                left: `${2 + (tabOrder.indexOf(activeTab) * 25)}%`,
              }}
              style={{
                width: `calc(25% - 4px)`
              }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 400,
                duration: 0.3
              }}
              layoutId="activeTabBackground"
            />
            
            {/* Tab Buttons */}
            {tabOrder.map((tab) => (
              <motion.button
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
                <span className="hidden xs:inline">
                  {tab === 'youtube' && 'YouTube'}
                  {tab === 'instagram' && 'Instagram'}
                  {tab === 'tiktok' && 'TikTok'}
                  {tab === 'general' && 'General'}
                </span>
                <span className="xs:hidden">
                  {tab === 'youtube' && 'YT'}
                  {tab === 'instagram' && 'IG'}
                  {tab === 'tiktok' && 'TT'}
                  {tab === 'general' && 'Gen'}
                </span>
              </motion.button>
            ))}
          </div>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {Object.entries(skillsData).map(([platform, skills]) => (
                activeTab === platform && (
                  <motion.div
                    key={platform}
                    initial={{ 
                      x: getAnimationDirection() * 100,
                      opacity: 0
                    }}
                    animate={{ 
                      x: 0,
                      opacity: 1
                    }}
                    exit={{ 
                      x: getAnimationDirection() * -100,
                      opacity: 0
                    }}
                    transition={{
                      type: "tween",
                      ease: [0.4, 0, 0.2, 1],
                      duration: 0.3
                    }}
                    className="space-y-4"
                  >
                    <motion.div 
                      className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.05,
                            delayChildren: 0.1
                          }
                        }
                      }}
                    >
                      {skills.map((skill, index) => (
                        <motion.button
                          key={skill}
                          variants={{
                            hidden: { 
                              opacity: 0, 
                              y: 20,
                              scale: 0.95 
                            },
                            visible: { 
                              opacity: 1, 
                              y: 0,
                              scale: 1,
                              transition: {
                                type: "spring",
                                damping: 20,
                                stiffness: 300
                              }
                            }
                          }}
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
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </Tabs>

        {/* Custom Skill Input */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label htmlFor="custom-skill" className="text-sm font-medium">
            Add Custom Skill
          </Label>
          <div className="flex gap-2">
            <motion.div className="flex-1" whileFocus={{ scale: 1.01 }}>
              <Input
                id="custom-skill"
                placeholder="Enter a skill not listed above..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 transition-all duration-200"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="button"
                onClick={handleAddCustomSkill}
                disabled={!customSkill.trim()}
                className="px-4 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Selected Skills Display */}
        <div className="space-y-3 min-h-[120px]">
          <AnimatePresence>
            {getTotalSkillsCount() > 0 && (
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: {
                    type: "spring",
                    damping: 25,
                    stiffness: 300
                  }
                }}
                exit={{ 
                  opacity: 0,
                  transition: { duration: 0.2 }
                }}
              >
                <Label className="text-sm font-medium">Selected Skills ({getTotalSkillsCount()})</Label>
                <motion.div 
                  className="flex flex-wrap gap-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.03
                      }
                    }
                  }}
                >
                  <AnimatePresence>
                    {getAllSelectedSkills().map(({ skill, platform }) => (
                      <motion.div
                        key={`${platform}-${skill}`}
                        variants={{
                          hidden: { 
                            opacity: 0, 
                            scale: 0.8
                          },
                          visible: { 
                            opacity: 1, 
                            scale: 1,
                            transition: {
                              type: "spring",
                              damping: 20,
                              stiffness: 400
                            }
                          }
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.8,
                          transition: { duration: 0.15 }
                        }}
                        layout
                      >
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1 transition-all duration-200 hover:shadow-sm"
                        >
                          <span className="text-xs text-muted-foreground mr-1">{platform}:</span>
                          {skill}
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveSkill(skill, platform.toLowerCase() === 'tiktok' ? 'tiktok' : platform.toLowerCase())}
                            className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hidden inputs for form registration */}
        <input type="hidden" {...register('youtubeSkills')} />
        <input type="hidden" {...register('instagramSkills')} />
        <input type="hidden" {...register('tiktokSkills')} />
        <input type="hidden" {...register('generalSkills')} />

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
