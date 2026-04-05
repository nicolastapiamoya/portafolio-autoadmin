import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl))
  }
})

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
}
