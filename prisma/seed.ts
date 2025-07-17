import { PrismaClient, Role, PartnerStatus, ProductStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Hapus data lama untuk menghindari duplikasi (opsional, hati-hati di produksi)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('Old data deleted.');

  // --- Buat Pengguna (Users) ---
  const passwordHash = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      role: Role.ADMIN,
      emailVerifiedAt: new Date(),
    },
  });

  const partnerUser1 = await prisma.user.create({
    data: {
      name: 'Toko Roti Enak',
      email: 'partner1@example.com',
      passwordHash,
      role: Role.PARTNER,
      emailVerifiedAt: new Date(),
    },
  });

  const partnerUser2 = await prisma.user.create({
    data: {
      name: 'Warung Bu Susi',
      email: 'partner2@example.com',
      passwordHash,
      role: Role.PARTNER,
      emailVerifiedAt: new Date(),
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: 'Budi Santoso',
      email: 'budi@example.com',
      passwordHash,
      role: Role.USER,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('Users created:', { adminUser, partnerUser1, partnerUser2, regularUser });

  // --- Buat Partner ---
  const partner1 = await prisma.partner.create({
    data: {
      userId: partnerUser1.id,
      storeName: 'Toko Roti Enak',
      storeAddress: 'Jl. Cihampelas No. 160, Bandung',
      storePhone: '081234567890',
      description: 'Menjual berbagai macam roti dan kue sisa produksi hari ini dengan harga miring.',
      status: PartnerStatus.APPROVED,
    },
  });

  const partner2 = await prisma.partner.create({
    data: {
      userId: partnerUser2.id,
      storeName: 'Warung Bu Susi',
      storeAddress: 'Jl. Setiabudi No. 45, Bandung',
      storePhone: '081122334455',
      description: 'Menyediakan makanan rumahan yang tidak habis terjual.',
      status: PartnerStatus.APPROVED,
    },
  });

  console.log('Partners created:', { partner1, partner2 });

  // --- Buat Kategori ---
  const categoryRoti = await prisma.category.create({
    data: { name: 'Roti & Kue', slug: 'roti-dan-kue' },
  });
  const categoryMakananBerat = await prisma.category.create({
    data: { name: 'Makanan Berat', slug: 'makanan-berat' },
  });
  const categoryMinuman = await prisma.category.create({
    data: { name: 'Minuman', slug: 'minuman' },
  });

  console.log('Categories created:', { categoryRoti, categoryMakananBerat, categoryMinuman });

  // --- Buat Produk ---
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  await prisma.product.createMany({
    data: [
      // Produk dari Partner 1 (Toko Roti Enak)
      {
        partnerId: partner1.id,
        categoryId: categoryRoti.id,
        name: 'Paket Roti Tawar & Manis',
        description: 'Paket berisi 1 roti tawar dan 3 roti manis aneka rasa. Kondisi masih sangat baik.',
        originalPrice: 50000,
        discountedPrice: 20000,
        quantity: 5,
        expirationDate: tomorrow,
        status: ProductStatus.AVAILABLE,
        imageUrl: 'https://placehold.co/600x400/F3E5F5/311B92?text=Roti+Paket',
      },
      {
        partnerId: partner1.id,
        categoryId: categoryRoti.id,
        name: 'Brownies Coklat (1 Loyang)',
        description: 'Brownies panggang full coklat, sisa 1 loyang dari pesanan.',
        originalPrice: 80000,
        discountedPrice: 45000,
        quantity: 1,
        expirationDate: tomorrow,
        status: ProductStatus.AVAILABLE,
        imageUrl: 'https://placehold.co/600x400/E1BEE7/311B92?text=Brownies',
      },
      // Produk dari Partner 2 (Warung Bu Susi)
      {
        partnerId: partner2.id,
        categoryId: categoryMakananBerat.id,
        name: 'Paket Nasi Ayam Bakar',
        description: 'Nasi, ayam bakar, tahu, tempe, dan sambal. Makanan sisa prasmanan, masih hangat.',
        originalPrice: 35000,
        discountedPrice: 15000,
        quantity: 8,
        expirationDate: today,
        status: ProductStatus.AVAILABLE,
        imageUrl: 'https://placehold.co/600x400/FFCDD2/B71C1C?text=Ayam+Bakar',
      },
      {
        partnerId: partner2.id,
        categoryId: categoryMakananBerat.id,
        name: 'Sayur Asem (1 Porsi Besar)',
        description: 'Sayur asem porsi keluarga, cocok untuk 3-4 orang.',
        originalPrice: 20000,
        discountedPrice: 8000,
        quantity: 3,
        expirationDate: today,
        status: ProductStatus.AVAILABLE,
        imageUrl: 'https://placehold.co/600x400/FFEBEE/B71C1C?text=Sayur+Asem',
      },
    ],
  });

  console.log('Products created.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Tutup koneksi Prisma
    await prisma.$disconnect();
  });