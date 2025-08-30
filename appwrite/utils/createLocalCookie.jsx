"use server"
import { cookies } from "next/headers";
import * as jose from 'jose';

export async function createLocalCookie(session) {
    const cookieStore = await cookies();
    
    // Extract only specific non-sensitive fields
    const sanitizedSession = {
        id: session.$id,
        userId: session.userId,
        provider: session.provider,
        providerUid: session.providerUid,
        countryName: session.countryName
    };

    // Create JWT from sanitized session object
    const jwtSecret = new TextEncoder().encode(process.env.JWT_KEY);
    const jwt = await new jose.SignJWT(sanitizedSession)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(jwtSecret);

    // Set localSession cookie
    cookieStore.set("localSession", jwt, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        expires: new Date(session.expire)
    });

    return jwt;
}
