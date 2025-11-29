// import { Router } from 'express';
// import { AuthController } from '../controllers/auth.controller';
// import { authenticate } from '../middleware/auth.middleware';

// const router = Router();

// router.post('/signup', AuthController.signup);
// router.post('/login', AuthController.login);
// router.get('/me', authenticate, AuthController.getMe);

// export default router;
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Handle OPTIONS preflight for CORS
router.options('/signup', (req, res) => {
  res.status(200).end();
});

router.options('/login', (req, res) => {
  res.status(200).end();
});

router.options('/me', (req, res) => {
  res.status(200).end();
});

// Actual routes
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.get('/me', authenticate, AuthController.getMe);

export default router;
