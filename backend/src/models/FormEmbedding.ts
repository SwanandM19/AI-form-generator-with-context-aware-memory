import mongoose, { Document, Schema } from 'mongoose';

export interface IFormEmbedding extends Document {
  formId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  embedding: number[]; // Vector representation
  metadata: {
    title: string;
    purpose: string;
    fieldTypes: string[];
    fieldCount: number;
    hasFileUpload: boolean;
  };
  createdAt: Date;
}

const FormEmbeddingSchema = new Schema<IFormEmbedding>({
  formId: {
    type: Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
    unique: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  embedding: {
    type: [Number],
    required: true
  },
  metadata: {
    title: String,
    purpose: String,
    fieldTypes: [String],
    fieldCount: Number,
    hasFileUpload: Boolean
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient retrieval
FormEmbeddingSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IFormEmbedding>('FormEmbedding', FormEmbeddingSchema);
