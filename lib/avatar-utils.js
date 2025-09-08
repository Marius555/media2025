/**
 * Avatar utility functions for generating fallback avatars
 */

/**
 * Generate a DiceBear avatar URL based on seed
 * @param {string} seed - The seed for avatar generation (usually name or initials)
 * @param {string} style - The avatar style ('adventurer', 'lorelei', 'personas', etc.)
 * @param {number} size - The size of the avatar
 * @returns {string} The avatar URL
 */
export const generateDiceBearAvatar = (seed, style = 'adventurer', size = 64) => {
  const cleanSeed = encodeURIComponent(seed.trim())
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${cleanSeed}&size=${size}`
}

/**
 * Generate a UI Avatars URL based on name
 * @param {string} name - The full name for avatar generation
 * @param {number} size - The size of the avatar
 * @param {string} background - Background color (hex without #)
 * @param {string} color - Text color (hex without #)
 * @returns {string} The avatar URL
 */
export const generateUIAvatar = (name, size = 64, background = '3B82F6', color = 'FFFFFF') => {
  const cleanName = encodeURIComponent(name.trim())
  return `https://ui-avatars.com/api/?name=${cleanName}&size=${size}&background=${background}&color=${color}&rounded=true&bold=true`
}

/**
 * Generate initials from first and last name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} The initials (max 2 characters)
 */
export const generateInitials = (firstName = '', lastName = '') => {
  const first = firstName.trim().charAt(0).toUpperCase()
  const last = lastName.trim().charAt(0).toUpperCase()
  
  if (!first && !last) return 'U' // Default to 'U' for User
  if (!last) return first
  
  return first + last
}

/**
 * Get the appropriate avatar URL for a user
 * @param {Object} user - User object with profile photo and name info
 * @param {string} user.profilePhoto - The user's uploaded profile photo URL
 * @param {string} user.firstName - User's first name
 * @param {string} user.lastName - User's last name
 * @param {number} size - Desired avatar size
 * @returns {Object} Avatar info with URL, initials, and fallback status
 */
export const getAvatarInfo = (user = {}, size = 64) => {
  const { profilePhoto = '', firstName = '', lastName = '' } = user
  
  // If user has uploaded photo, use it
  if (profilePhoto && profilePhoto.trim()) {
    return {
      url: profilePhoto,
      initials: generateInitials(firstName, lastName),
      isFallback: false
    }
  }
  
  // Generate fallback avatar
  const displayName = `${firstName} ${lastName}`.trim() || 'Anonymous User'
  const initials = generateInitials(firstName, lastName)
  
  // Use different avatar services based on preference
  const avatarUrl = generateUIAvatar(displayName, size)
  // Alternative: generateDiceBearAvatar(displayName, 'adventurer', size)
  
  return {
    url: avatarUrl,
    initials,
    isFallback: true,
    displayName
  }
}

/**
 * Color palette for consistent avatar backgrounds
 */
export const AVATAR_COLORS = [
  '3B82F6', // Blue
  'EF4444', // Red  
  '10B981', // Green
  'F59E0B', // Yellow
  'EC4899', // Pink
  '8B5CF6', // Purple
  '06B6D4', // Cyan
  'F97316', // Orange
  '84CC16', // Lime
  '6366F1', // Indigo
]

/**
 * Get a consistent color based on user's name
 * @param {string} name - User's name
 * @returns {string} Hex color without #
 */
export const getConsistentColor = (name = '') => {
  const cleanName = name.trim().toLowerCase()
  const index = cleanName.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[index] || AVATAR_COLORS[0]
}

/**
 * Generate an avatar with consistent coloring
 * @param {Object} user - User object
 * @param {number} size - Avatar size
 * @returns {Object} Avatar info
 */
export const getConsistentAvatar = (user = {}, size = 64) => {
  const { profilePhoto = '', firstName = '', lastName = '' } = user
  
  if (profilePhoto && profilePhoto.trim()) {
    return {
      url: profilePhoto,
      initials: generateInitials(firstName, lastName),
      isFallback: false
    }
  }
  
  const displayName = `${firstName} ${lastName}`.trim() || 'Anonymous User'
  const initials = generateInitials(firstName, lastName)
  const backgroundColor = getConsistentColor(displayName)
  
  const avatarUrl = generateUIAvatar(displayName, size, backgroundColor)
  
  return {
    url: avatarUrl,
    initials,
    isFallback: true,
    displayName,
    backgroundColor: `#${backgroundColor}`
  }
}