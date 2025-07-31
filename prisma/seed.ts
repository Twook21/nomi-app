// // prisma/seed.ts
// import { PrismaClient, Prisma } from '@prisma/client';
// import { faker } from '@faker-js/faker';
// import * as bcrypt from 'bcryptjs';
// import * as jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('Start seeding...');

//   const hashPassword = async (password: string): Promise<string> => {
//     const saltRounds = 10;
//     return bcrypt.hash(password, saltRounds);
//   };

//   const passwordDummy = await hashPassword('Password123!');

//   const userAdmin = await prisma.user.upsert({
//     where: { email: 'admin@example.com' },
//     update: {},
//     create: {
//       username: 'admin_user',
//       email: 'admin@example.com',
//       passwordHash: passwordDummy,
//       phoneNumber: faker.phone.number().substring(0, 18),
//       address: faker.location.streetAddress(true),
//       role: 'admin',
//     },
//   });
//   console.log(`Created user: ${userAdmin.username}`);

//   const umkmOwnersData = [];
//   for (let i = 0; i < 2; i++) {
//     umkmOwnersData.push(
//       await prisma.user.upsert({
//         where: { email: `umkm_owner${i + 1}@example.com` },
//         update: {},
//         create: {
//           username: `umkm_owner${i + 1}`,
//           email: `umkm_owner${i + 1}@example.com`,
//           passwordHash: passwordDummy,
//           phoneNumber: faker.phone.number().substring(0, 18),
//           address: faker.location.streetAddress(true),
//           role: 'umkm_owner',
//         },
//       })
//     );
//     console.log(`Created user: ${umkmOwnersData[i].username}`);
//   }

//   const customersData = [];
//   for (let i = 0; i < 3; i++) {
//     customersData.push(
//       await prisma.user.upsert({
//         where: { email: `customer${i + 1}@example.com` },
//         update: {},
//         create: {
//           username: `customer${i + 1}`,
//           email: `customer${i + 1}@example.com`,
//           passwordHash: passwordDummy,
//           phoneNumber: faker.phone.number().substring(0, 18),
//           address: faker.location.streetAddress(true),
//           role: 'customer',
//         },
//       })
//     );
//     console.log(`Created user: ${customersData[i].username}`);
//   }

//   // --- 2. Create UMKMOwners (relate to umkm_owner users) ---
//   const umkm1 = await prisma.uMKMOwner.upsert({
//     where: { userId: umkmOwnersData[0].id },
//     update: {},
//     create: {
//       userId: umkmOwnersData[0].id,
//       // FIX: Batasi panjang umkmName dan bankName
//       umkmName: faker.company.name().substring(0, 90), // Potong menjadi 90 karakter (max 100)
//       umkmDescription: faker.company.catchPhrase(),
//       umkmAddress: faker.location.streetAddress(true),
//       // FIX: Batasi panjang umkmPhoneNumber
//       umkmPhoneNumber: faker.phone.number().substring(0, 18), // Potong menjadi 18 karakter (max 20)
//       // FIX: Gunakan domain name yang lebih pendek atau batasi panjang
//       umkmEmail: `info@${faker.internet.domainWord().substring(0, 80)}.com`, // Potong domain word
//       bankAccountNumber: faker.finance.accountNumber(12),
//       // FIX: Batasi panjang bankName
//       bankName: faker.finance.accountName().substring(0, 45), // Potong menjadi 45 karakter (max 50)
//       isVerified: true,
//     },
//   });
//   console.log(`Created UMKM: ${umkm1.umkmName}`);

//   const umkm2 = await prisma.uMKMOwner.upsert({
//     where: { userId: umkmOwnersData[1].id },
//     update: {},
//     create: {
//       userId: umkmOwnersData[1].id,
//       // FIX: Batasi panjang umkmName dan bankName
//       umkmName: faker.company.name().substring(0, 90),
//       umkmDescription: faker.company.catchPhrase(),
//       umkmAddress: faker.location.streetAddress(true),
//       // FIX: Batasi panjang umkmPhoneNumber
//       umkmPhoneNumber: faker.phone.number().substring(0, 18),
//       // FIX: Gunakan domain name yang lebih pendek atau batasi panjang
//       umkmEmail: `info@${faker.internet.domainWord().substring(0, 80)}.com`,
//       bankAccountNumber: faker.finance.accountNumber(12),
//       // FIX: Batasi panjang bankName
//       bankName: faker.finance.accountName().substring(0, 45),
//       isVerified: true,
//     },
//   });
//   console.log(`Created UMKM: ${umkm2.umkmName}`);


