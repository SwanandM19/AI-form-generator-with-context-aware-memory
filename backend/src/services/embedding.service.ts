// import { CohereClient } from 'cohere-ai';

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
import { CohereClient } from 'cohere-ai';

// Initialize Cohere client (will be validated on first use)
let cohere: CohereClient | null = null;

function getCohereClient(): CohereClient {
  if (!process.env.COHERE_API_KEY) {
    throw new Error('COHERE_API_KEY is required. Please set it in your .env file. Get your API key from: https://dashboard.cohere.com/api-keys');
  }
  if (!cohere) {
    cohere = new CohereClient({
      token: process.env.COHERE_API_KEY
    });
  }
  return cohere;
}

export class EmbeddingService {
  /**
   * Generate embedding for text using Cohere
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    try {
      const client = getCohereClient();
      const response = await client.embed({
        texts: [text],
        model: 'embed-english-v3.0',
        inputType: 'search_document'
      });
      
      const embeddings = response.embeddings;
      if (Array.isArray(embeddings) && embeddings.length > 0) {
        return embeddings[0] as number[];
      }
      
      throw new Error('No embeddings returned');
    } catch (error: any) {
      console.error('Embedding generation error:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  /**
   * Generate query embedding
   */
  static async generateQueryEmbedding(query: string): Promise<number[]> {
    try {
      const client = getCohereClient();
      const response = await client.embed({
        texts: [query],
        model: 'embed-english-v3.0',
        inputType: 'search_query'
      });
      
      const embeddings = response.embeddings;
      if (Array.isArray(embeddings) && embeddings.length > 0) {
        return embeddings[0] as number[];
      }
      
      throw new Error('No embeddings returned');
    } catch (error: any) {
      console.error('Query embedding error:', error);
      throw new Error('Failed to generate query embedding');
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  static cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    
    return dotProduct / (magnitudeA * magnitudeB);
  }
}
