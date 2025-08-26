
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { name, type, host, port, database, username, password } = await req.json()

    // Validate connection parameters
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    // Test connection based on database type
    let isConnected = false
    
    try {
      if (type === 'postgresql') {
        // Test PostgreSQL connection
        const { Client } = require('pg')
        const client = new Client({
          host,
          port,
          database,
          user: username,
          password
        })
        await client.connect()
        await client.end()
        isConnected = true
      } else if (type === 'mysql') {
        // Test MySQL connection
        const mysql = require('mysql2/promise')
        const connection = await mysql.createConnection({
          host,
          port,
          database,
          user: username,
          password
        })
        await connection.end()
        isConnected = true
      } else if (type === 'mongodb') {
        // Test MongoDB connection
        const { MongoClient } = require('mongodb')
        const client = new MongoClient(`mongodb://${username}:${password}@${host}:${port}/${database}`)
        await client.connect()
        await client.close()
        isConnected = true
      }
    } catch (error) {
      console.error('Database connection test failed:', error)
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 400 }
      )
    }

    // Store connection details (encrypted)
    const connectionId = `conn_${Date.now()}`
    
    // In a real app, you'd store encrypted credentials in your database
    // For now, we'll just return a success response
    
    return NextResponse.json({
      id: connectionId,
      name,
      type,
      host,
      port,
      database,
      username,
      isConnected
    })

  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
