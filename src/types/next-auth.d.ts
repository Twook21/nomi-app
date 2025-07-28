import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      image?: string
      role: string
      username?: string
      umkmProfileStatus?: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
    role: string
    username?: string
    umkmProfileStatus?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    role: string
    username?: string
    umkmProfileStatus?: string
  }
}