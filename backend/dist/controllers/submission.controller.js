"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionController = void 0;
const Submission_1 = __importDefault(require("../models/Submission"));
const Form_1 = __importDefault(require("../models/Form"));
class SubmissionController {
    /**
     * Submit form response (public endpoint)
     */
    static async submitForm(req, res) {
        try {
            const { link } = req.params;
            const { responses } = req.body;
            // Find form by shareable link
            const form = await Form_1.default.findOne({ shareableLink: link, isPublic: true });
            if (!form) {
                return res.status(404).json({ error: 'Form not found' });
            }
            // Validate responses against schema
            const errors = [];
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
            const submission = await Submission_1.default.create({
                formId: form._id,
                responses,
                ipAddress: req.ip
            });
            // Increment submission count
            await Form_1.default.findByIdAndUpdate(form._id, { $inc: { submissionCount: 1 } });
            res.status(201).json({
                success: true,
                message: 'Form submitted successfully',
                submissionId: submission._id
            });
        }
        catch (error) {
            console.error('Submission error:', error);
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Get all submissions for a form (authenticated)
     */
    static async getFormSubmissions(req, res) {
        try {
            const { formId } = req.params;
            const userId = req.user._id;
            // Verify user owns the form
            const form = await Form_1.default.findOne({ _id: formId, userId });
            if (!form) {
                return res.status(404).json({ error: 'Form not found' });
            }
            // Get submissions
            const submissions = await Submission_1.default.find({ formId })
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
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Get all submissions grouped by form (dashboard)
     */
    static async getAllUserSubmissions(req, res) {
        try {
            const userId = req.user._id;
            // Get all user forms
            const forms = await Form_1.default.find({ userId }).select('_id title submissionCount');
            // Get submissions for each form
            const formIds = forms.map(f => f._id);
            const submissions = await Submission_1.default.find({ formId: { $in: formIds } })
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
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.SubmissionController = SubmissionController;
