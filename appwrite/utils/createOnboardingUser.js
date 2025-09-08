"use server"
import { createSessionClient } from './client'
import { ID } from 'node-appwrite'

const TABLE_ID = 'user_onboarding'

// Helper function to serialize Appwrite documents for client-server communication
function serializeAppwriteDocument(doc) {
  if (!doc) return null
  
  return {
    $id: doc.$id,
    userid: doc.userid,
    userType: doc.userType,
    // Freelancer fields
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
    studyYears: doc.studyYears || "",
    certifications: doc.certifications || [],
    // Client fields
    servicesNeeded: doc.servicesNeeded || [],
    contentType: doc.contentType || "",
    timeline: doc.timeline || "",
    platformFocus: doc.platformFocus || [],
    budgetRange: doc.budgetRange || "",
    projectGoals: doc.projectGoals || [],
    communicationStyle: doc.communicationStyle || "",
    additionalRequirements: doc.additionalRequirements || "",
    // Common fields
    firstName: doc.firstName || "",
    lastName: doc.lastName || "",
    profilePhoto: doc.profilePhoto || "",
    status: doc.status,
    completedAt: doc.completedAt,
    $createdAt: doc.$createdAt,
    $updatedAt: doc.$updatedAt,
    $permissions: doc.$permissions || [],
    $collectionId: doc.$collectionId,
    $databaseId: doc.$databaseId
  }
}

export const createOnboardingUser = async (data) => {

  const {databases} = await createSessionClient()
  if (!databases) {
    return { success: false, error: 'Failed to initialize Appwrite client' }
  }

  try {
    // Note: Using legacy databases API as MCP functions haven't updated to TablesDB yet
    // In new TablesDB API, this would be: databases.createRow()
    const row = await databases.createDocument(
      process.env.DATABASE_ID,
      TABLE_ID,
      ID.unique(),
      {
        userid: data.userid,
        userType: data.userType,
        // Freelancer fields
        platforms: data.platforms || [],
        contentTypes: data.contentTypes || [],
        youtubeSkills: data.youtubeSkills || [],
        instagramSkills: data.instagramSkills || [],
        tiktokSkills: data.tiktokSkills || [],
        generalSkills: data.generalSkills || [],
        educationLevel: data.educationLevel || "",
        institutionName: data.institutionName || "",
        fieldOfStudy: data.fieldOfStudy || "",
        degreeTitle: data.degreeTitle || "",
        studyYears: data.studyYears || "",
        certifications: data.certifications || [],
        // Client fields
        servicesNeeded: data.servicesNeeded || [],
        contentType: data.contentType || "",
        timeline: data.timeline || "",
        platformFocus: data.platformFocus || [],
        budgetRange: data.budgetRange || "",
        projectGoals: data.projectGoals || [],
        communicationStyle: data.communicationStyle || "",
        additionalRequirements: data.additionalRequirements || "",
        // Common fields
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        profilePhoto: data.profilePhoto || "",
        // Default marketplace fields for new users
        rating: data.rating || 0,
        reviewCount: data.reviewCount || 0,
        hourlyRate: data.hourlyRate || 0,
        responseTime: data.responseTime || "Within 24 hours",
        completedProjects: data.completedProjects || 0,
        portfolioHighlights: data.portfolioHighlights || [],
        status: 'pending',
        completedAt: null,
      }
    )
    
    return {
      success: true,
      data: serializeAppwriteDocument(row),
      message: 'Onboarding row created successfully'
    }
  } catch (error) {
    console.error('Error creating onboarding user:', error)
    return {
      success: false,
      error: error.message || 'Failed to create onboarding row'
    }
  }
}

export const updateOnboardingUser = async (rowId, data) => {
  const {databases} = await createSessionClient()
  if (!databases) {
    return { success: false, error: 'Failed to initialize Appwrite client' }
  }

  try {
    console.log("updateOnboardingUser: Received data for update:", data)
    console.log("updateOnboardingUser: rowId:", rowId)
    
    // Note: Using legacy databases API as MCP functions haven't updated to TablesDB yet
    // In new TablesDB API, this would be: databases.updateRow()
    const row = await databases.updateDocument(
      process.env.DATABASE_ID,
      TABLE_ID,
      rowId,
      data
    )
    
    console.log("updateOnboardingUser: Successfully updated document:", row)
    
    return {
      success: true,
      data: serializeAppwriteDocument(row),
      message: 'Onboarding row updated successfully'
    }
  } catch (error) {
    console.error('Error updating onboarding user:', error)
    console.error('Data that failed to update:', data)
    return {
      success: false,
      error: error.message || 'Failed to update onboarding row'
    }
  }
}

