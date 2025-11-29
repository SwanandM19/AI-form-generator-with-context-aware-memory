// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { MemoryService } from './memory.service';
// import mongoose from 'mongoose';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export class AIService {
//   /**
//    * Generate form schema from natural language prompt with context awareness
//    */
//   static async generateFormSchema(
//     userId: mongoose.Types.ObjectId,
//     userPrompt: string
//   ): Promise<any> {
//     try {
//       console.log('🤖 Starting AI form generation...');
      
//       // Retrieve relevant past forms (context-aware memory)
//       console.log('🧠 Retrieving relevant past forms...');
//       const relevantForms = await MemoryService.retrieveRelevantForms(userId, userPrompt, 5);
//       console.log(`📊 Found ${relevantForms.length} relevant past forms`);
      
//       // Build context from past forms
//       const contextPrompt = MemoryService.buildContextPrompt(relevantForms);
      
//       // Construct full prompt
//       const systemPrompt = `You are an intelligent form schema generator. Generate a JSON form schema based on the user's request.

// ${contextPrompt}

// Now generate a new form schema for this request: "${userPrompt}"

// Return ONLY valid JSON with this structure:
// {
//   "title": "Form Title",
//   "description": "Brief description",
//   "purpose": "Category like 'job application', 'survey', 'registration', etc.",
//   "fields": [
//     {
//       "id": "unique_field_id",
//       "type": "text|email|number|textarea|select|radio|checkbox|file|date",
//       "label": "Field Label",
//       "placeholder": "Optional placeholder",
//       "required": true|false,
//       "options": ["option1", "option2"],
//       "validation": {
//         "min": 1,
//         "max": 100,
//         "pattern": "regex pattern",
//         "message": "Validation error message"
//       },
//       "accept": "image/*"
//     }
//   ]
// }

// Guidelines:
// - Use "file" type for image/document uploads
// - Add validation rules for email, number, text length
// - Make fields required when appropriate
// - Include descriptive labels and placeholders
// - Learn patterns from user's past forms shown above
// - Return ONLY the JSON, no markdown code blocks, no explanation`;

//       console.log('📡 Calling Gemini API...');
      
//       // Use Gemini 2.5 Flash (fastest and most capable)
//       const model = genAI.getGenerativeModel({ 
//         model: 'gemini-2.5-flash',
//         generationConfig: {
//           temperature: 0.7,
//           topK: 40,
//           topP: 0.95,
//           maxOutputTokens: 2048,
//         }
//       });
      
//       const result = await model.generateContent(systemPrompt);
//       const response = await result.response;
//       const text = response.text();
      
//       console.log('✅ Received response from Gemini');
//       console.log('Response preview:', text.substring(0, 200));
      
//       // Extract JSON from response (handle markdown code blocks)
//       let jsonText = text;
      
//       // Remove markdown code blocks if present
//       jsonText = jsonText.replace(/```\s*/g, '');
//       jsonText = jsonText.trim();
      
//       // Extract JSON object
//       const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
//       if (!jsonMatch) {
//         console.error('❌ Invalid response - no JSON found');
//         console.log('Full response:', text);
//         throw new Error('Invalid response from AI');
//       }
      
//       const schema = JSON.parse(jsonMatch[0]);
      
//       // Validate schema structure
//       if (!schema.title || !schema.fields || !Array.isArray(schema.fields)) {
//         console.error('❌ Invalid schema structure');
//         console.log('Schema:', schema);
//         throw new Error('Invalid schema structure');
//       }
      
//       // Add unique IDs to fields if missing
//       schema.fields = schema.fields.map((field: any, index: number) => ({
//         ...field,
//         id: field.id || `field_${index + 1}`
//       }));
      
//       console.log('✅ Form schema generated successfully');
//       console.log(`Generated ${schema.fields.length} fields`);
      
