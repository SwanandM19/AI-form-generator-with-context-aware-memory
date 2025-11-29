// // Load environment variables FIRST, before any other imports
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '../.env') });

// // Now import other modules (they can now access process.env)
// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import { connectDatabase } from './config/database';
// import { errorHandler } from './middleware/errorHandler';

// // Import routes
// import authRoutes from './routes/auth.routes';
// import formRoutes from './routes/form.routes';
// import submissionRoutes from './routes/submission.routes';
// import uploadRoutes from './routes/upload.routes';

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Trust proxy (for IP address in submissions)
// app.set('trust proxy', true);

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'ok', timestamp: new Date().toISOString() });
// });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/forms', formRoutes);
// app.use('/api/submissions', submissionRoutes);
// app.use('/api/upload', uploadRoutes);

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

// // Error handler
// app.use(errorHandler);

// // Validate required environment variables
// function validateEnvVars() {
//   const required = [
//     'MONGODB_URI',
//     'JWT_SECRET'
//   ];
  
//   const optional = [
//     'GEMINI_API_KEY',
//     'COHERE_API_KEY',
//     'CLOUDINARY_CLOUD_NAME',
//     'GROQ_API_KEY'
//   ];
  
//   const missing = required.filter(key => !process.env[key]);
  
//   if (missing.length > 0) {
//     console.error('❌ Missing required environment variables:');
//     missing.forEach(key => console.error(`   - ${key}`));
//     console.error('\n💡 Please create a .env file in the backend directory with these variables.');
//     process.exit(1);
//   }
  
//   const missingOptional = optional.filter(key => !process.env[key]);
//   if (missingOptional.length > 0) {
//     console.warn('⚠️  Missing optional environment variables (some features may not work):');
//     missingOptional.forEach(key => console.warn(`   - ${key}`));
//     if (missingOptional.includes('GEMINI_API_KEY')) {
//       console.warn('   Get your Gemini API key from: https://makersuite.google.com/app/apikey');
//     }
//     if (missingOptional.includes('COHERE_API_KEY')) {
//       console.warn('   Get your Cohere API key from: https://dashboard.cohere.com/api-keys');
//     }
//     if (missingOptional.includes('GROQ_API_KEY')) {
//       console.warn('   Get your Groq API key from: https://console.groq.com/keys');
//     }
//   }
// }

// // Start server
// const startServer = async () => {
//   try {
//     // Validate environment variables
//     validateEnvVars();
    
//     // Connect to database
//     await connectDatabase();
    
//     // Start listening
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
//       console.log(`✅ All required environment variables are set`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };

// startServer();


import dotenv from 'dotenv';

// Load environment variables FIRST before anything else
dotenv.config();

// Validate critical environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'GROQ_API_KEY',
  'COHERE_API_KEY',
  'CLOUDINARY_URL'
];

console.log('\n🔍 Checking environment variables...');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\n💡 Make sure .env file exists with all required variables!');
  process.exit(1);
}

console.log('✅ All required environment variables are set\n');

// Now import everything else
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

// CORS Configuration - Allow frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://ai-form-generator-with-context-awar.vercel.app'
];

console.log('🌐 Allowed CORS origins:', allowedOrigins);

// Configure CORS with proper options
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('⚠️ Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle all OPTIONS preflight requests
app.options('*', cors());

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy (for IP address in submissions)
app.set('trust proxy', true);

// Request logging middleware (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    allowedOrigins: allowedOrigins
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/upload', uploadRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Form Generator API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      forms: '/api/forms/*',
      submissions: '/api/submissions/*',
      upload: '/api/upload'
    }
  });
});

// 404 handler - must be after all routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler - must be last
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
      console.log(`💾 MongoDB: Connected`);
      console.log(`\n✅ Server is ready to accept requests!\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();
