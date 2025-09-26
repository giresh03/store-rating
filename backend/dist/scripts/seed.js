"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = require("../utils/bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seed...');
    // Create System Admin
    const adminPassword = await (0, bcrypt_1.hashPassword)('Admin123!');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@storerating.com' },
        update: {},
        create: {
            name: 'System Administrator User',
            email: 'admin@storerating.com',
            password: adminPassword,
            address: '123 Admin Street, Admin City, AC 12345, Admin Country',
            role: client_1.UserRole.SYSTEM_ADMIN,
        },
    });
    console.log('✅ Created admin user:', admin.email);
    // Create Store Owners
    const storeOwner1Password = await (0, bcrypt_1.hashPassword)('Owner123!');
    const storeOwner1 = await prisma.user.upsert({
        where: { email: 'owner1@storerating.com' },
        update: {},
        create: {
            name: 'John Smith Store Owner Account',
            email: 'owner1@storerating.com',
            password: storeOwner1Password,
            address: '456 Business Avenue, Commerce City, CC 67890, Business State',
            role: client_1.UserRole.STORE_OWNER,
        },
    });
    const storeOwner2Password = await (0, bcrypt_1.hashPassword)('Owner456!');
    const storeOwner2 = await prisma.user.upsert({
        where: { email: 'owner2@storerating.com' },
        update: {},
        create: {
            name: 'Sarah Johnson Store Owner Profile',
            email: 'owner2@storerating.com',
            password: storeOwner2Password,
            address: '789 Retail Road, Shopping District, SD 11111, Commerce Country',
            role: client_1.UserRole.STORE_OWNER,
        },
    });
    console.log('✅ Created store owners:', storeOwner1.email, storeOwner2.email);
    // Create Normal Users
    const normalUsers = [
        {
            name: 'Alice Customer Normal User',
            email: 'alice@customer.com',
            password: await (0, bcrypt_1.hashPassword)('User123!'),
            address: '101 Customer Lane, User City, UC 22222, Customer State',
        },
        {
            name: 'Bob Regular Customer Account',
            email: 'bob@customer.com',
            password: await (0, bcrypt_1.hashPassword)('User456!'),
            address: '202 Regular Street, Normal Town, NT 33333, Regular Province',
        },
        {
            name: 'Charlie Frequent Customer Profile',
            email: 'charlie@customer.com',
            password: await (0, bcrypt_1.hashPassword)('User789!'),
            address: '303 Frequent Avenue, Active City, AC 44444, Frequent Region',
        },
        {
            name: 'Diana Premium Customer Account',
            email: 'diana@customer.com',
            password: await (0, bcrypt_1.hashPassword)('User012!'),
            address: '404 Premium Boulevard, Elite District, ED 55555, Premium Territory',
        },
    ];
    const createdUsers = [];
    for (const userData of normalUsers) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                ...userData,
                role: client_1.UserRole.NORMAL_USER,
            },
        });
        createdUsers.push(user);
    }
    console.log('✅ Created normal users:', createdUsers.map(u => u.email).join(', '));
    // Create Stores
    const stores = [
        {
            name: 'Tech Paradise Electronics Store',
            address: '123 Technology Street, Innovation District, Tech City, TC 12345',
            ownerId: storeOwner1.id,
        },
        {
            name: 'Fresh Market Grocery Store',
            address: '456 Fresh Avenue, Market Square, Food City, FC 67890',
            ownerId: storeOwner1.id,
        },
        {
            name: 'Fashion Forward Clothing Boutique',
            address: '789 Style Boulevard, Fashion District, Style City, SC 11111',
            ownerId: storeOwner2.id,
        },
        {
            name: 'Home & Garden Supplies Center',
            address: '101 Garden Road, Home District, Garden City, GC 22222',
            ownerId: storeOwner2.id,
        },
        {
            name: 'Sports Equipment Warehouse Store',
            address: '202 Athletic Avenue, Sports Complex, Active City, AC 33333',
            ownerId: storeOwner1.id,
        },
    ];
    const createdStores = [];
    for (const storeData of stores) {
        const store = await prisma.store.upsert({
            where: { id: 'temp-id-' + storeData.name.replace(/\s+/g, '-').toLowerCase() },
            update: {},
            create: storeData,
        });
        createdStores.push(store);
    }
    console.log('✅ Created stores:', createdStores.map(s => s.name).join(', '));
    // Create Ratings
    const ratingsData = [
        // Tech Paradise Electronics Store ratings
        { userId: createdUsers[0].id, storeId: createdStores[0].id, ratingValue: 5 },
        { userId: createdUsers[1].id, storeId: createdStores[0].id, ratingValue: 4 },
        { userId: createdUsers[2].id, storeId: createdStores[0].id, ratingValue: 5 },
        { userId: createdUsers[3].id, storeId: createdStores[0].id, ratingValue: 4 },
        // Fresh Market Grocery Store ratings
        { userId: createdUsers[0].id, storeId: createdStores[1].id, ratingValue: 3 },
        { userId: createdUsers[1].id, storeId: createdStores[1].id, ratingValue: 4 },
        { userId: createdUsers[2].id, storeId: createdStores[1].id, ratingValue: 3 },
        // Fashion Forward Clothing Boutique ratings
        { userId: createdUsers[0].id, storeId: createdStores[2].id, ratingValue: 5 },
        { userId: createdUsers[1].id, storeId: createdStores[2].id, ratingValue: 5 },
        { userId: createdUsers[3].id, storeId: createdStores[2].id, ratingValue: 4 },
        // Home & Garden Supplies Center ratings
        { userId: createdUsers[1].id, storeId: createdStores[3].id, ratingValue: 4 },
        { userId: createdUsers[2].id, storeId: createdStores[3].id, ratingValue: 3 },
        { userId: createdUsers[3].id, storeId: createdStores[3].id, ratingValue: 4 },
        // Sports Equipment Warehouse Store ratings
        { userId: createdUsers[0].id, storeId: createdStores[4].id, ratingValue: 2 },
        { userId: createdUsers[2].id, storeId: createdStores[4].id, ratingValue: 3 },
    ];
    for (const ratingData of ratingsData) {
        await prisma.rating.upsert({
            where: {
                userId_storeId: {
                    userId: ratingData.userId,
                    storeId: ratingData.storeId,
                },
            },
            update: {},
            create: ratingData,
        });
    }
    console.log('✅ Created ratings');
    // Update store average ratings
    for (const store of createdStores) {
        const ratings = await prisma.rating.findMany({
            where: { storeId: store.id },
        });
        if (ratings.length > 0) {
            const avgRating = ratings.reduce((sum, rating) => sum + rating.ratingValue, 0) / ratings.length;
            await prisma.store.update({
                where: { id: store.id },
                data: { avgRating: Math.round(avgRating * 100) / 100 },
            });
        }
    }
    console.log('✅ Updated store average ratings');
    // Print summary
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();
    console.log('\n📊 Seed Summary:');
    console.log(`   Users: ${totalUsers}`);
    console.log(`   Stores: ${totalStores}`);
    console.log(`   Ratings: ${totalRatings}`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: admin@storerating.com / Admin123!');
    console.log('   Store Owner 1: owner1@storerating.com / Owner123!');
    console.log('   Store Owner 2: owner2@storerating.com / Owner456!');
    console.log('   Normal User 1: alice@customer.com / User123!');
    console.log('   Normal User 2: bob@customer.com / User456!');
    console.log('   Normal User 3: charlie@customer.com / User789!');
    console.log('   Normal User 4: diana@customer.com / User012!');
    console.log('\n🌱 Database seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map