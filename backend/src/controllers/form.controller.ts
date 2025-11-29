
// import { Request, Response } from 'express';
// import Form from '../models/Form';
// import FormEmbedding from '../models/FormEmbedding'; // FIX: Add this import
// import Submission from '../models/Submission'; // FIX: Add this import
// import { AIService } from '../services/ai.service';
// import { MemoryService } from '../services/memory.service';
// import mongoose from 'mongoose';

// export class FormController {
//   /**
//    * Generate form from AI prompt
//    */
//   static async generateForm(req: Request, res: Response) {
//     try {
//       const { prompt } = req.body;
//       const userId = req.user!._id;
      
//       if (!prompt || prompt.trim().length === 0) {
//         return res.status(400).json({ error: 'Prompt is required' });
//       }
      
//       // Generate schema using AI with context awareness
//       const schema = await AIService.generateFormSchema(userId, prompt);
      
//       // Create shareable link using dynamic import for nanoid (ESM module)
//       const { nanoid } = await import('nanoid');
//       const shareableLink = nanoid(10);
      
//       // Save form to database
//       const form = await Form.create({
//         userId,
//         title: schema.title,
//         description: schema.description || '',
//         purpose: schema.purpose || 'general',
//         schema: schema.fields,
//         shareableLink,
//         isPublic: true
//       });
      
//       // Store embedding for future context retrieval
//       await MemoryService.storeFormEmbedding(
//         form._id,
//         userId,
//         form.title,
//         form.purpose,
//         form.schema
//       );
      
//       res.status(201).json({
//         success: true,
//         form: {
//           id: form._id,
//           title: form.title,
//           description: form.description,
//           shareableLink: form.shareableLink,
//           schema: form.schema
//         }
//       });
//     } catch (error: any) {
//       console.error('Form generation error:', error);
//       res.status(500).json({ error: error.message || 'Failed to generate form' });
//     }
//   }

//   /**
//    * Get all user forms
//    */
//   static async getUserForms(req: Request, res: Response) {
//     try {
//       const userId = req.user!._id;
      
//       const forms = await Form.find({ userId })
//         .sort({ createdAt: -1 })
//         .select('-__v');
      
//       res.json({
//         success: true,
//         forms
//       });
//     } catch (error: any) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   /**
//    * Get single form by ID (authenticated)
//    */
//   static async getFormById(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       const userId = req.user!._id;
      
//       const form = await Form.findOne({ _id: id, userId });
      
//       if (!form) {
//         return res.status(404).json({ error: 'Form not found' });
//       }
      
//       res.json({
//         success: true,
//         form
//       });
//     } catch (error: any) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   /**
//    * Get form by shareable link (public)
//    */
//   static async getFormByLink(req: Request, res: Response) {
//     try {
//       const { link } = req.params;
      
//       const form = await Form.findOne({ shareableLink: link, isPublic: true })
//         .select('-userId -__v');
      
//       if (!form) {
//         return res.status(404).json({ error: 'Form not found' });
//       }
      
//       res.json({
//         success: true,
//         form
//       });
//     } catch (error: any) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   /**
//    * Delete form
//    */
//   static async deleteForm(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       const userId = req.user!._id;
      
//       const form = await Form.findOneAndDelete({ _id: id, userId });
      
//       if (!form) {
//         return res.status(404).json({ error: 'Form not found' });
//       }
      
//       // Also delete embedding
//       await FormEmbedding.deleteOne({ formId: id });
      
//       res.json({
//         success: true,
//         message: 'Form deleted successfully'
//       });
//     } catch (error: any) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   /**
//    * Get form analytics
//    */
//   static async getFormAnalytics(req: Request, res: Response) {
//     try {
//       const userId = req.user!._id;
      
//       const forms = await Form.find({ userId }).lean();
//       const submissions = await Submission.find({
//         formId: { $in: forms.map(f => f._id) }
//       }).lean();
      
