import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  formId: mongoose.Types.ObjectId;
  responses: Record<string, any>; // Flexible key-value pairs
  submittedAt: Date;
  ipAddress?: string;
}

const SubmissionSchema = new Schema<ISubmission>({
  formId: {
    type: Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
    index: true
  },
  responses: {
    type: Schema.Types.Mixed,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: String
});

// Index for faster queries
SubmissionSchema.index({ formId: 1, submittedAt: -1 });

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
