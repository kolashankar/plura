
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
