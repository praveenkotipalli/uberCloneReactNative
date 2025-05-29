const express = require('express');
const cors = require('cors');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const app = express();
const port = 8081;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint for user creation
app.post('/api/user', async (req, res) => {
    try {
        console.log('Starting user creation in Neon DB...');
        
        // Log the DATABASE_URL (first few characters only for security)
        const dbUrl = process.env.DATABASE_URL;
        console.log('DATABASE_URL exists:', !!dbUrl);
        console.log('DATABASE_URL starts with:', dbUrl ? dbUrl.substring(0, 20) + '...' : 'undefined');
        
        // Validate DATABASE_URL
        if (!dbUrl) {
            console.error('DATABASE_URL is not defined');
            return res.status(500).json({ error: "Database configuration error" });
        }

        // Create SQL connection
        const sql = neon(dbUrl);
        console.log('SQL connection created');

        const {name, email, clerkId} = req.body;
        console.log("Received data:", { name, email, clerkId });
        
        // Validate required fields
        if (!name || !email || !clerkId) {
            console.error("Missing required fields:", { name, email, clerkId });
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            console.log('Attempting to insert user into Neon DB...');
            
            // First, check if the table exists
            const tableCheck = await sql`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'users'
                );
            `;
            console.log('Table exists check:', tableCheck);

            // Create table if it doesn't exist
            if (!tableCheck[0]?.exists) {
                console.log('Creating users table...');
                await sql`
                    CREATE TABLE IF NOT EXISTS users (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) NOT NULL,
                        clerk_id VARCHAR(255) NOT NULL,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                `;
                console.log('Users table created');
            }

            // Insert the user
            const response = await sql`
                INSERT INTO users (
                    name, email, clerk_id
                ) 
                VALUES (
                    ${name}, ${email}, ${clerkId}
                )
                RETURNING *`;
            
            console.log('Successfully inserted user:', response);
            return res.status(201).json({ 
                success: true,
                data: response 
            });
        } catch (dbError) {
            console.error('Database operation failed:', dbError);
            return res.status(500).json({ 
                error: "Failed to create user in database",
                details: dbError.message 
            });
        }
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ 
            error: "Internal Server Error",
            details: error.message 
        });
    }
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 