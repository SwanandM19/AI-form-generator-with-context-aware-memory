// require('dotenv').config();
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const apiKey = process.env.GEMINI_API_KEY;

// console.log('🧪 Testing Gemini API...\n');
// console.log('API Key loaded:', !!apiKey);
// console.log('API Key length:', apiKey?.length || 0);

// if (!apiKey) {
//   console.error('\n❌ GEMINI_API_KEY not found in .env file!');
//   process.exit(1);
// }

// const genAI = new GoogleGenerativeAI(apiKey);

// async function testModels() {
//   const modelsToTest = [
//     'gemini-1.5-flash',
//     'gemini-1.5-pro',
//     'gemini-pro-latest',
//     'gemini-pro'
//   ];

//   for (const modelName of modelsToTest) {
//     try {
//       console.log(`\n📡 Testing model: ${modelName}...`);
//       const model = genAI.getGenerativeModel({ model: modelName });
      
//       const result = await model.generateContent('Say hello');
//       const response = await result.response;
//       const text = response.text();
      
//       console.log(`✅ ${modelName} works!`);
//       console.log(`Response: ${text.substring(0, 50)}...`);
      
//       // If this model works, we're done
//       console.log(`\n🎯 Use this model: "${modelName}"`);
//       break;
//     } catch (error) {
//       console.log(`❌ ${modelName} failed: ${error.message}`);
//     }
//   }
// }

// testModels();
// require('dotenv').config();
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const apiKey = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// async function listModels() {
//   try {
//     console.log('📋 Fetching available models...\n');
    
//     // Try to list models
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
//     );
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     console.log('✅ Available models:\n');
//     data.models.forEach(model => {
//       if (model.supportedGenerationMethods?.includes('generateContent')) {
//         console.log(`✅ ${model.name}`);
//         console.log(`   Display Name: ${model.displayName}`);
//         console.log(`   Methods: ${model.supportedGenerationMethods.join(', ')}`);
//         console.log('');
//       }
//     });
    
//   } catch (error) {
//     console.error('❌ Error:', error.message);
//   }
// }

// listModels();

require('dotenv').config();
const cloudinary = require('cloudinary').v2;

console.log('🧪 Testing CLOUDINARY_URL...\n');

const url = process.env.CLOUDINARY_URL;
console.log('CLOUDINARY_URL loaded:', !!url);
console.log('URL format:', url ? url.substring(0, 30) + '...' : '❌ Missing');

if (!url) {
  console.error('\n❌ CLOUDINARY_URL not found in .env file!');
  process.exit(1);
}

// Configure with URL
cloudinary.config({
  cloudinary_url: url
});

async function test() {
  try {
    console.log('\n📡 Testing Cloudinary connection...');
    const result = await cloudinary.api.ping();
    console.log('✅ SUCCESS! Cloudinary is working!');
    console.log('Status:', result.status);
    
    // Get config details
    const config = cloudinary.config();
    console.log('\nCloud Name:', config.cloud_name);
    console.log('API Key:', config.api_key?.substring(0, 5) + '...');
  } catch (error) {
    console.error('❌ FAILED:', error.message);
  }
}

test();

