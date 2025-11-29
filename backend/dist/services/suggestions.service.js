"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestionsService = void 0;
const FormEmbedding_1 = __importDefault(require("../models/FormEmbedding"));
class SuggestionsService {
    /**
     * Get AI-powered field suggestions based on form purpose
     */
    static async getSuggestedFields(purpose) {
        const commonFields = {
            'job application': [
                'Full Name',
                'Email Address',
                'Phone Number',
                'Resume Upload',
                'Cover Letter',
                'LinkedIn Profile',
                'Years of Experience',
                'Expected Salary'
            ],
            'survey': [
                'Name (Optional)',
                'Email (Optional)',
                'Age Range',
                'Overall Rating (1-5)',
                'Comments/Feedback',
                'Would you recommend?'
            ],
            'registration': [
                'Full Name',
                'Email Address',
                'Phone Number',
                'Date of Birth',
                'Address',
                'Emergency Contact'
            ],
            'contact': [
                'Name',
                'Email',
                'Phone',
                'Subject',
                'Message'
            ]
        };
        // Return suggested fields for purpose
        for (const [key, fields] of Object.entries(commonFields)) {
            if (purpose.toLowerCase().includes(key)) {
                return fields;
            }
        }
        return ['Name', 'Email', 'Message'];
    }
    /**
     * Analyze user's form history and suggest next form
     */
    static async suggestNextForm(userId) {
        const embeddings = await FormEmbedding_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();
        if (embeddings.length === 0) {
            return "Try creating your first form! For example: 'Create a job application form'";
        }
        // Analyze patterns
        const purposes = embeddings.map(e => e.metadata.purpose);
        const hasJobForms = purposes.some(p => p.includes('job'));
        const hasSurveys = purposes.some(p => p.includes('survey'));
        if (hasJobForms && !hasSurveys) {
            return "You've created job forms. How about a 'Customer feedback survey'?";
        }
        else if (hasSurveys && !hasJobForms) {
            return "You've created surveys. Try an 'Internship application form'";
        }
        else {
            return "Consider creating an 'Event registration form' or 'Contact form'";
        }
    }
}
exports.SuggestionsService = SuggestionsService;
