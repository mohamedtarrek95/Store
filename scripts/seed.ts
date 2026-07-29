import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';
import Category from '../src/models/Category';
import Product from '../src/models/Product';
import Settings from '../src/models/Settings';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is required');
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Settings.deleteMany({});

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const hashedPassword = await bcrypt.hash('admin123', 12);

    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
    });

    console.log('Admin user created');

    const categories = await Category.insertMany([
      { name: 'Watches', slug: 'watches', description: 'Premium timepieces for every occasion', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800' },
      { name: 'Bracelets', slug: 'bracelets', description: 'Elegant bracelets and bangles', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800' },
      { name: 'Necklaces', slug: 'necklaces', description: 'Stunning necklaces and pendants', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800' },
      { name: 'Rings', slug: 'rings', description: 'Beautiful rings for every finger', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800' },
      { name: 'Sunglasses', slug: 'sunglasses', description: 'Designer sunglasses and eyewear', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800' },
      { name: 'Bags', slug: 'bags', description: 'Luxury handbags and clutches', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800' },
      { name: 'Wallets', slug: 'wallets', description: 'Premium leather wallets and cardholders', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800' },
    ]);

    console.log('Categories created');

    const products = [
      {
        name: 'Classic Chronograph Watch',
        slug: 'classic-chronograph-watch',
        description: 'A timeless chronograph watch with sapphire crystal glass, stainless steel case, and genuine leather strap. Features precise quartz movement, date display, and water resistance up to 50 meters.',
        category: categories[0]._id,
        price: 299,
        discountPrice: 249,
        sku: 'WAT-001',
        stock: 50,
        images: [
          'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
          'https://images.unsplash.com/photo-1548171915-e5a8f91a1be0?w=800',
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        ],
        featuredImage: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
        colors: ['Silver', 'Gold', 'Black'],
        sizes: ['Small', 'Medium', 'Large'],
        brand: 'Luxe Time',
        rating: 4.5,
        numReviews: 128,
        featured: true,
        bestSeller: true,
        newArrival: false,
      },
      {
        name: 'Minimalist Leather Watch',
        slug: 'minimalist-leather-watch',
        description: 'Clean, minimalist design with genuine Italian leather strap. Ultra-thin case with Japanese quartz movement.',
        category: categories[0]._id,
        price: 199,
        discountPrice: 159,
        sku: 'WAT-002',
        stock: 75,
        images: [
          'https://images.unsplash.com/photo-1548171915-e5a8f91a1be0?w=800',
          'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
        ],
        featuredImage: 'https://images.unsplash.com/photo-1548171915-e5a8f91a1be0?w=800',
        colors: ['Brown', 'Black', 'Navy'],
        sizes: ['Small', 'Medium', 'Large'],
        brand: 'Luxe Time',
        rating: 4.7,
        numReviews: 95,
        featured: true,
        bestSeller: true,
        newArrival: true,
      },
      {
        name: 'Gold Chain Bracelet',
        slug: 'gold-chain-bracelet',
        description: 'Premium 18k gold-plated chain bracelet. Hypoallergenic and tarnish-resistant. Perfect for daily wear or special occasions.',
        category: categories[1]._id,
        price: 149,
        discountPrice: 119,
        sku: 'BRL-001',
        stock: 100,
        images: [
          'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
          'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
        ],
        featuredImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
        colors: ['Gold', 'Silver', 'Rose Gold'],
        sizes: ['Small', 'Medium', 'Large'],
        brand: 'Luxe Jewels',
        rating: 4.3,
        numReviews: 67,
        featured: true,
        bestSeller: false,
        newArrival: false,
      },
      {
        name: 'Pearl Pendant Necklace',
        slug: 'pearl-pendant-necklace',
        description: 'Elegant freshwater pearl pendant on a sterling silver chain. Each pearl is hand-selected for luster and quality.',
        category: categories[2]._id,
        price: 249,
        discountPrice: 199,
        sku: 'NCK-001',
        stock: 40,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
          'https://images.unsplash.com/photo-1515562141589-67f022fb8c1e?w=800',
        ],
        featuredImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
        colors: ['White', 'Black', 'Pink'],
        sizes: ['16"', '18"', '20"'],
        brand: 'Luxe Jewels',
        rating: 4.8,
        numReviews: 43,
        featured: true,
        bestSeller: false,
        newArrival: true,
      },
      {
        name: 'Diamond Eternity Ring',
        slug: 'diamond-eternity-ring',
        description: 'Stunning diamond eternity ring with conflict-free diamonds set in 14k white gold. A symbol of everlasting love.',
        category: categories[3]._id,
        price: 899,
        discountPrice: 799,
        sku: 'RNG-001',
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
          'https://images.unsplash.com/photo-1603561597606-f36bce04b0e5?w=800',
        ],
        featuredImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
        colors: ['White Gold', 'Rose Gold', 'Platinum'],
        sizes: ['5', '6', '7', '8'],
        brand: 'Luxe Diamonds',
        rating: 4.9,
        numReviews: 32,
        featured: true,
        bestSeller: true,
        newArrival: false,
      },
      {
        name: 'Aviator Sunglasses',
        slug: 'aviator-sunglasses',
        description: 'Classic aviator sunglasses with polarized UV400 lenses. Lightweight titanium frame with adjustable nose pads.',
        category: categories[4]._id,
        price: 179,
        discountPrice: 149,
        sku: 'SUN-001',
        stock: 60,
        images: [
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
          'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800',
        ],
        featuredImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
        colors: ['Gold', 'Silver', 'Black'],
        sizes: ['Standard'],
        brand: 'Luxe Optics',
        rating: 4.4,
        numReviews: 88,
        featured: true,
        bestSeller: false,
        newArrival: false,
      },
      {
        name: 'Tote Bag - Signature Canvas',
        slug: 'tote-bag-signature-canvas',
        description: 'Spacious tote bag crafted from premium canvas with genuine leather trim. Features interior pockets and reinforced stitching.',
        category: categories[5]._id,
        price: 349,
        sku: 'BAG-001',
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
          'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800',
        ],
        featuredImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
        colors: ['Beige', 'Black', 'Navy'],
        sizes: ['Medium', 'Large'],
        brand: 'Luxe Leather',
        rating: 4.6,
        numReviews: 54,
        featured: false,
        bestSeller: true,
        newArrival: true,
      },
      {
        name: 'Slim Leather Wallet',
        slug: 'slim-leather-wallet',
        description: 'Minimalist slim wallet crafted from full-grain Italian leather. RFID blocking technology with 6 card slots and a bill compartment.',
        category: categories[6]._id,
        price: 89,
        discountPrice: 69,
        sku: 'WAL-001',
        stock: 120,
        images: [
          'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
          'https://images.unsplash.com/photo-1559563458-527698bf5295?w=800',
        ],
        featuredImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
        colors: ['Brown', 'Black', 'Tan', 'Navy'],
        sizes: ['Standard'],
        brand: 'Luxe Leather',
        rating: 4.2,
        numReviews: 156,
        featured: false,
        bestSeller: true,
        newArrival: false,
      },
      {
        name: 'Silver Tennis Bracelet',
        slug: 'silver-tennis-bracelet',
        description: 'Classic tennis bracelet with round-cut cubic zirconia set in polished sterling silver. Secure lobster clasp closure.',
        category: categories[1]._id,
        price: 199,
        discountPrice: 169,
        sku: 'BRL-002',
        stock: 45,
        images: [
          'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
          'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
        ],
        featuredImage: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
        colors: ['Silver', 'Gold'],
        sizes: ['Small', 'Medium', 'Large'],
        brand: 'Luxe Jewels',
        rating: 4.5,
        numReviews: 73,
        featured: false,
        bestSeller: false,
        newArrival: true,
      },
    ];

    await Product.insertMany(products);
    console.log('Products created');

    await Settings.create({
      storeName: 'Luxe Accessories',
      contactEmail: 'hello@luxeaccessories.com',
      phone: '+1 (555) 123-4567',
      address: '123 Luxury Ave, New York, NY 10001',
      socialLinks: {
        facebook: 'https://facebook.com/luxeaccessories',
        instagram: 'https://instagram.com/luxeaccessories',
        twitter: 'https://twitter.com/luxeaccessories',
        youtube: 'https://youtube.com/@luxeaccessories',
      },
      shippingCost: 10,
      taxRate: 8,
      currency: 'USD',
      bannerText: 'Summer Sale - Up to 30% Off Selected Items',
    });

    console.log('Settings created');
    console.log('Seed completed successfully!');
    console.log('Admin email:', adminEmail);
    console.log('Admin password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
