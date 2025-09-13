"use client"

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import PublicFreelancerCard from './publicFreelancerCard'
import { getFreelancers } from '@/appwrite/utils/getFreelancers'
import { PLATFORM_CATEGORIES } from '@/lib/platform-utils'
import { Filter, ArrowUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const PublicFreelancerPage = () => {
  const [freelancers, setFreelancers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const router = useRouter()

  const platformTabs = [
    { key: 'all', label: 'Freelancers', icon: null },
    { key: 'youtube', ...PLATFORM_CATEGORIES.youtube },
    { key: 'tiktok', ...PLATFORM_CATEGORIES.tiktok },
    { key: 'instagram', ...PLATFORM_CATEGORIES.instagram },
    { key: 'other', ...PLATFORM_CATEGORIES.other }
  ]

  const sortOptions = [
    { value: 'recent', label: 'Recently Joined' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'reviews', label: 'Most Reviews' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' }
  ]

  const loadFreelancers = async (platform = null, sort = 'recent') => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await getFreelancers(
        platform === 'all' ? null : platform,
        sort
      )
      
      if (result.success) {
        setFreelancers(result.data || [])
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load freelancers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFreelancers(activeTab, sortBy)
  }, [activeTab, sortBy])

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
  }

  const handleViewProfile = (freelancer) => {
    router.push(`/freelancer/${freelancer.$id}`)
  }

  const handleOpenReviews = (freelancer) => {
    router.push(`/freelancer/${freelancer.$id}?tab=reviews`)
  }

  const handleContact = (freelancer) => {
    // TODO: Implement contact functionality (email, messaging system, etc.)
    console.log('Contact freelancer:', freelancer)
    // For now, you could open an email client or show a contact form
  }

  const handleRateFreelancer = (freelancer, rating) => {
    // TODO: Implement rating submission to backend
    console.log('Rating freelancer:', freelancer.firstName, freelancer.lastName, 'with', rating, 'stars')
    // You can implement API call here to save the rating
  }

  console.log('Freelancers:', freelancers)

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Freelancers</h1>
          <p className="text-muted-foreground mb-2">Unable to load freelancer profiles at this time.</p>
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <Button onClick={() => loadFreelancers(activeTab, sortBy)}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find the Perfect Freelancer</h1>
        <p className="text-muted-foreground">
          Discover talented content creators specializing in YouTube, TikTok, Instagram, and more.
        </p>
      </div>

      {/* Tabs and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full lg:w-auto">
          {/* Custom Animated TabsList */}
          <div className="relative bg-muted text-muted-foreground inline-flex h-12 w-full lg:w-auto items-center justify-center rounded-lg p-1">
            {/* Sliding background indicator */}
            <div
              className="absolute top-1 bg-background dark:bg-background border shadow-sm rounded-md h-10 z-0 transition-all duration-300"
              style={{
                left: `${2 + (platformTabs.findIndex(tab => tab.key === activeTab) * (100 / platformTabs.length))}%`,
                width: `calc(${100 / platformTabs.length}% - 4px)`
              }}
            />
            
            {/* Tab Buttons */}
            {platformTabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={cn(
                    "relative z-10 flex-1 flex items-center justify-center gap-1 sm:gap-2 h-10 px-2 sm:px-4 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 min-h-[44px]",
                    activeTab === tab.key 
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {IconComponent && <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />}
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">
                    {tab.key === 'all' ? 'All' :
                     tab.key === 'youtube' ? 'YT' :
                     tab.key === 'tiktok' ? 'TT' :
                     tab.key === 'instagram' ? 'IG' : 'Other'}
                  </span>
                </button>
              )
            })}
          </div>
        </Tabs>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm bg-background"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {freelancers.length === 0 
              ? 'No freelancers found' 
              : `Showing ${freelancers.length} freelancer${freelancers.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>
      )}

      {/* Content */}
      <Tabs value={activeTab} className="w-full">
        {platformTabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading freelancers...</span>
              </div>
            ) : freelancers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">
                  No freelancers found in this category.
                </p>
                <p className="text-sm text-muted-foreground">
                  Check back soon as more freelancers complete their profiles.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {freelancers.map((freelancer) => (
                  <PublicFreelancerCard
                    key={freelancer.$id}
                    freelancer={freelancer}
                    onViewProfile={handleViewProfile}
                    onContact={handleContact}
                    onOpenReviews={handleOpenReviews}
                    onRateFreelancer={handleRateFreelancer}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

    </div>
  )
}

export default PublicFreelancerPage