//       // Calculate analytics - FIX: Add explicit types
//       const analytics = {
//         totalForms: forms.length,
//         totalSubmissions: submissions.length,
//         avgSubmissionsPerForm: forms.length > 0 
//           ? Math.round(submissions.length / forms.length * 10) / 10
//           : 0,
//         mostPopularForm: forms.reduce((max, form) => 
//           form.submissionCount > (max?.submissionCount || 0) ? form : max,
//           forms[0]
//         ),
//         recentActivity: submissions
//           .sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
//           .slice(0, 5),
//         formsByPurpose: forms.reduce((acc, form) => {
//           acc[form.purpose] = (acc[form.purpose] || 0) + 1;
//           return acc;
//         }, {} as Record<string, number>)
//       };
      
//       res.json({ success: true, analytics });
//     } catch (error: any) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }


import { Request, Response } from 'express';
import Form from '../models/Form';
import FormEmbedding from '../models/FormEmbedding';
import Submission from '../models/Submission';
import { AIService } from '../services/ai.service';
import { MemoryService } from '../services/memory.service';
import mongoose from 'mongoose';

// Helper function to generate random ID
function generateRandomId(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export class FormController {
  /**
   * Generate form from AI prompt
   */
  static async generateForm(req: Request, res: Response) {
    try {
      const { prompt } = req.body;
      const userId = req.user!._id;
      
      if (!prompt || prompt.trim().length === 0) {
        return res.status(400).json({ error: 'Prompt is required' });
      }
      
      // Generate schema using AI with context awareness
      const schema = await AIService.generateFormSchema(userId, prompt);
      
      // Create shareable link - FIX: Use simple random ID generator
      const shareableLink = generateRandomId(10);
      
      // Save form to database
      const form = await Form.create({
        userId,
        title: schema.title,
        description: schema.description || '',
        purpose: schema.purpose || 'general',
        schema: schema.fields,
        shareableLink,
        isPublic: true
      });
      
      // Store embedding for future context retrieval
      await MemoryService.storeFormEmbedding(
        form._id,
        userId,
        form.title,
        form.purpose,
        form.schema
      );
      
      res.status(201).json({
        success: true,
        form: {
          id: form._id,
          title: form.title,
          description: form.description,
          shareableLink: form.shareableLink,
          schema: form.schema
        }
      });
    } catch (error: any) {
      console.error('Form generation error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate form' });
    }
  }

  /**
   * Get all user forms
   */
  static async getUserForms(req: Request, res: Response) {
    try {
      const userId = req.user!._id;
      
      const forms = await Form.find({ userId })
        .sort({ createdAt: -1 })
        .select('-__v');
      
      res.json({
        success: true,
        forms
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get single form by ID (authenticated)
   */
  static async getFormById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!._id;
      
      const form = await Form.findOne({ _id: id, userId });
      
      if (!form) {
        return res.status(404).json({ error: 'Form not found' });
      }
      
      res.json({
        success: true,
        form
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get form by shareable link (public)
   */
  static async getFormByLink(req: Request, res: Response) {
    try {
      const { link } = req.params;
      
      const form = await Form.findOne({ shareableLink: link, isPublic: true })
        .select('-userId -__v');
      
      if (!form) {
        return res.status(404).json({ error: 'Form not found' });
      }
      
      res.json({
        success: true,
        form
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Delete form
   */
  static async deleteForm(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!._id;
      
      const form = await Form.findOneAndDelete({ _id: id, userId });
      
      if (!form) {
        return res.status(404).json({ error: 'Form not found' });
      }
      
      // Also delete embedding
      await FormEmbedding.deleteOne({ formId: id });
      
      res.json({
        success: true,
        message: 'Form deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get form analytics
   */
  static async getFormAnalytics(req: Request, res: Response) {
    try {
      const userId = req.user!._id;
      
      const forms = await Form.find({ userId }).lean();
      const submissions = await Submission.find({
        formId: { $in: forms.map(f => f._id) }
      }).lean();
      
      // Calculate analytics
      const analytics = {
        totalForms: forms.length,
        totalSubmissions: submissions.length,
        avgSubmissionsPerForm: forms.length > 0 
          ? Math.round(submissions.length / forms.length * 10) / 10
          : 0,
        mostPopularForm: forms.reduce((max, form) => 
          form.submissionCount > (max?.submissionCount || 0) ? form : max,
          forms[0]
        ),
        recentActivity: submissions
          .sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
          .slice(0, 5),
        formsByPurpose: forms.reduce((acc, form) => {
          acc[form.purpose] = (acc[form.purpose] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
      
      res.json({ success: true, analytics });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