//   // --- 3. Create Food Categories ---
//   const categories = ['Main Course', 'Snacks', 'Drinks', 'Desserts', 'Vegetarian'];
//   const createdCategories = await Promise.all(
//     categories.map(name =>
//       prisma.foodCategory.upsert({
//         where: { categoryName: name },
//         update: {},
//         create: { categoryName: name },
//       })
//     )
//   );
//   console.log(`Created ${createdCategories.length} categories.`);

//   // --- 4. Create Products ---
//   const productsData = [];
//   for (let i = 0; i < 5; i++) { // 5 products for UMKM 1
//     const originalPrice = parseFloat(faker.commerce.price({ min: 10000, max: 50000, dec: 2 }));
//     const discountedPrice = faker.datatype.boolean() && originalPrice > 15000
//       ? parseFloat(faker.commerce.price({ min: originalPrice * 0.7, max: originalPrice * 0.95, dec: 2 }))
//       : originalPrice;

//     productsData.push(
//       await prisma.product.create({
//         data: {
//           umkmId: umkm1.id,
//           categoryId: faker.helpers.arrayElement(createdCategories).id,
//           productName: faker.commerce.productName(),
//           description: faker.commerce.productDescription(),
//           originalPrice: originalPrice,
//           discountedPrice: discountedPrice,
//           stock: faker.number.int({ min: 10, max: 100 }),
//           expirationDate: faker.date.future({ years: 1 }),
//           imageUrl: faker.image.urlLoremFlickr({ category: 'food', width: 640, height: 480 }),
//           isAvailable: faker.datatype.boolean({ probability: 0.9 }),
//         },
//       })
//     );
//   }

//   for (let i = 0; i < 5; i++) { // 5 products for UMKM 2
//     const originalPrice = parseFloat(faker.commerce.price({ min: 10000, max: 50000, dec: 2 }));
//     const discountedPrice = faker.datatype.boolean() && originalPrice > 15000
//       ? parseFloat(faker.commerce.price({ min: originalPrice * 0.7, max: originalPrice * 0.95, dec: 2 }))
//       : originalPrice;

//     productsData.push(
//       await prisma.product.create({
//         data: {
//           umkmId: umkm2.id,
//           categoryId: faker.helpers.arrayElement(createdCategories).id,
//           productName: faker.commerce.productName(),
//           description: faker.commerce.productDescription(),
//           originalPrice: originalPrice,
//           discountedPrice: discountedPrice,
//           stock: faker.number.int({ min: 10, max: 100 }),
//           expirationDate: faker.date.future({ years: 1 }),
//           imageUrl: faker.image.urlLoremFlickr({ category: 'food', width: 640, height: 480 }),
//           isAvailable: faker.datatype.boolean({ probability: 0.9 }),
//         },
//       })
//     );
//   }
//   console.log(`Created ${productsData.length} products.`);

//   // --- 5. Create Orders & OrderItems ---
//   const customer1 = customersData[0];
//   const customer2 = customersData[1];
//   const productUmkm1 = faker.helpers.arrayElement(productsData.filter(p => p.umkmId === umkm1.id));
//   const productUmkm2 = faker.helpers.arrayElement(productsData.filter(p => p.umkmId === umkm2.id));

//   const order1 = await prisma.order.create({
//     data: {
//       customerId: customer1.id,
//       umkmId: umkm1.id,
//       totalAmount: productUmkm1.discountedPrice.toNumber() * 2,
//       shippingAddress: customer1.address || faker.location.streetAddress(true),
//       paymentMethod: faker.helpers.arrayElement(['Credit Card', 'Bank Transfer', 'E-Wallet']),
//       paymentStatus: 'paid',
//       orderStatus: 'delivered',
//       notes: 'Please pack carefully.',
//       orderItems: {
//         create: [
//           {
//             productId: productUmkm1.id,
//             quantity: 2,
//             pricePerItem: productUmkm1.discountedPrice,
//           },
//         ],
//       },
//     },
//   });
//   console.log(`Created order: ${order1.id} for ${customer1.username}`);