//       return schema;
//     } catch (error: any) {
//       console.error('AI generation error:', error);
//       throw new Error('Failed to generate form schema');
//     }
//   }
// }


import Groq from 'groq-sdk';
import { MemoryService } from './memory.service';
import mongoose from 'mongoose';

// Initialize Groq client (will be validated on first use)
let groq: Groq | null = null;

function getGroqClient(): Groq {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is required. Please set it in your .env file. Get your API key from: https://console.groq.com/keys');
  }
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groq;
}

export class AIService {
  /**
   * Generate form schema from natural language prompt with context awareness
   */
  static async generateFormSchema(
    userId: mongoose.Types.ObjectId,
    userPrompt: string
  ): Promise<any> {
    try {
      console.log('🤖 Starting AI form generation with Groq...');
      
      // Retrieve relevant past forms (context-aware memory)
      console.log('🧠 Retrieving relevant past forms...');
      const relevantForms = await MemoryService.retrieveRelevantForms(userId, userPrompt, 5);
      console.log(`📊 Found ${relevantForms.length} relevant past forms`);
      
      // Build context from past forms
      const contextPrompt = MemoryService.buildContextPrompt(relevantForms);
      
      // Construct full prompt
      const systemPrompt = `You are an intelligent form schema generator. Generate a JSON form schema based on the user's request.

${contextPrompt}

Now generate a new form schema for this request: "${userPrompt}"

Return ONLY valid JSON with this structure (no markdown, no explanation):
{
  "title": "Form Title",
  "description": "Brief description",
  "purpose": "Category like 'job application', 'survey', 'registration', etc.",
  "fields": [
    {
      "id": "unique_field_id",
      "type": "text|email|number|textarea|select|radio|checkbox|file|date",
      "label": "Field Label",
      "placeholder": "Optional placeholder",
      "required": true|false,
      "options": ["option1", "option2"],
      "validation": {
        "min": 1,
        "max": 100,
        "pattern": "regex pattern",
        "message": "Validation error message"
      },
      "accept": "image/*"
    }
  ]
}

Guidelines:
- Use "file" type for image/document uploads
- Add validation rules for email, number, text length
- Make fields required when appropriate
- Include descriptive labels and placeholders
- Learn patterns from user's past forms shown above`;

      console.log('📡 Calling Groq API...');
      
      const client = getGroqClient();
      const completion = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a form schema generator. Return only valid JSON, no markdown code blocks, no explanation."
          },
          {
            role: "user",
            content: systemPrompt
          }
        ],
        model: "openai/gpt-oss-20b",
        temperature: 0.7,
        max_tokens: 2048,
      });

      const text = completion.choices[0]?.message?.content || '';
      
      console.log('✅ Received response from Groq');
      console.log('Response preview:', text.substring(0, 200));
      
      // Extract JSON from response (handle markdown code blocks)
      let jsonText = text;
      
      // Remove markdown code blocks if present
      
      jsonText = jsonText.replace(/```\s*/g, '');
      jsonText = jsonText.trim();
      
      // Extract JSON object
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('❌ Invalid response - no JSON found');
        console.log('Full response:', text);
        throw new Error('Invalid response from AI');
      }
      
      const schema = JSON.parse(jsonMatch[0]);
      
      // Validate schema structure
      if (!schema.title || !schema.fields || !Array.isArray(schema.fields)) {
        console.error('❌ Invalid schema structure');
        console.log('Schema:', schema);
        throw new Error('Invalid schema structure');
      }
      
      // Add unique IDs to fields if missing
      schema.fields = schema.fields.map((field: any, index: number) => ({
        ...field,
        id: field.id || `field_${index + 1}`
      }));
      
      console.log('✅ Form schema generated successfully');
      console.log(`Generated ${schema.fields.length} fields`);
      
      return schema;
    } catch (error: any) {
      console.error('AI generation error:', error);
      throw new Error('Failed to generate form schema');
    }
  }
}
