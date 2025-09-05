import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const individualId = searchParams.get('individualId')
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    if (!individualId) {
      return NextResponse.json({ error: 'Individual ID required' }, { status: 400 })
    }

    // Feature 1: Product management
    const products = [
      {
        id: 'prod_1',
        name: 'Premium Website Template',
        description: 'Professional business website template with modern design',
        price: 99.99,
        currency: 'USD',
        category: 'templates',
        stock: 50,
        status: 'active',
        images: ['/assets/product-1.jpg'],
        tags: ['website', 'business', 'responsive'],
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'prod_2', 
        name: 'E-commerce Plugin Suite',
        description: 'Complete e-commerce functionality for your website',
        price: 149.99,
        currency: 'USD',
        category: 'plugins',
        stock: 25,
        status: 'active',
        images: ['/assets/product-2.jpg'],
        tags: ['ecommerce', 'plugin', 'shopping'],
        createdAt: new Date('2024-01-20')
      }
    ]

    // Feature 2: Inventory management
    const inventory = {
      totalProducts: products.length,
      lowStockItems: products.filter(p => p.stock < 10).length,
      outOfStockItems: products.filter(p => p.stock === 0).length,
      categories: ['templates', 'plugins', 'themes', 'tools'],
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
    }

    // Feature 3: Order management
    const orders = [
      {
        id: 'order_1',
        customerId: 'cust_1',
        customerEmail: 'customer1@example.com',
        products: [{ productId: 'prod_1', quantity: 1, price: 99.99 }],
        total: 99.99,
        status: 'completed',
        paymentStatus: 'paid',
        createdAt: new Date('2024-01-25'),
        shippingAddress: {
          name: 'John Doe',
          address: '123 Main St',
          city: 'New York',
          country: 'USA'
        }
      },
      {
        id: 'order_2',
        customerId: 'cust_2', 
        customerEmail: 'customer2@example.com',
        products: [{ productId: 'prod_2', quantity: 1, price: 149.99 }],
        total: 149.99,
        status: 'processing',
        paymentStatus: 'paid',
        createdAt: new Date('2024-01-26')
      }
    ]

    return NextResponse.json({
      products: category ? products.filter(p => p.category === category) : products,
      inventory,
      orders: status ? orders.filter(o => o.status === status) : orders
    })

  } catch (error) {
    console.error('E-commerce API error:', error)
    return NextResponse.json({ error: 'Failed to fetch e-commerce data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { individualId, action, productData, orderData } = await req.json()

    if (!individualId || !action) {
      return NextResponse.json({ error: 'Individual ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'create_product':
        // Feature 4: Product creation
        const newProduct = {
          id: `prod_${Date.now()}`,
          ...productData,
          individualId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        // In a real implementation, save to database
        return NextResponse.json({ 
          success: true, 
          product: newProduct,
          message: 'Product created successfully'
        })

      case 'update_inventory':
        // Feature 5: Inventory updates
        const { productId, stockChange, reason } = productData
        
        return NextResponse.json({
          success: true,
          productId,
          stockChange,
          reason,
          updatedAt: new Date(),
          message: 'Inventory updated successfully'
        })

      case 'process_order':
        // Feature 6: Order processing
        const processedOrder = {
          id: `order_${Date.now()}`,
          ...orderData,
          individualId,
          status: 'processing',
          createdAt: new Date()
        }

        return NextResponse.json({
          success: true,
          order: processedOrder,
          message: 'Order processed successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('E-commerce action error:', error)
    return NextResponse.json({ error: 'Failed to process e-commerce action' }, { status: 500 })
  }
}