import { neon } from '@neondatabase/serverless';
import { data } from '../constants';

export async function POST(Request) {
    // Add CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS request for CORS
    if (Request.method === 'OPTIONS') {
        return new Response(null, { headers });
    }

    try {
        console.log('Starting user creation in Neon DB...');
        
        // Log the DATABASE_URL (first few characters only for security)
        const dbUrl = process.env.DATABASE_URL;
        console.log('DATABASE_URL exists:', !!dbUrl);
        console.log('DATABASE_URL starts with:', dbUrl ? dbUrl.substring(0, 20) + '...' : 'undefined');
        
        // Validate DATABASE_URL
        if (!dbUrl) {
            console.error('DATABASE_URL is not defined');
            return new Response(JSON.stringify({ error: "Database configuration error" }), { 
                status: 500,
                headers 
            });
        }

        // Create SQL connection
        const sql = neon(dbUrl);
        console.log('SQL connection created');

        // Parse request body
        let body;
        try {
            body = await Request.json();
            console.log('Request body:', body);
        } catch (parseError) {
            console.error('Failed to parse request body:', parseError);
            return new Response(JSON.stringify({ error: "Invalid request body" }), { 
                status: 400,
                headers 
            });
        }

        const {name, email, clerkId} = body;

        console.log("Received data:", { name, email, clerkId });
        
        // Validate required fields
        if (!name || !email || !clerkId) {
            console.error("Missing required fields:", { name, email, clerkId });
            return new Response(JSON.stringify({ error: "Missing required fields" }), { 
                status: 400,
                headers 
            });
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
            return new Response(JSON.stringify({ 
                success: true,
                data: response 
            }), { 
                status: 201,
                headers
            });
        } catch (dbError) {
            console.error('Database operation failed:', dbError);
            return new Response(JSON.stringify({ 
                error: "Failed to create user in database",
                details: dbError.message 
            }), { 
                status: 500,
                headers
            });
        }
    } catch (error) {
        console.error('Server error:', error);
        return new Response(JSON.stringify({ 
            error: "Internal Server Error",
            details: error.message 
        }), { 
            status: 500,
            headers
        });
    }
}