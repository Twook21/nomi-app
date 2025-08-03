import { NextResponse } from 'next/server';

/**
 * Mengirim respons sukses JSON.
 * @param data Data yang akan dikirim.
 * @param status Kode status HTTP (default: 200).
 */
export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Mengirim respons error JSON.
 * @param message Pesan error.
 * @param status Kode status HTTP (default: 500).
 * @param details Detail error tambahan (opsional).
 */
export function errorResponse(message: string, status: number = 500, details?: any) {
  return NextResponse.json({ message, details }, { status });
}