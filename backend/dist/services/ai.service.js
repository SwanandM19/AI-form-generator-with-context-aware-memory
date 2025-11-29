"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const memory_service_1 = require("./memory.service");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
class AIService {
    /**
     * Generate form schema from natural language prompt with context awareness
     */
    static async generateFormSchema(userId, userPrompt) {
        try {
            // Retrieve relevant past forms (context-aware memory)
            const relevantForms = await memory_service_1.MemoryService.retrieveRelevantForms(userId, userPrompt, 5);
            // Build context from past forms
            const contextPrompt = memory_service_1.MemoryService.buildContextPrompt(relevantForms);
            // Construct full prompt
            const systemPrompt = `You are an intelligent form schema generator. Generate a JSON form schema based on the user's request.

${contextPrompt}

Now generate a new form schema for this request: "${userPrompt}"

Return ONLY valid JSON with this structure:
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
      "options": ["option1", "option2"], // Only for select, radio, checkbox
      "validation": {
        "min": 1,
        "max": 100,
        "pattern": "regex pattern",
        "message": "Validation error message"
      },
      "accept": "image/*" // Only for file type
    }
  ]
}

Guidelines:
- Use "file" type for image/document uploads
- Add validation rules for email, number, text length
- Make fields required when appropriate
- Include descriptive labels and placeholders
- Learn patterns from user's past forms shown above`;
            // Call Gemini API
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContent(systemPrompt);
            const response = await result.response;
            const text = response.text();
            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid response from AI');
            }
            const schema = JSON.parse(jsonMatch[0]);
            // Validate schema structure
            if (!schema.title || !schema.fields || !Array.isArray(schema.fields)) {
                throw new Error('Invalid schema structure');
            }
            return schema;
        }
        catch (error) {
            console.error('AI generation error:', error);
            throw new Error('Failed to generate form schema');
        }
    }
}
exports.AIService = AIService;
