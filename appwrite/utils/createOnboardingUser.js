"use server"
import { createSessionClient } from './client'
import { ID } from 'node-appwrite'

const TABLE_ID = 'user_onboarding'

// Helper function to serialize Appwrite documents for client-server communication
function serializeAppwriteDocument(doc) {
  if (!doc) return null
  
  return {
    $id: doc.$id,
    userType: doc.userType,
    platforms: doc.platforms || [],
    contentTypes: doc.contentTypes || [],
    firstName: doc.firstName || "",
    lastName: doc.lastName || "",
    profilePhoto: doc.profilePhoto || "",
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
        userType: data.userType,
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
    // Note: Using legacy databases API as MCP functions haven't updated to TablesDB yet
    // In new TablesDB API, this would be: databases.updateRow()
    const row = await databases.updateDocument(
      process.env.DATABASE_ID,
      TABLE_ID,
      rowId,
      data
    )
    
    return {
      success: true,
      data: serializeAppwriteDocument(row),
      message: 'Onboarding row updated successfully'
    }
  } catch (error) {
    console.error('Error updating onboarding user:', error)
    return {
      success: false,
      error: error.message || 'Failed to update onboarding row'
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
  const { storage } = await createSessionClient()
  if (!storage) {
    return { success: false, error: 'Failed to initialize Appwrite storage client' }
  }

  try {
    // Create a unique file ID
    const fileId = ID.unique()
    
    // Upload file to Appwrite Storage
    // You'll need to create a bucket for profile photos in Appwrite Console first
    const result = await storage.createFile(
      process.env.STORAGE_ID, // Create this bucket in Appwrite Console
      fileId,
      file
    )
    
    // Generate the file URL manually
    const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.STORAGE_ID}/files/${result.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
    
    return {
      success: true,
      data: { ...result, url: fileUrl },
      message: 'Profile photo uploaded successfully'
    }
  } catch (error) {
    console.error('Error uploading profile photo:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload profile photo'
    }
  }
}