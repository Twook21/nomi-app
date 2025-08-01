const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive seed...')

  // 1. Seed Food Categories
  console.log('📦 Seeding food categories...')
  const categories = await Promise.all([
    prisma.foodCategory.upsert({
      where: { categoryName: 'Makanan Kering' },
      update: {},
      create: { categoryName: 'Makanan Kering' },
    }),
    prisma.foodCategory.upsert({
      where: { categoryName: 'Roti dan Kue' },
      update: {},
      create: { categoryName: 'Roti dan Kue' },
    }),
    prisma.foodCategory.upsert({
      where: { categoryName: 'Makanan Olahan' },
      update: {},
      create: { categoryName: 'Makanan Olahan' },
    }),
    prisma.foodCategory.upsert({
      where: { categoryName: 'Minuman' },
      update: {},
      create: { categoryName: 'Minuman' },
    })
  ])
  console.log(`✅ Created ${categories.length} categories`)

  // 2. Seed Users
  console.log('👥 Seeding users...')
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const users = await Promise.all([
    // Regular customers
    prisma.user.upsert({
      where: { email: 'customer1@example.com' },
      update: {},
      create: {
        username: 'customer1',
        email: 'customer1@example.com',
        passwordHash: hashedPassword,
        phoneNumber: '081234567890',
        address: 'Jl. Sudirman No. 123, Jakarta',
        role: 'customer',
        name: 'John Doe',
      },
    }),
    prisma.user.upsert({
      where: { email: 'customer2@example.com' },
      update: {},
      create: {
        username: 'customer2',
        email: 'customer2@example.com',
        passwordHash: hashedPassword,
        phoneNumber: '081234567891',
        address: 'Jl. Thamrin No. 456, Jakarta',
        role: 'customer',
        name: 'Jane Smith',
      },
    }),
    // UMKM owners
    prisma.user.upsert({
      where: { email: 'umkm1@example.com' },
      update: {},
      create: {
        username: 'umkm_owner1',
        email: 'umkm1@example.com',
        passwordHash: hashedPassword,
        phoneNumber: '081234567892',
        address: 'Jl. Gatot Subroto No. 789, Jakarta',
        role: 'umkm_owner',
        name: 'Ahmad Susanto',
      },
    }),
    prisma.user.upsert({
      where: { email: 'umkm2@example.com' },
      update: {},
      create: {
        username: 'umkm_owner2',
        email: 'umkm2@example.com',
        passwordHash: hashedPassword,
        phoneNumber: '081234567893',
        address: 'Jl. Kuningan No. 321, Jakarta',
        role: 'umkm_owner',
        name: 'Siti Rahayu',
      },
    }),
    prisma.user.upsert({
      where: { email: 'umkm3@example.com' },
      update: {},
      create: {
        username: 'umkm_owner3',
        email: 'umkm3@example.com',
        passwordHash: hashedPassword,
        phoneNumber: '081234567894',
        address: 'Jl. Kemang No. 654, Jakarta',
        role: 'umkm_owner',
        name: 'Budi Santoso',
      },
    })
  ])
  console.log(`✅ Created ${users.length} users`)

  // 3. Seed UMKM Owners
  console.log('🏪 Seeding UMKM owners...')
  const umkmOwners = await Promise.all([
    prisma.uMKMOwner.upsert({
      where: { userId: users[2].id },
      update: {},
      create: {
        userId: users[2].id,
        umkmName: 'Warung Bu Ahmad',
        umkmDescription: 'Menjual berbagai makanan tradisional Indonesia dengan cita rasa autentik',
        umkmAddress: 'Jl. Gatot Subroto No. 789, Jakarta',
        umkmPhoneNumber: '081234567892',
        umkmEmail: 'warungbuahmad@example.com',
        bankAccountNumber: '1234567890',
        bankName: 'BCA',
        isVerified: true,
      },
    }),
    prisma.uMKMOwner.upsert({
      where: { userId: users[3].id },
      update: {},
      create: {
        userId: users[3].id,
        umkmName: 'Toko Kue Siti',
        umkmDescription: 'Spesialis kue kering dan basah untuk berbagai acara',
        umkmAddress: 'Jl. Kuningan No. 321, Jakarta',
        umkmPhoneNumber: '081234567893',
        umkmEmail: 'kuesiti@example.com',
        bankAccountNumber: '0987654321',
        bankName: 'Mandiri',
        isVerified: true,
      },
    }),
    prisma.uMKMOwner.upsert({
      where: { userId: users[4].id },
      update: {},
      create: {
        userId: users[4].id,
        umkmName: 'Minuman Segar Budi',
        umkmDescription: 'Menyediakan berbagai minuman segar dan sehat',
        umkmAddress: 'Jl. Kemang No. 654, Jakarta',
        umkmPhoneNumber: '081234567894',
        umkmEmail: 'minumanbudi@example.com',
        bankAccountNumber: '1122334455',
        bankName: 'BNI',
        isVerified: false,
      },
    })
  ])
  console.log(`✅ Created ${umkmOwners.length} UMKM owners`)

  // 4. Seed Products
  console.log('🍽️ Seeding products...')
  const products = await Promise.all([
    // Products from Warung Bu Ahmad
    prisma.product.create({
      data: {
        umkmId: umkmOwners[0].id,
        categoryId: categories[2].id, // Makanan Olahan
        productName: 'Rendang Daging',
        description: 'Rendang daging sapi authentic dengan bumbu tradisional',
        originalPrice: 45000,
        discountedPrice: 40000,
        stock: 20,
        expirationDate: new Date('2025-08-15'),
        imageUrl: 'https://example.com/rendang.jpg',
        isAvailable: true,
      },
    }),
    prisma.product.create({
      data: {
        umkmId: umkmOwners[0].id,
        categoryId: categories[0].id, // Makanan Kering
        productName: 'Kerupuk Udang',
        description: 'Kerupuk udang renyah dan gurih',
        originalPrice: 15000,
        discountedPrice: 12000,
        stock: 50,
        expirationDate: new Date('2025-12-31'),
        imageUrl: 'https://example.com/kerupuk.jpg',
        isAvailable: true,
      },
    }),
    // Products from Toko Kue Siti
    prisma.product.create({
      data: {
        umkmId: umkmOwners[1].id,
        categoryId: categories[1].id, // Roti dan Kue
        productName: 'Kue Nastar',
        description: 'Kue nastar dengan selai nanas segar',
        originalPrice: 25000,
        discountedPrice: 20000,
        stock: 30,
        expirationDate: new Date('2025-08-10'),
        imageUrl: 'https://example.com/nastar.jpg',
        isAvailable: true,
      },
    }),
    prisma.product.create({
      data: {
        umkmId: umkmOwners[1].id,
        categoryId: categories[1].id, // Roti dan Kue
        productName: 'Roti Tawar Gandum',
        description: 'Roti tawar gandum sehat dan bergizi',
        originalPrice: 12000,
        discountedPrice: 10000,
        stock: 15,
        expirationDate: new Date('2025-08-05'),
        imageUrl: 'https://example.com/roti-gandum.jpg',
        isAvailable: true,
      },
    }),
    // Products from Minuman Segar Budi
    prisma.product.create({
      data: {
        umkmId: umkmOwners[2].id,
        categoryId: categories[3].id, // Minuman
        productName: 'Jus Jeruk Segar',
        description: 'Jus jeruk segar tanpa pengawet',
        originalPrice: 8000,
        discountedPrice: 7000,
        stock: 25,
        expirationDate: new Date('2025-08-03'),
        imageUrl: 'https://example.com/jus-jeruk.jpg',
        isAvailable: true,
      },
    }),
    prisma.product.create({
      data: {
        umkmId: umkmOwners[2].id,
        categoryId: categories[3].id, // Minuman
        productName: 'Es Teh Manis',
        description: 'Es teh manis segar untuk segala cuaca',
        originalPrice: 5000,
        discountedPrice: 4000,
        stock: 40,
        expirationDate: new Date('2025-08-02'),
        imageUrl: 'https://example.com/es-teh.jpg',
        isAvailable: true,
      },
    })
  ])
  console.log(`✅ Created ${products.length} products`)

  // 5. Seed Shopping Carts
  console.log('🛒 Seeding shopping carts...')
  const shoppingCarts = await Promise.all([
    prisma.shoppingCart.create({
      data: {
        customerId: users[0].id, // customer1
      },
    }),
    prisma.shoppingCart.create({
      data: {
        customerId: users[1].id, // customer2
      },
    })
  ])
  console.log(`✅ Created ${shoppingCarts.length} shopping carts`)

  // 6. Seed Cart Items
  console.log('🛍️ Seeding cart items...')
  const cartItems = await Promise.all([
    prisma.cartItem.create({
      data: {
        cartId: shoppingCarts[0].id,
        productId: products[0].id, // Rendang
        quantity: 2,
      },
    }),
    prisma.cartItem.create({
      data: {
        cartId: shoppingCarts[0].id,
        productId: products[2].id, // Nastar
        quantity: 1,
      },
    }),
    prisma.cartItem.create({
      data: {
        cartId: shoppingCarts[1].id,
        productId: products[4].id, // Jus Jeruk
        quantity: 3,
      },
    })
  ])
  console.log(`✅ Created ${cartItems.length} cart items`)

  // 7. Seed Orders
  console.log('📦 Seeding orders...')
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        customerId: users[0].id,
        umkmId: umkmOwners[0].id,
        totalAmount: 80000,
        shippingAddress: 'Jl. Sudirman No. 123, Jakarta',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'paid',
        orderStatus: 'delivered',
        notes: 'Tolong diantar sore hari',
      },
    }),
    prisma.order.create({
      data: {
        customerId: users[1].id,
        umkmId: umkmOwners[1].id,
        totalAmount: 20000,
        shippingAddress: 'Jl. Thamrin No. 456, Jakarta',
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
        orderStatus: 'processing',
      },
    })
  ])
  console.log(`✅ Created ${orders.length} orders`)

  // 8. Seed Order Items
  console.log('📋 Seeding order items...')
  const orderItems = await Promise.all([
    prisma.orderItem.create({
      data: {
        orderId: orders[0].id,
        productId: products[0].id, // Rendang
        quantity: 2,
        pricePerItem: 40000,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: orders[1].id,
        productId: products[2].id, // Nastar
        quantity: 1,
        pricePerItem: 20000,
      },
    })
  ])
  console.log(`✅ Created ${orderItems.length} order items`)

  // 9. Seed Reviews
  console.log('⭐ Seeding reviews...')
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        productId: products[0].id, // Rendang
        customerId: users[0].id,
        rating: 5,
        comment: 'Rendangnya enak banget! Bumbu meresap sempurna dan dagingnya empuk.',
      },
    }),
    prisma.review.create({
      data: {
        productId: products[2].id, // Nastar
        customerId: users[1].id,
        rating: 4,
        comment: 'Kue nastarnya manis dan renyah, cocok untuk cemilan.',
      },
    }),
    prisma.review.create({
      data: {
        productId: products[4].id, // Jus Jeruk
        customerId: users[0].id,
        rating: 5,
        comment: 'Jus jeruknya segar sekali, tidak terlalu manis. Recommended!',
      },
    })
  ])
  console.log(`✅ Created ${reviews.length} reviews`)

  console.log('🎉 Comprehensive seed completed successfully!')
  console.log(`
📊 Summary:
- ${categories.length} Food Categories
- ${users.length} Users (2 customers, 3 UMKM owners)
- ${umkmOwners.length} UMKM Owners
- ${products.length} Products
- ${shoppingCarts.length} Shopping Carts
- ${cartItems.length} Cart Items
- ${orders.length} Orders
- ${orderItems.length} Order Items
- ${reviews.length} Reviews
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })