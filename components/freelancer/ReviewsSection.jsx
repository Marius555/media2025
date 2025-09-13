"use client"

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/ui/star-rating'
import { Separator } from '@/components/ui/separator'
import { ChevronDown, ChevronUp } from 'lucide-react'

const ReviewsSection = ({ freelancer }) => {
  const [showAllReviews, setShowAllReviews] = useState(false)
  
  // Sample reviews data - in real app this would come from the freelancer data
  const sampleReviews = [
    {
      id: 1,
      clientName: "Sarah Johnson",
      clientAvatar: "",
      rating: 5,
      date: "2024-01-15",
      comment: "Exceptional work! The content was delivered ahead of schedule and exceeded my expectations. Great communication throughout the project.",
      projectType: "YouTube Video Editing"
    },
    {
      id: 2,
      clientName: "Michael Chen",
      clientAvatar: "",
      rating: 4,
      date: "2024-01-10",
      comment: "Very professional and skilled freelancer. The quality was good, though there were a couple of minor revisions needed.",
      projectType: "Instagram Content"
    },
    {
      id: 3,
      clientName: "Emma Wilson",
      clientAvatar: "",
      rating: 5,
      date: "2024-01-05",
      comment: "Amazing creativity and attention to detail. Will definitely work with again!",
      projectType: "TikTok Videos"
    },
    {
      id: 4,
      clientName: "David Rodriguez",
      clientAvatar: "",
      rating: 5,
      date: "2023-12-28",
      comment: "Outstanding results and very responsive to feedback. Highly recommended!",
      projectType: "Content Strategy"
    }
  ]

  const displayedReviews = showAllReviews ? sampleReviews : sampleReviews.slice(0, 2)
  const averageRating = freelancer?.rating || 4.8
  const totalReviews = freelancer?.reviewCount || sampleReviews.length

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reviews & Ratings</h3>
        <div className="flex items-center gap-2">
          <StarRating rating={averageRating} reviewCount={totalReviews} size="sm" />
        </div>
      </div>

      {/* Rating Overview */}
      <Card className="bg-muted/20">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{averageRating}</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalReviews}</div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round((sampleReviews.filter(r => r.rating >= 4).length / sampleReviews.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Positive Reviews</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.map((review, index) => (
          <div key={review.id}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={review.clientAvatar} alt={review.clientName} />
                    <AvatarFallback className="text-sm">
                      {getInitials(review.clientName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{review.clientName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} size="xs" showCount={false} />
                          <span className="text-xs text-muted-foreground">
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {review.projectType}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {index < displayedReviews.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {sampleReviews.length > 2 && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="w-full sm:w-auto"
          >
            {showAllReviews ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Show Less Reviews
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Show All {sampleReviews.length} Reviews
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ReviewsSection