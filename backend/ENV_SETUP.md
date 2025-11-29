# Environment Variables Setup Guide

## Required Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

### Required Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/ai-form-generator
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
JWT_EXPIRES_IN=7d
```

### Optional but Recommended (for AI features)

```env
# Groq API (for form generation - recommended, fast and free tier available)
# Get your API key from: https://console.groq.com/keys
GROQ_API_KEY=your-groq-api-key-here

# Google Gemini API (alternative for form generation)
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your-google-gemini-api-key-here

# Cohere API (for semantic search and embeddings)
# Get your API key from: https://dashboard.cohere.com/api-keys
COHERE_API_KEY=your-cohere-api-key-here
```

### Optional (for file uploads)

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

## Quick Setup

1. Copy this template to create your `.env` file:
   ```bash
   cd backend
   # Create .env file and add the variables above
   ```

2. **For MongoDB:**
   - Local: Use `mongodb://localhost:27017/ai-form-generator`
   - Cloud: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and get your connection string

3. **For JWT_SECRET:**
   - Generate a secure random string (minimum 32 characters)
   - You can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

4. **For AI Services:**
   - **Groq API** (Recommended): Sign up at [Groq Console](https://console.groq.com/keys) - Fast, free tier available
   - **Gemini API** (Alternative): Sign up at [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **Cohere API**: Sign up at [Cohere Dashboard](https://dashboard.cohere.com/api-keys)

## Testing Your Setup

Run the test script to verify your environment variables:
```bash
node test-env.js
```

## Notes

- The server will start without AI API keys, but AI features won't work
- Form generation requires `GROQ_API_KEY` (or `GEMINI_API_KEY`) and `COHERE_API_KEY` to work properly
- Groq is recommended as it's fast and has a generous free tier
- Never commit your `.env` file to version control!

