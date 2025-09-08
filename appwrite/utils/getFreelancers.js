"use server"
import { createSessionClient } from './client'

const TABLE_ID = 'user_onboarding'

function serializeFreelancerData(doc) {
  if (!doc) return null
  
  return {
    $id: doc.$id,
    userid: doc.userid,
    firstName: doc.firstName || "",
    lastName: doc.lastName || "",
    profilePhoto: doc.profilePhoto || "",
    platforms: doc.platforms || [],
    contentTypes: doc.contentTypes || [],
    youtubeSkills: doc.youtubeSkills || [],
    instagramSkills: doc.instagramSkills || [],
    tiktokSkills: doc.tiktokSkills || [],
    generalSkills: doc.generalSkills || [],
    educationLevel: doc.educationLevel || "",
    institutionName: doc.institutionName || "",
    fieldOfStudy: doc.fieldOfStudy || "",
    degreeTitle: doc.degreeTitle || "",
    certifications: doc.certifications || [],
    // New marketplace fields
    rating: doc.rating || 0,
    reviewCount: doc.reviewCount || 0,
    hourlyRate: doc.hourlyRate || 0,
    responseTime: doc.responseTime || "Within 24 hours",
    completedProjects: doc.completedProjects || 0,
    portfolioHighlights: doc.portfolioHighlights || [],
    $createdAt: doc.$createdAt,
    $updatedAt: doc.$updatedAt
  }
}

export const getFreelancers = async (platformFilter = null, sortBy = 'recent') => {
  const {databases} = await createSessionClient()
  if (!databases) {
    return { success: false, error: 'Failed to initialize Appwrite client' }
  }

  try {
    const { Query } = await import('node-appwrite')
    
    let queries = [
      Query.equal('userType', 'freelancer'),
      Query.equal('status', 'completed'),
      Query.limit(50)
    ]

    // Add platform filtering if specified
    if (platformFilter && platformFilter !== 'all') {
      queries.push(Query.contains('platforms', platformFilter))
    }

    // Add sorting
    switch (sortBy) {
      case 'rating':
        queries.push(Query.orderDesc('rating'))
        break
      case 'price_low':
        queries.push(Query.orderAsc('hourlyRate'))
        break
      case 'price_high':
        queries.push(Query.orderDesc('hourlyRate'))
        break
      case 'reviews':
        queries.push(Query.orderDesc('reviewCount'))
        break
      case 'recent':
      default:
        queries.push(Query.orderDesc('$createdAt'))
        break
    }
    
    const result = await databases.listDocuments(
      process.env.DATABASE_ID,
      TABLE_ID,
      queries
    )
    
    if (result.documents && result.documents.length > 0) {
      const serializedFreelancers = result.documents.map(doc => serializeFreelancerData(doc))
      
      return {
        success: true,
        data: serializedFreelancers,
        count: result.total,
        message: `Found ${result.total} completed freelancer profiles`
      }
    } else {
      return {
        success: true,
        data: [],
        count: 0,
        message: 'No completed freelancer profiles found'
      }
    }
  } catch (error) {
    console.error('Error getting freelancers:', error)
    return {
      success: false,
      error: error.message || 'Failed to get freelancers',
      data: []
    }
  }
}