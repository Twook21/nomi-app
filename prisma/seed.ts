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