export const getOnboardingUser = async (rowId) => {
  const {databases} = await createSessionClient()
  if (!databases) {
    return { success: false, error: 'Failed to initialize Appwrite client' }
  }

  try {
    const row = await databases.getDocument(
      process.env.DATABASE_ID,
      TABLE_ID,
      rowId
    )
    
    return {
      success: true,
      data: serializeAppwriteDocument(row),
      message: 'Onboarding row retrieved successfully'
    }
  } catch (error) {
    console.error('Error getting onboarding user:', error)
    return {
      success: false,
      error: error.message || 'Failed to get onboarding row'
    }
  }
}

export const getOnboardingUserByUserId = async (userid) => {
  const {databases} = await createSessionClient()
  if (!databases) {
    return { success: false, error: 'Failed to initialize Appwrite client' }
  }

  try {
    const { Query } = await import('node-appwrite')
    
    const result = await databases.listDocuments(
      process.env.DATABASE_ID,
      TABLE_ID,
      [
        Query.equal('userid', userid),
        Query.limit(1)
      ]
    )
    
    if (result.documents.length > 0) {
      return {
        success: true,
        data: serializeAppwriteDocument(result.documents[0]),
        message: 'Existing onboarding record found for user'
      }
    } else {
      return {
        success: false,
        error: 'No onboarding record found for this user',
        data: null
      }
    }
  } catch (error) {
    console.error('Error getting onboarding user by userid:', error)
    return {
      success: false,
      error: error.message || 'Failed to get onboarding row by userid'
    }
  }
}

export const completeOnboarding = async (rowId) => {
  const {databases} = await createSessionClient()
  if (!databases) {
    return { success: false, error: 'Failed to initialize Appwrite client' }
  }

  try {
    // Note: Using legacy databases API as MCP functions haven't updated to TablesDB yet
    // In new TablesDB API, this would be: databases.updateRow()
    const row = await databases.updateDocument(
      process.env.DATABASE_ID,
      TABLE_ID,
      rowId,
      {
        status: 'completed',
        completedAt: new Date().toISOString()
      }
    )
    
    return {
      success: true,
      data: serializeAppwriteDocument(row),
      message: 'Onboarding completed successfully'
    }
  } catch (error) {
    console.error('Error completing onboarding:', error)
    return {
      success: false,
      error: error.message || 'Failed to complete onboarding'
    }
  }
}

export const uploadProfilePhoto = async (file) => {
  // Validate input
  if (!file) {
    return { success: false, error: 'No file provided for upload' }
  }

  // Validate file type
  if (!file.type?.startsWith('image/')) {
    return { success: false, error: 'File must be an image' }
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return { success: false, error: 'File size must be less than 5MB' }
  }

  // Check if storage ID is configured
  if (!process.env.STORAGE_ID) {
    console.error('STORAGE_ID environment variable is not configured')
    return { success: false, error: 'Storage not configured' }
  }

  const { storage } = await createSessionClient()
  if (!storage) {
    return { success: false, error: 'Failed to initialize Appwrite storage client' }
  }

  try {
    // Create a unique file ID with descriptive prefix
    const fileId = `profile_${ID.unique()}`
    
    console.log(`Uploading file: ${file.name} (${file.size} bytes) to bucket: ${process.env.STORAGE_ID}`)
    
    // Upload file to Appwrite Storage
    const result = await storage.createFile(
      process.env.STORAGE_ID,
      fileId,
      file
    )
    
    console.log('File uploaded successfully:', result)
    
    // Generate the file URL manually
    const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.STORAGE_ID}/files/${result.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
    
    return {
      success: true,
      data: { 
        ...result, 
        url: fileUrl,
        originalName: file.name,
        size: file.size,
        type: file.type
      },
      message: 'Profile photo uploaded successfully'
    }
  } catch (error) {
    console.error('Error uploading profile photo:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to upload profile photo'
    
    if (error.code === 401) {
      errorMessage = 'Not authorized to upload files. Please check your permissions.'
    } else if (error.code === 404) {
      errorMessage = 'Storage bucket not found. Please check your configuration.'
    } else if (error.code === 413) {
      errorMessage = 'File is too large. Maximum size is 5MB.'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return {
      success: false,
      error: errorMessage,
      details: error.code ? `Error code: ${error.code}` : undefined
    }
  }
}