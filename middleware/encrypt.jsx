"use server"
import * as jose from 'jose';

const encrypt = async(session, exp) => {
    const dateSet = exp || '24h'
    console.log("dateSet", dateSet) 
    const jwtSecret = new TextEncoder().encode(process.env.JWT_KEY);
    const encrypted = await new jose.SignJWT(session)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(dateSet)
        .sign(jwtSecret);

    return encrypted
}

export default encrypt
