import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/ui/star-rating'
import { Clock, CheckCircle2 } from 'lucide-react'
import { 
  getPlatformInfo, 
  getTopSkills, 
  formatPrice, 
  getProjectCountText 
} from '@/lib/platform-utils'
import { getConsistentAvatar } from '@/lib/avatar-utils'

const PublicFreelancerCard = ({ freelancer, onViewProfile, onContact }) => {
  if (!freelancer) {
    return null
  }

  const {
    firstName = '',
    lastName = '',
    profilePhoto = '',
    platforms = [],
    rating = 0,
    reviewCount = 0,
    hourlyRate = 0,
    responseTime = 'Within 24 hours',
    completedProjects = 0
  } = freelancer

  const displayName = `${firstName} ${lastName}`.trim() || 'Anonymous Freelancer'
  const avatarInfo = getConsistentAvatar({ profilePhoto, firstName, lastName }, 64)
  console.log('Avatar Info:', avatarInfo) // Debugging line
  
  const platformInfo = getPlatformInfo(platforms)
  const topSkills = getTopSkills(freelancer, 3)
  const PlatformIcon = platformInfo.icon

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(freelancer)
    }
  }

  const handleContact = () => {
    if (onContact) {
      onContact(freelancer)
    }
  }

  return (
    <Card className="w-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
      <CardContent className="p-6">
        {/* Header with Avatar and Platform Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-16 h-16 ring-2 ring-offset-2 ring-primary/20 ">
              <AvatarImage src={avatarInfo.url} alt={displayName} />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground ">
                
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {displayName}
              </h3>
              {rating > 0 && (
                <StarRating 
                  rating={rating} 
                  reviewCount={reviewCount} 
                  size="sm" 
                  className="mt-1"
                />
              )}
            </div>
          </div>
          
          {/* Platform Badge */}
          <div className="flex items-center gap-1">
            <div className={`p-2 rounded-lg ${platformInfo.bgLight}`}>
              <PlatformIcon className={`w-4 h-4 ${platformInfo.textColor}`} />
            </div>
            <Badge variant="secondary" className="text-xs font-medium">
              {platformInfo.label}
            </Badge>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-lg font-semibold text-primary">
            {formatPrice(hourlyRate)}
          </p>
        </div>

        {/* Skills */}
        {topSkills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {topSkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>{getProjectCountText(completedProjects)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Responds {responseTime.toLowerCase()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={handleContact}
          >
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PublicFreelancerCard
