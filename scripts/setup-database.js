const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    // Create connection to MySQL server (without specifying database)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'password'
    });

    // Create database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS website_builder');
    console.log('✅ Database "website_builder" created successfully');

    // Create sample tables for testing
    await connection.execute('USE website_builder');

    // Create sample data tables
    const sampleTables = [
      `CREATE TABLE IF NOT EXISTS sample_users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS sample_products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        image_url TEXT,
        category VARCHAR(100),
        stock_quantity INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS sample_orders (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS sample_blog_posts (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content LONGTEXT,
        author VARCHAR(255),
        featured_image TEXT,
        published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS sample_contacts (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const query of sampleTables) {
      await connection.execute(query);
    }

    console.log('✅ Sample tables created successfully');

    // Insert sample data
    const sampleData = [
      // Sample users
      `INSERT IGNORE INTO sample_users (id, name, email) VALUES 
        ('user1', 'John Doe', 'john@example.com'),
        ('user2', 'Jane Smith', 'jane@example.com'),
        ('user3', 'Mike Johnson', 'mike@example.com')`,

      // Sample products
      `INSERT IGNORE INTO sample_products (id, name, price, description, category, stock_quantity) VALUES 
        ('prod1', 'Laptop', 999.99, 'High-performance laptop', 'Electronics', 50),
        ('prod2', 'Smartphone', 699.99, 'Latest smartphone model', 'Electronics', 100),
        ('prod3', 'Headphones', 199.99, 'Noise-cancelling headphones', 'Audio', 75),
        ('prod4', 'Coffee Maker', 149.99, 'Automatic coffee maker', 'Appliances', 30),
        ('prod5', 'Running Shoes', 129.99, 'Professional running shoes', 'Sports', 200)`,

      // Sample blog posts
      `INSERT IGNORE INTO sample_blog_posts (id, title, content, author, published) VALUES 
        ('blog1', 'How to Build Amazing Websites', 'Content about website building...', 'Admin', TRUE),
        ('blog2', 'E-commerce Best Practices', 'Tips for successful online stores...', 'Expert', TRUE),
        ('blog3', 'Mobile App Development Guide', 'Complete guide to mobile development...', 'Developer', TRUE)`
    ];

    for (const query of sampleData) {
      await connection.execute(query);
    }

    console.log('✅ Sample data inserted successfully');

    await connection.end();

    console.log('🎉 Database setup completed!');
    console.log('📝 Next steps:');
    console.log('1. Update your .env file with the correct database credentials');
    console.log('2. Run: npm run db:push');
    console.log('3. Start your development server: npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

createDatabase();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const aiTemplates = [
  {
    name: 'E-commerce Store (Amazon Style)',
    description: 'Complete online marketplace with product catalog, shopping cart, checkout, user accounts, and admin panel',
    category: 'ecommerce',
    prompt: `Create a full-featured e-commerce platform similar to Amazon with:
- Product catalog with search, filters, and categories
- Shopping cart and wishlist functionality
- User authentication and profiles
- Secure checkout with payment integration
- Order tracking and history
- Admin dashboard for inventory management
- Product reviews and ratings system
- Responsive design for mobile and desktop`,
    structure: JSON.stringify({
      pages: ['home', 'products', 'product-detail', 'cart', 'checkout', 'profile', 'orders', 'admin'],
      sections: ['header', 'product-grid', 'filters', 'cart-sidebar', 'payment-form'],
      apis: ['products', 'cart', 'orders', 'payments', 'users', 'reviews']
    }),
    components: JSON.stringify([
      'product-card', 'shopping-cart', 'checkout-form', 'payment-gateway',
      'search-bar', 'filter-panel', 'review-system', 'admin-dashboard'
    ]),
    features: JSON.stringify([
      'Product Catalog', 'Shopping Cart', 'Payment Processing',
      'User Authentication', 'Order Management', 'Admin Panel', 'Reviews'
    ]),
  },
  {
    name: 'AI Chat Platform (ChatGPT Style)',
    description: 'AI-powered chat platform with conversation history and multiple AI models',
    category: 'ai',
    prompt: `Create an AI chat platform similar to ChatGPT with:
- Clean chat interface with message bubbles
- Real-time typing indicators
- Conversation history and management
- Multiple AI model selection
- User authentication and profiles
- Code syntax highlighting
- Export chat functionality
- Responsive design`,
    structure: JSON.stringify({
      pages: ['chat', 'history', 'settings', 'login'],
      sections: ['sidebar', 'chat-area', 'input-section'],
      apis: ['chat', 'conversations', 'users', 'ai-models']
    }),
    components: JSON.stringify([
      'chat-bubble', 'typing-indicator', 'code-block',
      'conversation-list', 'model-selector', 'export-button'
    ]),
    features: JSON.stringify([
      'AI Chat', 'Conversation History', 'Code Highlighting',
      'Model Selection', 'Export Chats', 'Real-time Typing'
    ]),
  },
  {
    name: 'Social Media Dashboard',
    description: 'Multi-platform social media management and analytics dashboard',
    category: 'social',
    prompt: `Create a comprehensive social media management platform with:
- Multi-platform posting (Facebook, Twitter, Instagram, LinkedIn)
- Content calendar and scheduling
- Analytics and engagement metrics
- Team collaboration and approval workflows
- Content library and media management
- Audience insights and demographics
- Automated posting and cross-platform syncing`,
    structure: JSON.stringify({
      pages: ['dashboard', 'calendar', 'analytics', 'content', 'settings'],
      sections: ['post-composer', 'calendar-view', 'analytics-charts', 'media-library'],
      apis: ['posts', 'analytics', 'social-accounts', 'media', 'scheduling']
    }),
    components: JSON.stringify([
      'post-composer', 'calendar-widget', 'analytics-chart',
      'media-uploader', 'account-connector', 'performance-metrics'
    ]),
    features: JSON.stringify([
      'Multi-Platform Posting', 'Content Scheduling', 'Analytics Dashboard',
      'Team Collaboration', 'Media Management', 'Performance Tracking'
    ]),
  }
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing AI templates
  await prisma.aITemplate.deleteMany({});

  // Seed AI templates
  for (const template of aiTemplates) {
    await prisma.aITemplate.create({
      data: template,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created ${aiTemplates.length} AI templates`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });