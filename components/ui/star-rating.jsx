import React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const StarRating = ({ 
  rating = 0, 
  reviewCount = 0, 
  size = 'sm', 
  showCount = true,
  className 
}) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            'fill-yellow-400 text-yellow-400'
          )}
        />
      )
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star
            className={cn(
              sizeClasses[size],
              'text-gray-300'
            )}
          />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star
              className={cn(
                sizeClasses[size],
                'fill-yellow-400 text-yellow-400'
              )}
            />
          </div>
        </div>
      )
    } else {
      stars.push(
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            'text-gray-300'
          )}
        />
      )
    }
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {stars}
      </div>
      
      {showCount && (
        <div className={cn(
          'flex items-center gap-1',
          textSizes[size],
          'text-muted-foreground'
        )}>
          <span className="font-medium text-foreground">
            {rating.toFixed(1)}
          </span>
          {reviewCount > 0 && (
            <span>
              ({reviewCount.toLocaleString()})
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export { StarRating }