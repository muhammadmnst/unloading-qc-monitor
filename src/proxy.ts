import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/login", "/tv"]
const adminRoutes = ["/admin"]
const qcRoutes = ["/qc"]
const operationalRoutes = ["/operational"]

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session?.user

  // Allow public routes through
  if (publicRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  const role = session?.user?.role

  // Admin-only routes
  if (adminRoutes.some((r) => nextUrl.pathname.startsWith(r)) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl))
  }

  // QC routes — ADMIN and QC
  if (
    qcRoutes.some((r) => nextUrl.pathname.startsWith(r)) &&
    role !== "ADMIN" &&
    role !== "QC"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl))
  }

  // Operational routes — ADMIN and OPERATIONAL
  if (
    operationalRoutes.some((r) => nextUrl.pathname.startsWith(r)) &&
    role !== "ADMIN" &&
    role !== "OPERATIONAL"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
