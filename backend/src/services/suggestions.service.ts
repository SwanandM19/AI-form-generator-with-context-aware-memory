import FormEmbedding from '../models/FormEmbedding';
import { EmbeddingService } from './embedding.service';

export class SuggestionsService {
  /**
   * Get AI-powered field suggestions based on form purpose
   */
  static async getSuggestedFields(purpose: string): Promise<string[]> {
    const commonFields: Record<string, string[]> = {
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
  static async suggestNextForm(userId: string): Promise<string> {
    const embeddings = await FormEmbedding.find({ userId })
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
    } else if (hasSurveys && !hasJobForms) {
      return "You've created surveys. Try an 'Internship application form'";
    } else {
      return "Consider creating an 'Event registration form' or 'Contact form'";
    }
  }
}