//   const order2 = await prisma.order.create({
//     data: {
//       customerId: customer2.id,
//       umkmId: umkm2.id,
//       totalAmount: productUmkm2.discountedPrice.toNumber() * 1,
//       shippingAddress: customer2.address || faker.location.streetAddress(true),
//       paymentMethod: faker.helpers.arrayElement(['Cash on Delivery']),
//       paymentStatus: 'pending',
//       orderStatus: 'processing',
//       notes: null,
//       orderItems: {
//         create: [
//           {
//             productId: productUmkm2.id,
//             quantity: 1,
//             pricePerItem: productUmkm2.discountedPrice,
//           },
//         ],
//       },
//     },
//   });
//   console.log(`Created order: ${order2.id} for ${customer2.username}`);

//   // --- 6. Create Reviews ---
//   await prisma.review.create({
//     data: {
//       productId: productUmkm1.id,
//       customerId: customer1.id,
//       rating: faker.number.int({ min: 3, max: 5 }),
//       comment: faker.lorem.sentence(),
//     },
//   });
//   console.log(`Created review for product ${productUmkm1.productName}`);

//   // --- 7. Create Shopping Carts & Cart Items ---
//   const customer3 = customersData[2];
//   const productForCart = faker.helpers.arrayElement(productsData);

//   const cart = await prisma.shoppingCart.create({
//     data: {
//       customerId: customer3.id,
//       cartItems: {
//         create: [
//           {
//             productId: productForCart.id,
//             quantity: faker.number.int({ min: 1, max: 3 }),
//           },
//         ],
//       },
//     },
//   });
//   console.log(`Created shopping cart for ${customer3.username}`);

//   console.log('Seeding finished.');
// }

