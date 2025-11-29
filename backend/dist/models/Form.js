"use strict";
// import mongoose, { Document, Schema } from 'mongoose';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
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
const mongoose_1 = __importStar(require("mongoose"));
const FormSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('Form', FormSchema);
