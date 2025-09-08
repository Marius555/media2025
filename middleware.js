"use server"
import { NextResponse } from 'next/server'
import updateLocalSessionCookie from './components/middleware/updateLocalSessionCookie'


export async function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/auth')) {
    
    if(request.cookies.get("localSession")?.value){
        return await updateLocalSessionCookie(request)
    }
    else{
        return NextResponse.redirect(new URL('/', request.url))
    }
}
return NextResponse.next()
 
  
}