import { NextResponse } from "next/server";
import decript from "@/middleware/decript";
import encrypt from "@/middleware/encrypt";
import { LogoutUser } from "@/appwrite/utils/logoutUser";

async function handleInvalidSession(request) {
  try {
    await LogoutUser();
  } catch (error) {
    console.error('Error during logout:', error);
  }

  const resp = NextResponse.redirect(new URL("/", request.url));
  resp.cookies.set({
    name: "localSession",
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(Date.now() - 1000),
  });
  resp.cookies.set({
    name: "appSession",
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(Date.now() - 1000),
  });
  return resp;
}

async function updateLocalSessionCookie(request) {
  const resp = NextResponse.next();
  const check = request.cookies.get("localSession")?.value;
  if (!check) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const result = await decript(check);
    
    if (!result.success || !result.payload) {
      return await handleInvalidSession(request);
    }

    const payload = result.payload;
    
    if (!payload.exp) {
      return await handleInvalidSession(request);
    }

    const expirationTime = new Date(payload.exp * 1000);
    
    if (expirationTime <= new Date()) {
      return await handleInvalidSession(request);
    }

    resp.cookies.set({
      name: "localSession",
      value: await encrypt(payload, expirationTime),
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: expirationTime,
    });
    return resp;
  } catch (error) {
    console.error('Cookie validation error:', error);
    return await handleInvalidSession(request);
  }
}

export default updateLocalSessionCookie;
