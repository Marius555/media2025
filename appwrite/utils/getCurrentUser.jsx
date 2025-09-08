"use server"
import { createSessionClient } from "./client";
import { cookies } from "next/headers";
import * as jose from 'jose';

export async function getCurrentUser() {
    try {
        const sessionClient = await createSessionClient();
        
        // Check if session client was created successfully
        if (sessionClient.success === false) {
            return { success: false, user: null, message: "No active session" };
        }
        
        const { account } = sessionClient;
        
        // Get current user from Appwrite
        const user = await account.get();
        
        return { 
            success: true, 
            user: {
                $id: user.$id,
                name: user.name,
                email: user.email,
                emailVerification: user.emailVerification,
                status: user.status,
                prefs: user.prefs
            }
        };
    } catch (error) {
        return { success: false, user: null, message: error.message };
    }
}

export async function getLocalUserSession() {
    try {
        const cookieStore = await cookies();
        const localSessionCookie = cookieStore.get("localSession");
        
        if (!localSessionCookie || !localSessionCookie.value) {
            return { success: false, session: null, message: "No local session found" };
        }
        
        // Verify and decode JWT
        const jwtSecret = new TextEncoder().encode(process.env.JWT_KEY);
        const { payload } = await jose.jwtVerify(localSessionCookie.value, jwtSecret);
        
        return { 
            success: true, 
            session: {
                id: payload.id,
                userId: payload.userId,
                provider: payload.provider,
                providerUid: payload.providerUid,
                countryName: payload.countryName
            }
        };
    } catch (error) {
        return { success: false, session: null, message: error.message };
    }
}

export async function isUserLoggedIn() {
    const userResult = await getCurrentUser();
    return userResult.success && userResult.user !== null;
}