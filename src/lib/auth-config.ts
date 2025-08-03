import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email/Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { username: credentials.identifier }
            ],
          },
          include: {
            umkmOwner: {
              select: { 
                id: true,
                isVerified: true,
                umkmName: true 
              },
            },
          },
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        const hasUmkmProfile = !!user.umkmOwner;
        const isVerified = user.umkmOwner?.isVerified || false;

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.username || null,
          image: user.image || null,
          role: user.role,
          username: user.username,
          phoneNumber: user.phoneNumber || null,
          address: user.address || null,
          umkmProfileStatus: hasUmkmProfile ? (isVerified ? 'verified' : 'pending') : null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user || trigger === "update") {
        let userData = user;
        
        
        if ((trigger === "update" || !token.role) && token.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            include: {
              umkmOwner: {
                select: { 
                  id: true,
                  isVerified: true,
                  umkmName: true 
                },
              },
            },
          });
          
          if (dbUser) {
            const hasUmkmProfile = !!dbUser.umkmOwner;
            const isVerified = dbUser.umkmOwner?.isVerified || false;
            
            userData = {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name || dbUser.username || null,
              image: dbUser.image || null,
              role: dbUser.role,
              username: dbUser.username,
              phoneNumber: dbUser.phoneNumber || null,
              address: dbUser.address || null,
              umkmProfileStatus: hasUmkmProfile ? (isVerified ? 'verified' : 'pending') : null
            } as any;
          }
        }
        
        if (userData) {
          token.id = userData.id;
          token.email = userData.email;
          token.name = userData.name;
          token.image = userData.image;
          token.role = (userData as any).role;
          token.username = (userData as any).username;
          token.phoneNumber = (userData as any).phoneNumber;
          token.address = (userData as any).address;
          token.umkmProfileStatus = (userData as any).umkmProfileStatus;
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      
      if (session.user?.email && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: {
            umkmOwner: {
              select: { 
                id: true,
                isVerified: true,
                umkmName: true 
              },
            },
          },
        });
        
        if (dbUser) {
          const hasUmkmProfile = !!dbUser.umkmOwner;
          const isVerified = dbUser.umkmOwner?.isVerified || false;
          
          session.user.id = dbUser.id;
          session.user.role = dbUser.role;
          session.user.username = dbUser.username;
          session.user.phoneNumber = dbUser.phoneNumber || null;
          session.user.address = dbUser.address || null;
          session.user.umkmProfileStatus = hasUmkmProfile ? (isVerified ? 'verified' : 'pending') : null;
        }
      } else {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.phoneNumber = token.phoneNumber;
        session.user.address = token.address;
        session.user.umkmProfileStatus = token.umkmProfileStatus;
      }
      
      return session;
    },
  },
};