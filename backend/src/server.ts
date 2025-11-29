// Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Now import other modules (they can now access process.env)
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth.routes';
import formRoutes from './routes/form.routes';
import submissionRoutes from './routes/submission.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy (for IP address in submissions)
app.set('trust proxy', true);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Validate required environment variables
function validateEnvVars() {
  const required = [
    'MONGODB_URI',
    'JWT_SECRET'
  ];
  
  const optional = [
    'GEMINI_API_KEY',
    'COHERE_API_KEY',
    'CLOUDINARY_CLOUD_NAME',
    'GROQ_API_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n💡 Please create a .env file in the backend directory with these variables.');
    process.exit(1);
  }
  
  const missingOptional = optional.filter(key => !process.env[key]);
  if (missingOptional.length > 0) {
    console.warn('⚠️  Missing optional environment variables (some features may not work):');
    missingOptional.forEach(key => console.warn(`   - ${key}`));
    if (missingOptional.includes('GEMINI_API_KEY')) {
      console.warn('   Get your Gemini API key from: https://makersuite.google.com/app/apikey');
    }
    if (missingOptional.includes('COHERE_API_KEY')) {
      console.warn('   Get your Cohere API key from: https://dashboard.cohere.com/api-keys');
    }
    if (missingOptional.includes('GROQ_API_KEY')) {
      console.warn('   Get your Groq API key from: https://console.groq.com/keys');
    }
  }
}

// Start server
const startServer = async () => {
  try {
    // Validate environment variables
    validateEnvVars();
    
    // Connect to database
    await connectDatabase();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✅ All required environment variables are set`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
