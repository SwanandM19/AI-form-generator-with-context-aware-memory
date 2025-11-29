import { Router } from 'express';
import { SubmissionController } from '../controllers/submission.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public route - submit form
router.post('/:link', SubmissionController.submitForm);

// Protected routes - view submissions
router.get('/form/:formId', authenticate, SubmissionController.getFormSubmissions);
router.get('/all', authenticate, SubmissionController.getAllUserSubmissions);

export default router;
