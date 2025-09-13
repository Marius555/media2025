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

export const getFreelancerById = async (id) => {
  const {databases} = await createSessionClient()
  if (!databases) {
    return { success: false, error: 'Failed to initialize Appwrite client' }
  }

  try {
    const { Query } = await import('node-appwrite')
    
    // Get the specific document by ID
    const result = await databases.getDocument(
      process.env.DATABASE_ID,
      TABLE_ID,
      id
    )
    
    // Check if this is a completed freelancer profile
    if (result.userType !== 'freelancer' || result.status !== 'completed') {
      return {
        success: false,
        error: 'Freelancer profile not found or not completed',
        data: null
      }
    }
    
    const serializedFreelancer = serializeFreelancerData(result)
    
    return {
      success: true,
      data: serializedFreelancer,
      message: `Found freelancer profile for ${serializedFreelancer.firstName} ${serializedFreelancer.lastName}`
    }
    
  } catch (error) {
    console.error('Error getting freelancer by ID:', error)
    
    // Handle specific Appwrite errors
    if (error.code === 404) {
      return {
        success: false,
        error: 'Freelancer profile not found',
        data: null
      }
    }
    
    return {
      success: false,
      error: error.message || 'Failed to get freelancer profile',
      data: null
    }
  }
}