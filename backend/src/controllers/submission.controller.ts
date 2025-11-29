import { Request, Response } from 'express';
import Submission from '../models/Submission';
import Form from '../models/Form';
import mongoose from 'mongoose';

export class SubmissionController {
  /**
   * Submit form response (public endpoint)
   */
  static async submitForm(req: Request, res: Response) {
    try {
      const { link } = req.params;
      const { responses } = req.body;
      
      // Find form by shareable link
      const form = await Form.findOne({ shareableLink: link, isPublic: true });
      
      if (!form) {
        return res.status(404).json({ error: 'Form not found' });
      }
      
      // Validate responses against schema
      const errors: string[] = [];
      
      form.schema.forEach(field => {
        const value = responses[field.id];
        
        // Check required fields
        if (field.required && (!value || value === '')) {
          errors.push(`${field.label} is required`);
        }
        
        // Validate email format
        if (field.type === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(`${field.label} must be a valid email`);
          }
        }
        
        // Validate number type
        if (field.type === 'number' && value) {
          if (isNaN(Number(value))) {
            errors.push(`${field.label} must be a number`);
          }
          
          // Check min/max
          if (field.validation?.min && Number(value) < field.validation.min) {
            errors.push(`${field.label} must be at least ${field.validation.min}`);
          }
          if (field.validation?.max && Number(value) > field.validation.max) {
            errors.push(`${field.label} must be at most ${field.validation.max}`);
          }
        }
        
        // Validate text length
        if ((field.type === 'text' || field.type === 'textarea') && value) {
          if (field.validation?.min && value.length < field.validation.min) {
            errors.push(`${field.label} must be at least ${field.validation.min} characters`);
          }
          if (field.validation?.max && value.length > field.validation.max) {
            errors.push(`${field.label} must be at most ${field.validation.max} characters`);
          }
        }
      });
      
      if (errors.length > 0) {
        return res.status(400).json({ error: 'Validation failed', errors });
      }
      
      // Create submission
      const submission = await Submission.create({
        formId: form._id,
        responses,
        ipAddress: req.ip
      });
      
      // Increment submission count
      await Form.findByIdAndUpdate(form._id, { $inc: { submissionCount: 1 } });
      
      res.status(201).json({
        success: true,
        message: 'Form submitted successfully',
        submissionId: submission._id
      });
    } catch (error: any) {
      console.error('Submission error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all submissions for a form (authenticated)
   */
  static async getFormSubmissions(req: Request, res: Response) {
    try {
      const { formId } = req.params;
      const userId = req.user!._id;
      
      // Verify user owns the form
      const form = await Form.findOne({ _id: formId, userId });
      
      if (!form) {
        return res.status(404).json({ error: 'Form not found' });
      }
      
      // Get submissions
      const submissions = await Submission.find({ formId })
        .sort({ submittedAt: -1 })
        .select('-__v');
      
      res.json({
        success: true,
        form: {
          id: form._id,
          title: form.title,
          submissionCount: form.submissionCount
        },
        submissions
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all submissions grouped by form (dashboard)
   */
  static async getAllUserSubmissions(req: Request, res: Response) {
    try {
      const userId = req.user!._id;
      
      // Get all user forms
      const forms = await Form.find({ userId }).select('_id title submissionCount');
      
      // Get submissions for each form
      const formIds = forms.map(f => f._id);
      const submissions = await Submission.find({ formId: { $in: formIds } })
        .sort({ submittedAt: -1 });
      
      // Group submissions by form
      const grouped = forms.map(form => ({
        formId: form._id,
        formTitle: form.title,
        submissionCount: form.submissionCount,
        submissions: submissions.filter(s => s.formId.toString() === form._id.toString())
      }));
      
      res.json({
        success: true,
        data: grouped
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
