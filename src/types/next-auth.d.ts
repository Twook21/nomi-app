// src/types/next-auth.d.ts

import NextAuth from "next-auth"
import { DefaultSession, DefaultUser } from "next-auth";

// Sesuaikan ini dengan tipe enum atau union role Anda yang sebenarnya
// Jika di Prisma Anda hanya string, biarkan string.
type UserRole = "customer" | "umkm_owner" | "admin" | string;
type UmkmProfileStatus = "verified" | "pending" | null | string;

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null; // <-- Izinkan null
      image?: string | null; // <-- Izinkan null
      role: UserRole;
      username?: string | null;
      umkmProfileStatus?: UmkmProfileStatus;
      phoneNumber?: string | null; // <-- Tambahkan ini dan izinkan null
      address?: string | null;    // <-- Tambahkan ini dan izinkan null
    } & DefaultSession["user"];
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the object returned from the `authorize` callback for Credentials provider.
   */
  interface User extends DefaultUser {
    id: string;
    email: string;
    name?: string | null; // <-- Izinkan null
    image?: string | null; // <-- Izinkan null
    role: UserRole;
    username?: string | null;
    umkmProfileStatus?: UmkmProfileStatus;
    phoneNumber?: string | null; // <-- Tambahkan ini dan izinkan null
    address?: string | null;    // <-- Tambahkan ini dan izinkan null
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string; // Harus 'id' bukan 'userId' untuk konsistensi dengan 'User'
    role: UserRole;
    username?: string | null;
    umkmProfileStatus?: UmkmProfileStatus;
    email: string;
    name?: string | null;
    image?: string | null;
    phoneNumber?: string | null; // <-- Tambahkan ini dan izinkan null
    address?: string | null;    // <-- Tambahkan ini dan izinkan null
  }
}