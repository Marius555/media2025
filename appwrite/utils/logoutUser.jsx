"use server"
import { createSessionClient } from "./client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function LogoutUser() {
    try {
        const sessionClient = await createSessionClient();
        
        // Check if session client was created successfully
        if (!sessionClient.success === false) {
            const { account } = sessionClient;
            
            // Delete the current session from Appwrite
            await account.deleteSession('current');
        }
        
        // Clear all authentication cookies
        const cookieStore = await cookies();
        cookieStore.delete("appSession");
        cookieStore.delete("localSession");
        
        return { success: true, message: "Logged out successfully" };
    } catch (error) {
        // Even if there's an error with Appwrite, clear local cookies
        const cookieStore = await cookies();
        cookieStore.delete("appSession");
        cookieStore.delete("localSession");
        
        return { success: true, message: "Logged out successfully" };
    }
}

export async function LogoutAndRedirect() {
    await LogoutUser();
    redirect('/');
}