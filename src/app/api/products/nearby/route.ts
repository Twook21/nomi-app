import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latitude = parseFloat(searchParams.get('latitude') || '');
  const longitude = parseFloat(searchParams.get('longitude') || '');
  const radiusKm = parseFloat(searchParams.get('radiusKm') || '10'); // Default radius 10km
  const categoryId = searchParams.get('category');
  const search = searchParams.get('search');

  if (isNaN(latitude) || isNaN(longitude)) {
    return errorResponse('Latitude and longitude are required and must be valid numbers', 400);
  }

  try {
    // NOTE: Implementasi geospasial yang akurat di PostgreSQL biasanya memerlukan ekstensi PostGIS.
    // Untuk tujuan demonstrasi dan tanpa PostGIS, kita akan melakukan filter kasar atau mengandalkan data alamat
    // yang lebih kompleks untuk perhitungan jarak di backend, atau memfilter di frontend.
    // Jika Anda menggunakan PostGIS, query akan jauh lebih efisien.
    // Contoh ini akan mengambil semua UMKM dan melakukan perhitungan jarak sederhana di memori (tidak efisien untuk skala besar).
    // Implementasi yang lebih baik akan melibatkan penyimpanan koordinat di UMKM dan query PostGIS.

    const allUmkmOwners = await prisma.uMKMOwner.findMany({
      select: {
        id: true,
        umkmName: true,
        umkmAddress: true, // Asumsi umkmAddress bisa di-geocode ke koordinat jika diperlukan
        products: {
          where: {
            isAvailable: true,
            expirationDate: {
              gt: new Date(),
            },
            ...(categoryId && { categoryId }),
            ...(search && { productName: { contains: search, mode: 'insensitive' } }),
          },
          include: {
            category: {
              select: { categoryName: true },
            },
          },
        },
      },
      where: {
        isVerified: true,
      }
    });

    const productsNearby: any[] = [];

    // Fungsi dummy untuk menghitung jarak (Haversine formula akan lebih akurat)
    // Ini hanya placeholder. Dalam produksi, gunakan geocoding dan PostGIS.
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Radius bumi dalam kilometer
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // NOTE: Untuk implementasi nyata, Anda perlu meng-geocode `umkmAddress` menjadi `latitude` dan `longitude`
    // atau menyimpannya langsung di database.
    // Untuk demo ini, kita akan menggunakan dummy koordinat untuk UMKM.
    const dummyUmkmCoordinates: { [key: string]: { lat: number, lon: number } } = {
      // Contoh dummy koordinat untuk UMKM (ganti dengan data nyata)
      'umkm_id_1': { lat: -6.917464, lon: 107.619122 }, // Bandung
      'umkm_id_2': { lat: -6.890444, lon: 107.610641 }, // Dekat Bandung
      // ... tambahkan lebih banyak jika diperlukan
    };

    for (const umkm of allUmkmOwners) {
      // Asumsi UMKM memiliki koordinat atau bisa di-geocode
      const umkmCoords = dummyUmkmCoordinates[umkm.id]; // Ganti dengan logika geocoding nyata
      if (!umkmCoords) continue; // Lewati jika tidak ada koordinat

      const distance = calculateDistance(latitude, longitude, umkmCoords.lat, umkmCoords.lon);

      if (distance <= radiusKm) {
        for (const product of umkm.products) {
          productsNearby.push({
            ...product,
            umkmOwner: {
              id: umkm.id,
              umkmName: umkm.umkmName,
              umkmAddress: umkm.umkmAddress,
            },
            distance: parseFloat(distance.toFixed(2)), // Jarak dalam KM
          });
        }
      }
    }

    // Urutkan berdasarkan jarak terdekat
    productsNearby.sort((a, b) => a.distance - b.distance);

    return successResponse(productsNearby);

  } catch (error: any) {
    console.error('Error fetching nearby products:', error);
    return errorResponse('Failed to fetch nearby products', 500, error.message);
  }
}