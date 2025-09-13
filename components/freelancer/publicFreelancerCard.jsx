import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { 
  getPlatformInfo, 
  formatPrice,
  getAllPlatformIcons,
} from '@/lib/platform-utils'
import { getConsistentAvatar } from '@/lib/avatar-utils'

const PublicFreelancerCard = ({ freelancer, onViewProfile, onOpenReviews, onRateFreelancer }) => {
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [hasUserRated, setHasUserRated] = useState(false)
  if (!freelancer) {
    return null
  }

  const {
    firstName = '',
    lastName = '',
    profilePhoto = '',
    platforms = [],
    hourlyRate = 0,
    description = '',
  } = freelancer

  const displayName = `${firstName} ${lastName}`.trim() || 'Anonymous Freelancer'
  const avatarInfo = getConsistentAvatar({ profilePhoto, firstName, lastName }, 64)
  const platformInfo = getPlatformInfo(platforms)
  const allPlatformIcons = getAllPlatformIcons(platforms)
  const PlatformIcon = platformInfo.icon
  
  const truncateDescription = (text, maxLength = 120) => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }
  
  const truncatedDescription = truncateDescription(description)

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(freelancer)
    }
  }

  const handleOpenReviews = (e) => {
    e.stopPropagation()
    if (onOpenReviews) {
      onOpenReviews(freelancer)
    }
  }

  const handleUserRating = (rating) => {
    setUserRating(rating)
    setHasUserRated(true)
    if (onRateFreelancer) {
      onRateFreelancer(freelancer, rating)
    }
  }


  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-0 rounded-3xl overflow-hidden w-full">
      {/* Header Section with Primary Background */}
      <div className="relative h-32 bg-gradient-to-br from-primary to-primary/80 rounded-t-3xl">
        {/* Platform Icons */}
        <div className="absolute top-4 right-4 flex gap-1">
          {allPlatformIcons.slice(0, 4).map((platform, index) => {
            const IconComponent = platform.icon
            return (
              <div key={index} className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <IconComponent className="w-4 h-4 text-white" />
              </div>
            )
          })}
        </div>
        
        {/* Overlapping Avatar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
              <AvatarImage src={avatarInfo.url} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-medium text-lg">
                {avatarInfo.initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="pt-12 pb-6 px-6 text-center">
        {/* Name and Title */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {displayName}
          </h3>
          <p className="text-gray-500 text-sm">
            Content Creator
          </p>
        </div>

        {/* User Rating Section - Moved up */}
        <div className="text-center mb-6">
          <div className="text-sm font-medium mb-2 text-gray-700">Rate this freelancer:</div>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 cursor-pointer transition-colors ${
                    star <= (hoverRating || userRating)
                      ? 'fill-primary text-primary'
                      : 'text-gray-300 hover:text-primary'
                  }`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleUserRating(star)}
                />
              ))}
            </div>
            {hasUserRated && (
              <span className="text-xs text-green-600 font-medium">Thanks!</span>
            )}
          </div>
        </div>

        {/* Platform Content Type & Description */}
        <div className="mb-6">
          {/* Platform Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {allPlatformIcons.map((platform, index) => (
              <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
                <platform.icon className="w-3 h-3" />
                <span>{platform.label}</span>
              </div>
            ))}
          </div>
          
          {/* Description */}
          {truncatedDescription && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {truncatedDescription}
            </p>
          )}
        </div>

        {/* Price */}
        {formatPrice(hourlyRate) && (
          <div className="mb-6">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(hourlyRate)}
            </div>
            <div className="text-sm text-gray-500">starting price</div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleViewProfile}
          className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full"
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  )
}

export default PublicFreelancerCard