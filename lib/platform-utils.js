import { Youtube, Instagram, Play, Globe } from 'lucide-react'

export const PLATFORM_CATEGORIES = {
  youtube: {
    label: 'YouTube',
    value: 'YouTube',
    icon: Youtube,
    color: 'bg-red-500',
    textColor: 'text-red-600',
    bgLight: 'bg-red-50'
  },
  tiktok: {
    label: 'TikTok',
    value: 'TikTok', 
    icon: Play,
    color: 'bg-black',
    textColor: 'text-black',
    bgLight: 'bg-gray-50'
  },
  instagram: {
    label: 'Instagram',
    value: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    textColor: 'text-pink-600',
    bgLight: 'bg-pink-50'
  },
  other: {
    label: 'Other',
    value: 'Other',
    icon: Globe,
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgLight: 'bg-blue-50'
  }
}

export const getPrimaryPlatform = (platforms = []) => {
  if (!platforms || platforms.length === 0) return 'other'
  
  const platformString = platforms.join(' ').toLowerCase()
  
  if (platformString.includes('youtube')) return 'youtube'
  if (platformString.includes('tiktok') || platformString.includes('tik tok')) return 'tiktok'
  if (platformString.includes('instagram')) return 'instagram'
  
  return 'other'
}

export const getPlatformInfo = (platforms = []) => {
  const primaryPlatform = getPrimaryPlatform(platforms)
  return PLATFORM_CATEGORIES[primaryPlatform]
}

export const getTopSkills = (freelancer, maxSkills = 3) => {
  const allSkills = [
    ...(freelancer.youtubeSkills || []),
    ...(freelancer.instagramSkills || []),
    ...(freelancer.tiktokSkills || []),
    ...(freelancer.generalSkills || [])
  ].filter(Boolean)

  // Remove duplicates and limit
  const uniqueSkills = [...new Set(allSkills)]
  return uniqueSkills.slice(0, maxSkills)
}

export const formatPrice = (hourlyRate) => {
  if (!hourlyRate || hourlyRate === 0) {
    return 'Rate negotiable'
  }
  return `Starting at $${hourlyRate}/hr`
}

export const getProjectCountText = (count) => {
  if (count === 0) return 'New freelancer'
  if (count === 1) return '1 project completed'
  return `${count} projects completed`
}