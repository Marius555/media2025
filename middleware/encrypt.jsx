"use server"
import * as jose from 'jose';

const encrypt = async(session) => {
    const jwtSecret = new TextEncoder().encode(process.env.JWT_KEY);
    const encrypted = await new jose.SignJWT(session)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(jwtSecret);

    return encrypted
}

export default encrypt
