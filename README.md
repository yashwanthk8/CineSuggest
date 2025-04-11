# Movie Recommendation Website

Movie recommendation website with Supabase authentication integration.

## Features

- User authentication with email/password via Supabase
- Google OAuth sign-in option
- Movie search and recommendations

## Deployment to Netlify

### Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Run the local development server:
   ```
   npm start
   ```

3. Access the site at http://localhost:8888

### Deploy to Netlify

1. Create a Netlify account at https://netlify.com

2. Install Netlify CLI globally (if not already installed):
   ```
   npm install -g netlify-cli
   ```

3. Login to Netlify:
   ```
   netlify login
   ```

4. Initialize your site (run from the project root):
   ```
   netlify init
   ```

5. Deploy your site:
   ```
   netlify deploy --prod
   ```

### Environment Variables

Set these environment variables in the Netlify dashboard:

- `SUPABASE_URL`: Your Supabase project URL 
- `SUPABASE_KEY`: Your Supabase anon key
- `SITE_URL`: Your deployed site URL (e.g., https://your-site-name.netlify.app)

### Supabase Configuration

1. In your Supabase project, go to Authentication > URL Configuration
2. Add your Netlify site URL to the allowed redirect URLs
3. For Google Authentication, configure:
   - OAuth callback URL: `https://your-site-name.netlify.app/api/auth/callback`
   
## Project Structure

- `index.html` - Main page with movie search
- `recommend.html` - Movie recommendations based on preferences
- `sign_in.html` / `sign_up.html` - Authentication forms
- `netlify/functions/auth.js` - Serverless function for authentication 