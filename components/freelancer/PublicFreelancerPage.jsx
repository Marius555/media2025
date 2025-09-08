"use client"

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import PublicFreelancerCard from './publicFreelancerCard'
import FreelancerProfileModal from './FreelancerProfileModal'
import { getFreelancers } from '@/appwrite/utils/getFreelancers'
import { PLATFORM_CATEGORIES } from '@/lib/platform-utils'
import { Filter, ArrowUpDown, Loader2 } from 'lucide-react'

const PublicFreelancerPage = () => {
  const [freelancers, setFreelancers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [selectedFreelancer, setSelectedFreelancer] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const platformTabs = [
    { key: 'all', label: 'All Freelancers', icon: null },
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
    setSelectedFreelancer(freelancer)
    setShowProfileModal(true)
  }

  const handleContact = (freelancer) => {
    // TODO: Implement contact functionality (email, messaging system, etc.)
    console.log('Contact freelancer:', freelancer)
    // For now, you could open an email client or show a contact form
  }

  const handleCloseProfileModal = () => {
    setShowProfileModal(false)
    setSelectedFreelancer(null)
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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            {platformTabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <TabsTrigger key={tab.key} value={tab.key} className="flex items-center gap-2">
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
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
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Profile Modal */}
      <FreelancerProfileModal
        freelancer={selectedFreelancer}
        isOpen={showProfileModal}
        onClose={handleCloseProfileModal}
        onContact={handleContact}
      />
    </div>
  )
}

export default PublicFreelancerPage