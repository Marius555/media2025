import React from "react";
import ParentStepper from "@/components/OnboardingStepper/parentStepper";
import decript from "@/middleware/decript";
import { cookies } from "next/headers";

const page = async() => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("localSession");
  
  let decryptedSession = { success: false, error: 'No session cookie', payload: null };
  if (sessionCookie?.value) {
    decryptedSession = await decript(sessionCookie.value);
  }
  console.log(decryptedSession.payload.userId)
    
  

  return (
    <div className="flex items-center justify-center">
      <ParentStepper userid={decryptedSession.payload.userId}/>
    </div>
  );
};

export default page;
