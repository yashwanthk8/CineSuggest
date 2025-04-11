// server.js with Supabase integration
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Initialize express app
const app = express();
app.use(express.json());

// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: ['http://127.0.0.1:3000', 'http://localhost:5001'], // Your frontend URLs
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://tgfanudcrbzjmgcsevps.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZmFudWRjcmJ6am1nY3NldnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjY4MDcsImV4cCI6MjA1OTk0MjgwN30.Nhp02Kx2ARzYdUh-zjoDND_HjF4q_AvvVpYuu5v07H8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Sign-up route
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Register user with Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                }
            }
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // User created successfully
        res.status(201).json({
            message: 'User registered successfully. Check your email for confirmation.',
            userId: data.user.id
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Sign-in route
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // Return token and user's name
        res.json({
            message: 'User signed in successfully',
            token: data.session.access_token,
            name: data.user.user_metadata.name || email.split('@')[0]
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Google sign-in route
app.get('/api/auth/google', async (req, res) => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:5001/api/auth/callback'
            }
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // Redirect to the Supabase OAuth URL
        res.redirect(data.url);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// OAuth callback handler
app.get('/api/auth/callback', async (req, res) => {
    // Redirects to frontend with session info
    res.redirect('http://localhost:5001/after.html');
});

// Protected route to verify JWT token
app.get('/api/protected', async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        // Verify with Supabase
        const { data, error } = await supabase.auth.getUser(token);
        
        if (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        res.json({ message: 'Access granted', userId: data.user.id });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Starting server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
