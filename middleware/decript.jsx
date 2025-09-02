import * as jose from 'jose';

const decript = async (value) => {
  // Input validation
  if (!value || typeof value !== 'string') {
    console.error('Decript: Invalid or missing JWT token');
    return { success: false, error: 'Invalid or missing JWT token', payload: null };
  }

  // Check if JWT_KEY is available
  if (!process.env.JWT_KEY) {
    console.error('Decript: JWT_KEY environment variable is not set');
    return { success: false, error: 'JWT_KEY not configured', payload: null };
  }

  // Basic JWT format validation (should have 3 parts separated by dots)
  const jwtParts = value.split('.');
  if (jwtParts.length !== 3) {
    console.error('Decript: Invalid JWT format - should have 3 parts');
    return { success: false, error: 'Invalid JWT format', payload: null };
  }

  try {
    console.log('Decript: Attempting to verify JWT token');
    const { payload } = await jose.jwtVerify(
      value, 
      new TextEncoder().encode(process.env.JWT_KEY),
      {
        algorithms: ['HS256']
      }
    );
    
    console.log('Decript: JWT verification successful');
    return { success: true, error: null, payload };
  } catch (error) {
    console.error('Decript: JWT verification failed:', error.message);
    return { success: false, error: error.message, payload: null };
  }
}

export default decript
