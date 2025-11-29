import FormEmbedding, { IFormEmbedding } from '../models/FormEmbedding';
import Form from '../models/Form';
import { EmbeddingService } from './embedding.service';
import mongoose from 'mongoose';

export class MemoryService {
  /**
   * Store form embedding for future retrieval
   */
  static async storeFormEmbedding(
    formId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    title: string,
    purpose: string,
    schema: any[]
  ): Promise<void> {
    try {
      // Create text representation of form
      const formText = `${title}. ${purpose}. Fields: ${schema.map(f => f.label).join(', ')}`;
      
      // Generate embedding
      const embedding = await EmbeddingService.generateEmbedding(formText);
      
      // Extract metadata
      const metadata = {
        title,
        purpose,
        fieldTypes: schema.map(f => f.type),
        fieldCount: schema.length,
        hasFileUpload: schema.some(f => f.type === 'file')
      };
      
      // Store in database
      await FormEmbedding.create({
        formId,
        userId,
        embedding,
        metadata
      });
      
      console.log(`Stored embedding for form ${formId}`);
    } catch (error) {
      console.error('Error storing form embedding:', error);
      throw error;
    }
  }

  /**
   * Retrieve top-K relevant forms based on semantic similarity
   */
  static async retrieveRelevantForms(
    userId: mongoose.Types.ObjectId,
    query: string,
    topK: number = 5
  ): Promise<any[]> {
    try {
      // Generate query embedding
      const queryEmbedding = await EmbeddingService.generateQueryEmbedding(query);
      
      // Get all user's form embeddings
      const userEmbeddings = await FormEmbedding.find({ userId }).lean();
      
      if (userEmbeddings.length === 0) {
        return [];
      }
      
      // Calculate similarity scores
      const similarities = userEmbeddings.map(formEmb => ({
        formId: formEmb.formId,
        similarity: EmbeddingService.cosineSimilarity(queryEmbedding, formEmb.embedding),
        metadata: formEmb.metadata
      }));
      
      // Sort by similarity (descending) and take top-K
      const topForms = similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
      
      // Fetch full form schemas
      const formIds = topForms.map(f => f.formId);
      const forms = await Form.find({ _id: { $in: formIds } }).lean();
      
      // Map forms with similarity scores
      return topForms.map(tf => {
        const form = forms.find(f => f._id.toString() === tf.formId.toString());
        return {
          formId: tf.formId,
          similarity: tf.similarity,
          metadata: tf.metadata,
          schema: form?.schema || [],
          title: form?.title,
          purpose: form?.purpose
        };
      });
    } catch (error) {
      console.error('Error retrieving relevant forms:', error);
      throw error;
    }
  }

  /**
   * Build context prompt from relevant forms
   */
  static buildContextPrompt(relevantForms: any[]): string {
    if (relevantForms.length === 0) {
      return '';
    }
    
    const context = relevantForms.map(form => ({
      purpose: form.purpose,
      title: form.title,
      fields: form.schema.map((f: any) => ({
        label: f.label,
        type: f.type,
        required: f.required
      }))
    }));
    
    return `\n\nHere is relevant user form history for reference:\n${JSON.stringify(context, null, 2)}`;
  }
}
