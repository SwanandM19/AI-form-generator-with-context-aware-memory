// import mongoose, { Document, Schema } from 'mongoose';

// export interface IFormField {
//   id: string;
//   type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'date';
//   label: string;
//   placeholder?: string;
//   required?: boolean;
//   options?: string[]; // For select, radio, checkbox
//   validation?: {
//     min?: number;
//     max?: number;
//     pattern?: string;
//     message?: string;
//   };
//   accept?: string; // For file type (e.g., "image/*")
// }

// export interface IForm extends Document {
//   userId: mongoose.Types.ObjectId;
//   title: string;
//   description: string;
//   purpose: string; // For semantic search (e.g., "job application", "survey")
//   schema: IFormField[];
//   isPublic: boolean;
//   shareableLink: string;
//   submissionCount: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const FormSchema = new Schema<IForm>({
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true
//   },
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   purpose: {
//     type: String,
//     required: true,
//     index: true // For filtering
//   },
//   schema: [{
//     id: String,
//     type: {
//       type: String,
//       enum: ['text', 'email', 'number', 'textarea', 'select', 'radio', 'checkbox', 'file', 'date']
//     },
//     label: String,
//     placeholder: String,
//     required: Boolean,
//     options: [String],
//     validation: {
//       min: Number,
//       max: Number,
//       pattern: String,
//       message: String
//     },
//     accept: String
//   }],
//   isPublic: {
//     type: Boolean,
//     default: true
//   },
//   shareableLink: {
//     type: String,
//     unique: true,
//     required: true
//   },
//   submissionCount: {
//     type: Number,
//     default: 0
//   }
// }, {
//   timestamps: true
// });

// // Index for faster queries
// FormSchema.index({ userId: 1, createdAt: -1 });

// export default mongoose.model<IForm>('Form', FormSchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface IFormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'date';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  accept?: string; // For file type (e.g., "image/*")
}

// FIX: Use Omit to exclude 'schema' from Document to avoid conflict
export interface IForm extends Omit<Document, 'schema'> {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  purpose: string;
  schema: IFormField[]; // Keep this name for database
  isPublic: boolean;
  shareableLink: string;
  submissionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const FormSchema = new Schema<IForm>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  purpose: {
    type: String,
    required: true,
    index: true
  },
  schema: [{
    id: String,
    type: {
      type: String,
      enum: ['text', 'email', 'number', 'textarea', 'select', 'radio', 'checkbox', 'file', 'date']
    },
    label: String,
    placeholder: String,
    required: Boolean,
    options: [String],
    validation: {
      min: Number,
      max: Number,
      pattern: String,
      message: String
    },
    accept: String
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  shareableLink: {
    type: String,
    unique: true,
    required: true
  },
  submissionCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
FormSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IForm>('Form', FormSchema);
