"use strict";
// import { CohereClient } from 'cohere-ai';
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingService = void 0;
// const cohere = new CohereClient({
//   token: process.env.COHERE_API_KEY!
// });
// export class EmbeddingService {
//   /**
//    * Generate embedding for text using Cohere
//    */
//   static async generateEmbedding(text: string): Promise<number[]> {
//     try {
//       const response = await cohere.embed({
//         texts: [text],
//         model: 'embed-english-v3.0',
//         inputType: 'search_document'
//       });
//       return response.embeddings[0];
//     } catch (error) {
//       console.error('Embedding generation error:', error);
//       throw new Error('Failed to generate embedding');
//     }
//   }
//   /**
//    * Generate query embedding
//    */
//   static async generateQueryEmbedding(query: string): Promise<number[]> {
//     try {
//       const response = await cohere.embed({
//         texts: [query],
//         model: 'embed-english-v3.0',
//         inputType: 'search_query'
//       });
//       return response.embeddings[0];
//     } catch (error) {
//       console.error('Query embedding error:', error);
//       throw new Error('Failed to generate query embedding');
//     }
//   }
//   /**
//    * Calculate cosine similarity between two vectors
//    */
//   static cosineSimilarity(vecA: number[], vecB: number[]): number {
//     const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
//     const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
//     const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
//     return dotProduct / (magnitudeA * magnitudeB);
//   }
// }
const cohere_ai_1 = require("cohere-ai");
const cohere = new cohere_ai_1.CohereClient({
    token: process.env.COHERE_API_KEY
});
class EmbeddingService {
    /**
     * Generate embedding for text using Cohere
     */
    static async generateEmbedding(text) {
        try {
            const response = await cohere.embed({
                texts: [text],
                model: 'embed-english-v3.0',
                inputType: 'search_document'
            });
            // FIX: Add proper type handling for embeddings
            const embeddings = response.embeddings;
            if (Array.isArray(embeddings) && embeddings.length > 0) {
                return embeddings[0];
            }
            throw new Error('No embeddings returned');
        }
        catch (error) {
            console.error('Embedding generation error:', error);
            throw new Error('Failed to generate embedding');
        }
    }
    /**
     * Generate query embedding
     */
    static async generateQueryEmbedding(query) {
        try {
            const response = await cohere.embed({
                texts: [query],
                model: 'embed-english-v3.0',
                inputType: 'search_query'
            });
            // FIX: Add proper type handling for embeddings
            const embeddings = response.embeddings;
            if (Array.isArray(embeddings) && embeddings.length > 0) {
                return embeddings[0];
            }
            throw new Error('No embeddings returned');
        }
        catch (error) {
            console.error('Query embedding error:', error);
            throw new Error('Failed to generate query embedding');
        }
    }
    /**
     * Calculate cosine similarity between two vectors
     */
    static cosineSimilarity(vecA, vecB) {
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
        const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
        return dotProduct / (magnitudeA * magnitudeB);
    }
}
exports.EmbeddingService = EmbeddingService;
