"use strict";
// import { Request, Response } from 'express';
// import Form from '../models/Form';
// import { AIService } from '../services/ai.service';
// import { MemoryService } from '../services/memory.service';
// import { nanoid } from 'nanoid';
// import mongoose from 'mongoose';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormController = void 0;
const Form_1 = __importDefault(require("../models/Form"));
const FormEmbedding_1 = __importDefault(require("../models/FormEmbedding")); // FIX: Add this import
const Submission_1 = __importDefault(require("../models/Submission")); // FIX: Add this import
const ai_service_1 = require("../services/ai.service");
const memory_service_1 = require("../services/memory.service");
const nanoid_1 = require("nanoid");
class FormController {
    /**
     * Generate form from AI prompt
     */
    static async generateForm(req, res) {
        try {
            const { prompt } = req.body;
            const userId = req.user._id;
            if (!prompt || prompt.trim().length === 0) {
                return res.status(400).json({ error: 'Prompt is required' });
            }
            // Generate schema using AI with context awareness
            const schema = await ai_service_1.AIService.generateFormSchema(userId, prompt);
            // Create shareable link
            const shareableLink = (0, nanoid_1.nanoid)(10);
            // Save form to database
            const form = await Form_1.default.create({
                userId,
                title: schema.title,
                description: schema.description || '',
                purpose: schema.purpose || 'general',
                schema: schema.fields,
                shareableLink,
                isPublic: true
            });
            // Store embedding for future context retrieval
            await memory_service_1.MemoryService.storeFormEmbedding(form._id, userId, form.title, form.purpose, form.schema);
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
        }
        catch (error) {
            console.error('Form generation error:', error);
            res.status(500).json({ error: error.message || 'Failed to generate form' });
        }
    }
    /**
     * Get all user forms
     */
    static async getUserForms(req, res) {
        try {
            const userId = req.user._id;
            const forms = await Form_1.default.find({ userId })
                .sort({ createdAt: -1 })
                .select('-__v');
            res.json({
                success: true,
                forms
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Get single form by ID (authenticated)
     */
    static async getFormById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user._id;
            const form = await Form_1.default.findOne({ _id: id, userId });
            if (!form) {
                return res.status(404).json({ error: 'Form not found' });
            }
            res.json({
                success: true,
                form
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Get form by shareable link (public)
     */
    static async getFormByLink(req, res) {
        try {
            const { link } = req.params;
            const form = await Form_1.default.findOne({ shareableLink: link, isPublic: true })
                .select('-userId -__v');
            if (!form) {
                return res.status(404).json({ error: 'Form not found' });
            }
            res.json({
                success: true,
                form
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Delete form
     */
    static async deleteForm(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user._id;
            const form = await Form_1.default.findOneAndDelete({ _id: id, userId });
            if (!form) {
                return res.status(404).json({ error: 'Form not found' });
            }
            // Also delete embedding
            await FormEmbedding_1.default.deleteOne({ formId: id });
            res.json({
                success: true,
                message: 'Form deleted successfully'
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Get form analytics
     */
    static async getFormAnalytics(req, res) {
        try {
            const userId = req.user._id;
            const forms = await Form_1.default.find({ userId }).lean();
            const submissions = await Submission_1.default.find({
                formId: { $in: forms.map(f => f._id) }
            }).lean();
            // Calculate analytics - FIX: Add explicit types
            const analytics = {
                totalForms: forms.length,
                totalSubmissions: submissions.length,
                avgSubmissionsPerForm: forms.length > 0
                    ? Math.round(submissions.length / forms.length * 10) / 10
                    : 0,
                mostPopularForm: forms.reduce((max, form) => form.submissionCount > (max?.submissionCount || 0) ? form : max, forms[0]),
                recentActivity: submissions
                    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                    .slice(0, 5),
                formsByPurpose: forms.reduce((acc, form) => {
                    acc[form.purpose] = (acc[form.purpose] || 0) + 1;
                    return acc;
                }, {})
            };
            res.json({ success: true, analytics });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.FormController = FormController;
