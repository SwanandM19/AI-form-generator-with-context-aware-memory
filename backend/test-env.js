require('dotenv').config();

console.log('🧪 Testing environment variables...\n');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing');
console.log('COHERE_API_KEY:', process.env.COHERE_API_KEY ? '✅ Set' : '❌ Missing');
console.log('\nFull COHERE_API_KEY value:', process.env.COHERE_API_KEY);
