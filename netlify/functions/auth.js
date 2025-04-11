const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://tgfanudcrbzjmgcsevps.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZmFudWRjcmJ6am1nY3NldnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjY4MDcsImV4cCI6MjA1OTk0MjgwN30.Nhp02Kx2ARzYdUh-zjoDND_HjF4q_AvvVpYuu5v07H8';
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS enabled' })
    };
  }

  const path = event.path.replace('/api/', '');
  
  // Handle different API paths
  if (event.httpMethod === 'POST' && path === 'signup') {
    return handleSignup(event, headers);
  } else if (event.httpMethod === 'POST' && path === 'signin') {
    return handleSignin(event, headers);
  } else if (event.httpMethod === 'GET' && path === 'auth/google') {
    return handleGoogleAuth(headers);
  } else if (event.httpMethod === 'GET' && path === 'protected') {
    return handleProtectedRoute(event, headers);
  } else {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };
  }
};

async function handleSignup(event, headers) {
  try {
    const { name, email, password } = JSON.parse(event.body);

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
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: error.message })
      };
    }

    // User created successfully
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'User registered successfully. Check your email for confirmation.',
        userId: data.user.id
      })
    };
  } catch (err) {
    console.error('Server error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
}

async function handleSignin(event, headers) {
  try {
    const { email, password } = JSON.parse(event.body);

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: error.message })
      };
    }

    // Return token and user's name
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'User signed in successfully',
        token: data.session.access_token,
        name: data.user.user_metadata.name || email.split('@')[0]
      })
    };
  } catch (err) {
    console.error('Server error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
}

async function handleGoogleAuth(headers) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: process.env.SITE_URL ? `${process.env.SITE_URL}/after.html` : 'http://localhost:8888/after.html'
      }
    });

    if (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: error.message })
      };
    }

    // Redirect to the Supabase OAuth URL
    return {
      statusCode: 302,
      headers: {
        ...headers,
        Location: data.url
      },
      body: ''
    };
  } catch (err) {
    console.error('Server error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
}

async function handleProtectedRoute(event, headers) {
  const token = event.headers.authorization;

  if (!token) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Access denied' })
    };
  }

  try {
    // Verify with Supabase
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid token' })
      };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Access granted', 
        userId: data.user.id,
        email: data.user.email 
      })
    };
  } catch (err) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Invalid token' })
    };
  }
} 