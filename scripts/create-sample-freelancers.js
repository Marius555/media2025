"use server"
/**
 * Script to create sample freelancer profiles for testing
 */

import { createOnboardingUser } from '@/appwrite/utils/createOnboardingUser'
import { ID } from 'node-appwrite'

const SAMPLE_FREELANCERS = [
  {
    userid: ID.unique(),
    userType: 'freelancer',
    firstName: 'Sarah',
    lastName: 'Johnson',
    platforms: ['YouTube', 'Instagram'],
    contentTypes: ['Educational', 'Lifestyle'],
    youtubeSkills: ['Video Editing', 'SEO Optimization', 'Thumbnail Design'],
    instagramSkills: ['Photography', 'Story Creation', 'Reels'],
    generalSkills: ['Content Strategy', 'Analytics'],
    educationLevel: 'Bachelor\'s Degree',
    institutionName: 'University of California',
    fieldOfStudy: 'Marketing',
    degreeTitle: 'Bachelor of Arts',
    certifications: ['Google Analytics', 'Facebook Blueprint'],
    rating: 4.8,
    reviewCount: 127,
    hourlyRate: 75,
    responseTime: 'Within 2 hours',
    completedProjects: 45,
    portfolioHighlights: [
      'Increased subscriber count by 300% for tech channel',
      'Created viral Instagram campaign with 2M+ views'
    ],
    status: 'completed'
  },
  {
    userid: ID.unique(),
    userType: 'freelancer',
    firstName: 'Marcus',
    lastName: 'Chen',
    platforms: ['TikTok', 'Instagram'],
    contentTypes: ['Entertainment', 'Comedy'],
    tiktokSkills: ['Trend Analysis', 'Video Editing', 'Sound Design'],
    instagramSkills: ['Reels Creation', 'Hashtag Strategy'],
    generalSkills: ['Viral Content', 'Community Management'],
    educationLevel: 'High School',
    institutionName: 'Creative Arts High School',
    certifications: ['TikTok Marketing Certified'],
    rating: 4.5,
    reviewCount: 89,
    hourlyRate: 50,
    responseTime: 'Within 1 hour',
    completedProjects: 32,
    portfolioHighlights: [
      'Created 5 viral TikTok videos with 1M+ views each',
      'Managed social media for 3 influencers'
    ],
    status: 'completed'
  },
  {
    userid: ID.unique(),
    userType: 'freelancer',
    firstName: 'Elena',
    lastName: 'Rodriguez',
    platforms: ['Instagram', 'YouTube'],
    contentTypes: ['Fashion', 'Beauty'],
    youtubeSkills: ['Beauty Tutorials', 'Product Reviews'],
    instagramSkills: ['Fashion Photography', 'Brand Partnerships'],
    generalSkills: ['Influencer Relations', 'Brand Strategy'],
    educationLevel: 'Master\'s Degree',
    institutionName: 'Fashion Institute of Technology',
    fieldOfStudy: 'Fashion Marketing',
    degreeTitle: 'Master of Arts',
    certifications: ['Instagram Marketing', 'Influencer Marketing Hub'],
    rating: 4.9,
    reviewCount: 203,
    hourlyRate: 95,
    responseTime: 'Within 24 hours',
    completedProjects: 78,
    portfolioHighlights: [
      'Partnered with 20+ fashion brands',
      'Grew Instagram following from 10K to 500K'
    ],
    status: 'completed'
  },
  {
    userid: ID.unique(),
    userType: 'freelancer',
    firstName: 'Alex',
    lastName: 'Turner',
    platforms: ['YouTube', 'TikTok'],
    contentTypes: ['Gaming', 'Technology'],
    youtubeSkills: ['Gaming Commentary', 'Live Streaming', 'Tech Reviews'],
    tiktokSkills: ['Gaming Highlights', 'Tech Tips'],
    generalSkills: ['Community Building', 'Sponsorship Management'],
    educationLevel: 'Associate Degree',
    institutionName: 'Tech Community College',
    fieldOfStudy: 'Computer Science',
    certifications: ['YouTube Creator Academy', 'Twitch Affiliate'],
    rating: 4.6,
    reviewCount: 156,
    hourlyRate: 65,
    responseTime: 'Within 6 hours',
    completedProjects: 67,
    portfolioHighlights: [
      'Built gaming community of 100K+ members',
      'Generated $50K+ in sponsorship revenue'
    ],
    status: 'completed'
  },
  {
    userid: ID.unique(),
    userType: 'freelancer',
    firstName: 'Maya',
    lastName: 'Patel',
    platforms: ['Instagram', 'Other'],
    contentTypes: ['Food', 'Health & Wellness'],
    instagramSkills: ['Food Photography', 'Recipe Content', 'Health Tips'],
    generalSkills: ['Nutrition Consulting', 'Brand Partnerships', 'Content Planning'],
    educationLevel: 'Bachelor\'s Degree',
    institutionName: 'Culinary Institute',
    fieldOfStudy: 'Nutritional Science',
    degreeTitle: 'Bachelor of Science',
    certifications: ['Certified Nutritionist', 'Food Safety'],
    rating: 4.7,
    reviewCount: 94,
    hourlyRate: 55,
    responseTime: 'Within 12 hours',
    completedProjects: 41,
    portfolioHighlights: [
      'Created meal plans for 500+ clients',
      'Featured in 3 health magazines'
    ],
    status: 'completed'
  }
]

export async function createSampleFreelancers() {
  const results = []
  
  for (const freelancer of SAMPLE_FREELANCERS) {
    try {
      console.log(`Creating freelancer: ${freelancer.firstName} ${freelancer.lastName}`)
      const result = await createOnboardingUser(freelancer)
      
      if (result.success) {
        console.log(`✅ Created: ${freelancer.firstName} ${freelancer.lastName}`)
        results.push({ success: true, name: `${freelancer.firstName} ${freelancer.lastName}`, id: result.data.$id })
      } else {
        console.log(`❌ Failed: ${freelancer.firstName} ${freelancer.lastName} - ${result.error}`)
        results.push({ success: false, name: `${freelancer.firstName} ${freelancer.lastName}`, error: result.error })
      }
    } catch (error) {
      console.error(`Error creating ${freelancer.firstName} ${freelancer.lastName}:`, error)
      results.push({ success: false, name: `${freelancer.firstName} ${freelancer.lastName}`, error: error.message })
    }
  }
  
  return results
}

// For direct execution (if needed)
if (typeof window === 'undefined') {
  // This is server-side, we can run directly
  createSampleFreelancers()
    .then((results) => {
      console.log('\n=== Sample Freelancer Creation Results ===')
      results.forEach((result, index) => {
        if (result.success) {
          console.log(`${index + 1}. ✅ ${result.name} (ID: ${result.id})`)
        } else {
          console.log(`${index + 1}. ❌ ${result.name} - ${result.error}`)
        }
      })
      
      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length
      console.log(`\nSummary: ${successful} created, ${failed} failed`)
    })
    .catch(console.error)
}