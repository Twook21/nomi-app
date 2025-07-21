// lib/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from './prisma'; // Pastikan path ini benar
import { successResponse, errorResponse } from './api-response'; // Pastikan path ini benar

// Interface untuk data yang didekode dari token JWT
interface DecodedToken {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

// Kunci rahasia untuk JWT
// DI PRODUKSI, JANGAN GUNAKAN NILAI DEFAULT INI!
// Pastikan process.env.JWT_SECRET telah diatur di file .env Anda.
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_please_change_this_in_production_for_security';

/**
 * Fungsi utilitas untuk membuat token JWT.
 * @param userId ID pengguna.
 * @param role Peran pengguna (e.g., 'customer', 'umkm_owner', 'admin').
 * @returns String token JWT.
 */
export function generateToken(userId: string, role: string): string {
  if (!JWT_SECRET || JWT_SECRET === 'your_super_secret_jwt_key_please_change_this_in_production_for_security') {
    console.error('JWT_SECRET is not set or is using default value. Please set it in your .env file!');
    throw new Error('JWT_SECRET is not configured properly.');
  }
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '1d' }); // Token berlaku 1 hari
}

/**
 * Fungsi utilitas untuk mengautentikasi dan mengotorisasi permintaan.
 * Memeriksa token JWT dari header Authorization atau cookie, dan memvalidasi peran pengguna.
 * @param request Objek NextRequest dari route.
 * @param requiredRoles Array string peran yang diizinkan (misal: ['admin', 'umkm_owner']). Kosong berarti hanya butuh autentikasi.
 * @returns Objek yang berisi data pengguna yang didekode atau objek NextResponse jika terjadi error.
 */
export async function authenticateAndAuthorize(
  request: NextRequest,
  requiredRoles: string[] = [] // Default-nya array kosong, artinya hanya butuh autentikasi
): Promise<{ user: DecodedToken | null; response?: NextResponse }> {
  let token: string | undefined;

  // 1. Coba ambil token dari header Authorization (lebih umum untuk API)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Jika tidak ada di header, coba ambil dari cookie (umum untuk sesi web)
  if (!token) {
    token = request.cookies.get('token')?.value;
  }

  // Jika token tidak ditemukan sama sekali
  if (!token) {
    return { response: errorResponse('Unauthorized: Authentication token missing', 401), user: null };
  }

  try {
    if (!JWT_SECRET || JWT_SECRET === 'your_super_secret_jwt_key_please_change_this_in_production_for_security') {
      console.error('JWT_SECRET is not set or is using default value. Please set it in your .env file!');
      throw new Error('JWT_SECRET is not configured properly.');
    }
    
    // Verifikasi token JWT
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    // Verifikasi ulang user dan role dari database untuk keamanan tambahan
    // Ini mencegah kasus jika role di token sudah kadaluarsa atau user dihapus/role diubah di DB
    const userDb = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true, id: true }, // Ambil role dan ID untuk verifikasi
    });

    if (!userDb) {
      console.warn(`Auth Error: User with ID ${decoded.userId} from token not found in DB.`);
      return { response: errorResponse('Unauthorized: User not found in database', 401), user: null };
    }

    // Pastikan role di token cocok dengan role di database
    // Ini penting jika role user diubah setelah token diterbitkan
    if (userDb.role !== decoded.role) {
      console.warn(`Auth Error: Role mismatch for user ${decoded.userId}. Token: ${decoded.role}, DB: ${userDb.role}.`);
      return { response: errorResponse('Unauthorized: User role changed, please re-login', 401), user: null };
    }

    // Periksa apakah peran pengguna memenuhi persyaratan (requiredRoles)
    if (requiredRoles.length > 0 && !requiredRoles.includes(userDb.role)) {
      console.warn(`Auth Error: User ${userDb.id} with role ${userDb.role} attempted to access restricted resource. Required: ${requiredRoles.join(', ')}`);
      return { response: errorResponse('Forbidden: Insufficient role permissions', 403), user: null };
    }

    // Jika semua lolos, kembalikan data pengguna yang didekode
    return { user: decoded };
  } catch (error: any) {
    // Tangani error verifikasi JWT (misal: token kadaluarsa, token tidak valid)
    if (error.name === 'TokenExpiredError') {
      console.warn('Auth Error: Token expired.');
      return { response: errorResponse('Unauthorized: Token expired', 401), user: null };
    }
    if (error.name === 'JsonWebTokenError') {
      console.warn('Auth Error: Invalid token provided.');
      return { response: errorResponse('Unauthorized: Invalid token', 401), user: null };
    }
    console.error('Error during token verification in authenticateAndAuthorize:', error);
    return { response: errorResponse('Internal Server Error during authentication', 500), user: null };
  }
}

/**
 * Helper untuk mengelola respons login/register dengan pengaturan cookie yang aman.
 * @param token Token JWT yang akan disimpan.
 * @param successData Data sukses yang akan dikirim dalam respons.
 * @param statusCode Status HTTP (default 200).
 * @returns NextResponse dengan cookie token yang sudah diatur.
 */
export function setAuthCookie(token: string, successData: any, statusCode: number = 200): NextResponse {
  const response = successResponse(successData, statusCode);
  response.cookies.set('token', token, {
    httpOnly: true, // Tidak bisa diakses oleh JavaScript di browser
    secure: process.env.NODE_ENV === 'production', // Hanya kirim via HTTPS di produksi
    sameSite: 'strict', // Melindungi dari CSRF
    maxAge: 60 * 60 * 24, // 1 hari (sama dengan expiresIn token)
    path: '/', // Tersedia di seluruh aplikasi
  });
  return response;
}

/**
 * Helper untuk menghapus cookie token saat logout.
 * @returns NextResponse dengan cookie token yang dihapus.
 */
export function clearAuthCookie(): NextResponse {
  const response = successResponse({ message: 'Logout successful' }, 200);
  response.cookies.delete('token');
  return response;
}