// main()
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Mulai seeding database...');

    // 1. Buat Food Categories
    console.log('📂 Membuat kategori makanan...');
    const categories = await Promise.all([
      prisma.foodCategory.create({
        data: {
          categoryName: 'Makanan Tradisional'
        }
      }),
      prisma.foodCategory.create({
        data: {
          categoryName: 'Kue & Pastry'
        }
      }),
      prisma.foodCategory.create({
        data: {
          categoryName: 'Minuman'
        }
      }),
      prisma.foodCategory.create({
        data: {
          categoryName: 'Camilan'
        }
      }),
      prisma.foodCategory.create({
        data: {
          categoryName: 'Makanan Cepat Saji'
        }
      })
    ]);

    // 2. Buat Users (Customers)
    console.log('👥 Membuat user customers...');
    const customers = await Promise.all([
      prisma.user.create({
        data: {
          username: 'budi_customer',
          email: 'budi@email.com',
          passwordHash: '$2b$10$hashedpassword1',
          phoneNumber: '081234567890',
          address: 'Jl. Merdeka No. 123, Bandung',
          role: 'customer',
          name: 'Budi Santoso',
          emailVerified: new Date()
        }
      }),
      prisma.user.create({
        data: {
          username: 'siti_customer',
          email: 'siti@email.com',
          passwordHash: '$2b$10$hashedpassword2',
          phoneNumber: '081234567891',
          address: 'Jl. Sudirman No. 456, Bandung',
          role: 'customer',
          name: 'Siti Nurhaliza',
          emailVerified: new Date()
        }
      }),
      prisma.user.create({
        data: {
          username: 'andi_customer',
          email: 'andi@email.com',
          passwordHash: '$2b$10$hashedpassword3',
          phoneNumber: '081234567892',
          address: 'Jl. Asia Afrika No. 789, Bandung',
          role: 'customer',
          name: 'Andi Wijaya',
          emailVerified: new Date()
        }
      })
    ]);

    // 3. Buat Users (UMKM Owners)
    console.log('🏪 Membuat user UMKM owners...');
    const umkmUsers = await Promise.all([
      prisma.user.create({
        data: {
          username: 'warung_ibu_sri',
          email: 'ibu.sri@email.com',
          passwordHash: '$2b$10$hashedpassword4',
          phoneNumber: '081234567893',
          address: 'Jl. Braga No. 101, Bandung',
          role: 'umkm_owner',
          name: 'Ibu Sri Wahyuni',
          emailVerified: new Date()
        }
      }),
      prisma.user.create({
        data: {
          username: 'toko_kue_mama',
          email: 'mama.kue@email.com',
          passwordHash: '$2b$10$hashedpassword5',
          phoneNumber: '081234567894',
          address: 'Jl. Dago No. 202, Bandung',
          role: 'umkm_owner',
          name: 'Mama Rosa',
          emailVerified: new Date()
        }
      }),
      prisma.user.create({
        data: {
          username: 'kedai_pak_joko',
          email: 'pak.joko@email.com',
          passwordHash: '$2b$10$hashedpassword6',
          phoneNumber: '081234567895',
          address: 'Jl. Cihampelas No. 303, Bandung',
          role: 'umkm_owner',
          name: 'Pak Joko Susilo',
          emailVerified: new Date()
        }
      })
    ]);

    // 4. Buat UMKM Owners
    console.log('🏢 Membuat UMKM owners...');
    const umkmOwners = await Promise.all([
      prisma.uMKMOwner.create({
        data: {
          userId: umkmUsers[0].id,
          umkmName: 'Warung Ibu Sri',
          umkmDescription: 'Warung tradisional dengan masakan khas Jawa yang autentik',
          umkmAddress: 'Jl. Braga No. 101, Bandung',
          umkmPhoneNumber: '081234567893',
          umkmEmail: 'warung.ibu.sri@email.com',
          bankAccountNumber: '1234567890',
          bankName: 'Bank BCA',
          isVerified: true
        }
      }),
      prisma.uMKMOwner.create({
        data: {
          userId: umkmUsers[1].id,
          umkmName: 'Toko Kue Mama Rosa',
          umkmDescription: 'Toko kue dan pastry dengan resep turun temurun',
          umkmAddress: 'Jl. Dago No. 202, Bandung',
          umkmPhoneNumber: '081234567894',
          umkmEmail: 'toko.kue.mama@email.com',
          bankAccountNumber: '0987654321',
          bankName: 'Bank Mandiri',
          isVerified: true
        }
      }),
      prisma.uMKMOwner.create({
        data: {
          userId: umkmUsers[2].id,
          umkmName: 'Kedai Pak Joko',
          umkmDescription: 'Kedai minuman dan camilan untuk segala usia',
          umkmAddress: 'Jl. Cihampelas No. 303, Bandung',
          umkmPhoneNumber: '081234567895',
          umkmEmail: 'kedai.pak.joko@email.com',
          bankAccountNumber: '1122334455',
          bankName: 'Bank BNI',
          isVerified: false
        }
      })
    ]);

    // 5. Buat Products
    console.log('🍽️ Membuat produk...');
    const products = await Promise.all([
      // Produk dari Warung Ibu Sri
      prisma.product.create({
        data: {
          umkmId: umkmOwners[0].id,
          categoryId: categories[0].id, // Makanan Tradisional
          productName: 'Gudeg Jogja',
          description: 'Gudeg khas Jogja dengan rasa manis dan gurih, disajikan dengan ayam dan telur',
          originalPrice: 25000,
          discountedPrice: 20000,
          stock: 50,
          expirationDate: new Date('2025-08-01'),
          imageUrl: 'https://example.com/images/gudeg.jpg',
          isAvailable: true
        }
      }),
      prisma.product.create({
        data: {
          umkmId: umkmOwners[0].id,
          categoryId: categories[0].id,
          productName: 'Nasi Pecel',
          description: 'Nasi dengan sayuran segar dan bumbu pecel yang pedas',
          originalPrice: 15000,
          discountedPrice: 12000,
          stock: 30,
          expirationDate: new Date('2025-07-31'),
          imageUrl: 'https://example.com/images/pecel.jpg',
          isAvailable: true
        }
      }),
      
      // Produk dari Toko Kue Mama Rosa
      prisma.product.create({
        data: {
          umkmId: umkmOwners[1].id,
          categoryId: categories[1].id, // Kue & Pastry
          productName: 'Brownies Coklat',
          description: 'Brownies coklat lembut dengan topping keju yang lezat',
          originalPrice: 35000,
          discountedPrice: 30000,
          stock: 20,
          expirationDate: new Date('2025-08-05'),
          imageUrl: 'https://example.com/images/brownies.jpg',
          isAvailable: true
        }
      }),
      prisma.product.create({
        data: {
          umkmId: umkmOwners[1].id,
          categoryId: categories[1].id,
          productName: 'Kue Lapis Legit',
          description: 'Kue lapis dengan rasa mentega yang kaya dan tekstur yang lembut',
          originalPrice: 80000,
          discountedPrice: 70000,
          stock: 10,
          expirationDate: new Date('2025-08-10'),
          imageUrl: 'https://example.com/images/lapis-legit.jpg',
          isAvailable: true
        }
      }),
      
      // Produk dari Kedai Pak Joko
      prisma.product.create({
        data: {
          umkmId: umkmOwners[2].id,
          categoryId: categories[2].id, // Minuman
          productName: 'Es Teh Manis',
          description: 'Es teh manis segar dengan gula aren asli',
          originalPrice: 8000,
          discountedPrice: 6000,
          stock: 100,
          expirationDate: new Date('2025-07-31'),
          imageUrl: 'https://example.com/images/es-teh.jpg',
          isAvailable: true
        }
      }),
      prisma.product.create({
        data: {
          umkmId: umkmOwners[2].id,
          categoryId: categories[3].id, // Camilan
          productName: 'Keripik Singkong',
          description: 'Keripik singkong renyah dengan berbagai varian rasa',
          originalPrice: 12000,
          discountedPrice: 10000,
          stock: 75,
          expirationDate: new Date('2025-08-15'),
          imageUrl: 'https://example.com/images/keripik.jpg',
          isAvailable: true
        }
      })
    ]);

    // 6. Buat Shopping Carts
    console.log('🛒 Membuat shopping carts...');
    const shoppingCarts = await Promise.all([
      prisma.shoppingCart.create({
        data: {
          customerId: customers[0].id
        }
      }),
      prisma.shoppingCart.create({
        data: {
          customerId: customers[1].id
        }
      }),
      prisma.shoppingCart.create({
        data: {
          customerId: customers[2].id
        }
      })
    ]);

    // 7. Buat Cart Items
    console.log('🛍️ Membuat cart items...');
    await Promise.all([
      prisma.cartItem.create({
        data: {
          cartId: shoppingCarts[0].id,
          productId: products[0].id, // Gudeg
          quantity: 2
        }
      }),
      prisma.cartItem.create({
        data: {
          cartId: shoppingCarts[0].id,
          productId: products[2].id, // Brownies
          quantity: 1
        }
      }),
      prisma.cartItem.create({
        data: {
          cartId: shoppingCarts[1].id,
          productId: products[1].id, // Nasi Pecel
          quantity: 3
        }
      }),
      prisma.cartItem.create({
        data: {
          cartId: shoppingCarts[2].id,
          productId: products[4].id, // Es Teh
          quantity: 2
        }
      })
    ]);

    // 8. Buat Orders
    console.log('📦 Membuat orders...');
    const orders = await Promise.all([
      prisma.order.create({
        data: {
          customerId: customers[0].id,
          umkmId: umkmOwners[0].id,
          totalAmount: 40000,
          shippingAddress: 'Jl. Merdeka No. 123, Bandung',
          paymentMethod: 'Transfer Bank',
          paymentStatus: 'paid',
          orderStatus: 'delivered',
          notes: 'Tolong jangan terlalu pedas'
        }
      }),
      prisma.order.create({
        data: {
          customerId: customers[1].id,
          umkmId: umkmOwners[1].id,
          totalAmount: 30000,
          shippingAddress: 'Jl. Sudirman No. 456, Bandung',
          paymentMethod: 'E-Wallet',
          paymentStatus: 'paid',
          orderStatus: 'processing',
          notes: 'Kemasan rapi ya'
        }
      }),
      prisma.order.create({
        data: {
          customerId: customers[2].id,
          umkmId: umkmOwners[2].id,
          totalAmount: 16000,
          shippingAddress: 'Jl. Asia Afrika No. 789, Bandung',
          paymentMethod: 'COD',
          paymentStatus: 'pending',
          orderStatus: 'pending',
          notes: null
        }
      })
    ]);

    // 9. Buat Order Items
    console.log('📋 Membuat order items...');
    await Promise.all([
      // Order 1 items
      prisma.orderItem.create({
        data: {
          orderId: orders[0].id,
          productId: products[0].id, // Gudeg
          quantity: 2,
          pricePerItem: 20000
        }
      }),
      
      // Order 2 items
      prisma.orderItem.create({
        data: {
          orderId: orders[1].id,
          productId: products[2].id, // Brownies
          quantity: 1,
          pricePerItem: 30000
        }
      }),
      
      // Order 3 items
      prisma.orderItem.create({
        data: {
          orderId: orders[2].id,
          productId: products[4].id, // Es Teh
          quantity: 2,
          pricePerItem: 6000
        }
      }),
      prisma.orderItem.create({
        data: {
          orderId: orders[2].id,
          productId: products[5].id, // Keripik
          quantity: 1,
          pricePerItem: 10000
        }
      })
    ]);

    // 10. Buat Reviews
    console.log('⭐ Membuat reviews...');
    await Promise.all([
      prisma.review.create({
        data: {
          productId: products[0].id, // Gudeg
          customerId: customers[0].id,
          rating: 5,
          comment: 'Gudegnya enak banget! Rasanya autentik seperti di Jogja. Pasti pesan lagi!'
        }
      }),
      prisma.review.create({
        data: {
          productId: products[2].id, // Brownies
          customerId: customers[1].id,
          rating: 4,
          comment: 'Browniesnya lembut dan coklat banget. Toppingnya juga enak. Recommended!'
        }
      }),
      prisma.review.create({
        data: {
          productId: products[4].id, // Es Teh
          customerId: customers[2].id,
          rating: 3,
          comment: 'Es tehnya segar, tapi kurang manis menurut saya. Overall oke lah.'
        }
      }),
      prisma.review.create({
        data: {
          productId: products[1].id, // Nasi Pecel
          customerId: customers[1].id,
          rating: 5,
          comment: 'Nasi pecelnya mantap! Bumbu pecelnya pas banget, tidak terlalu pedas.'
        }
      })
    ]);

    // 11. Buat Accounts (untuk NextAuth)
    console.log('🔐 Membuat accounts untuk OAuth...');
    await Promise.all([
      prisma.account.create({
        data: {
          userId: customers[0].id,
          type: 'oauth',
          provider: 'google',
          providerAccountId: 'google_123456789',
          access_token: 'ya29.example_access_token_1',
          refresh_token: 'refresh_token_example_1',
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'Bearer',
          scope: 'openid email profile'
        }
      }),
      prisma.account.create({
        data: {
          userId: customers[1].id,
          type: 'oauth',
          provider: 'facebook',
          providerAccountId: 'facebook_987654321',
          access_token: 'fb_access_token_example',
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'Bearer',
          scope: 'email public_profile'
        }
      })
    ]);

    // 12. Buat Sessions
    console.log('🔑 Membuat sessions...');
    await Promise.all([
      prisma.session.create({
        data: {
          userId: customers[0].id,
          sessionToken: 'session_token_budi_12345',
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      }),
      prisma.session.create({
        data: {
          userId: customers[1].id,  
          sessionToken: 'session_token_siti_67890',
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      })
    ]);

    // 13. Buat Verification Tokens
    console.log('✅ Membuat verification tokens...');
    await Promise.all([
      prisma.verificationToken.create({
        data: {
          identifier: 'verify_email_token_1',
          token: 'verification_token_abc123',
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      }),
      prisma.verificationToken.create({
        data: {
          identifier: 'verify_email_token_2',
          token: 'verification_token_def456',
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      })
    ]);

    console.log('✅ Seeding database selesai!');
    console.log(`
📊 DATA YANG DIBUAT:
- ${categories.length} Kategori makanan
- ${customers.length} Customer users
- ${umkmUsers.length} UMKM owner users  
- ${umkmOwners.length} UMKM owners
- ${products.length} Produk
- ${shoppingCarts.length} Shopping carts
- 4 Cart items
- ${orders.length} Orders
- 4 Order items
- 4 Reviews
- 2 OAuth accounts
- 2 Sessions
- 2 Verification tokens
    `);

  } catch (error) {
    console.error('❌ Error saat seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan seeding
seedDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

// Export untuk penggunaan sebagai module
module.exports = { seedDatabase };