import { Router } from 'express';
import { FormController } from '../controllers/form.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected routes
router.post('/generate', authenticate, FormController.generateForm);
router.get('/my-forms', authenticate, FormController.getUserForms);
router.get('/:id', authenticate, FormController.getFormById);
router.delete('/:id', authenticate, FormController.deleteForm);

// Public route
router.get('/public/:link', FormController.getFormByLink);

export default router;
