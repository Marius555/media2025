"use client"

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getConsistentAvatar } from '@/lib/avatar-utils'

/**
 * Test component to verify avatar functionality
 * This can be used to test different avatar scenarios
 */
const AvatarTestComponent = () => {
  const testUsers = [
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      profilePhoto: '', // No photo - should show fallback
    },
    {
      firstName: 'Marcus',
      lastName: 'Chen',
      profilePhoto: '', // No photo - should show fallback
    },
    {
      firstName: 'Elena',
      lastName: 'Rodriguez',
      profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b217?w=150&h=150&fit=crop&crop=face', // Has photo
    },
    {
      firstName: '',
      lastName: '',
      profilePhoto: '', // No name, no photo
    },
    {
      firstName: 'Alex',
      lastName: '',
      profilePhoto: '', // Only first name
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Avatar System Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testUsers.map((user, index) => {
              const avatarInfo = getConsistentAvatar(user, 80)
              const displayName = `${user.firstName} ${user.lastName}`.trim() || 'Anonymous User'
              
              return (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={avatarInfo.url} alt={displayName} />
                    <AvatarFallback className="text-lg font-semibold">
                      {avatarInfo.initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="font-medium">{displayName}</div>
                    <div className="text-sm text-muted-foreground">
                      {avatarInfo.isFallback ? 'Generated Avatar' : 'Uploaded Photo'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Initials: {avatarInfo.initials}
                    </div>
                    {avatarInfo.backgroundColor && (
                      <div className="text-xs text-muted-foreground">
                        Color: {avatarInfo.backgroundColor}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avatar URLs for Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {testUsers.map((user, index) => {
              const avatarInfo = getConsistentAvatar(user, 80)
              const displayName = `${user.firstName} ${user.lastName}`.trim() || `User ${index + 1}`
              
              return (
                <div key={index} className="p-2 bg-gray-50 rounded">
                  <div className="font-medium">{displayName}</div>
                  <div className="text-xs text-gray-600 break-all">
                    {avatarInfo.url}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AvatarTestComponent