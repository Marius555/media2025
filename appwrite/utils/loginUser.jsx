"use server"
import { createAdminClient } from "./client";
import { cookies } from "next/headers";
import { createLocalCookie } from "./createLocalCookie";

export async function LoginUser(data) {
    try {
        const email = await data.email.trim();
        const password = await data.password;
      
        const { account } = await createAdminClient();

        const session = await account.createEmailPasswordSession(email, password);
        console.log("Original session:", session);
        
        const cookieStore = await cookies()
        cookieStore.set("appSession", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          expires: new Date(session.expire)
        });

        // Create local session using the shared function
        await createLocalCookie(session);
      
        return { success: true, message: "User Created Successfull" };
    } catch (error) {
        return { success: false, message: error.message || "An error occurred" };
    }
}

