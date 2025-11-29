import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/', upload.single('image'), UploadController.uploadImage);
router.delete('/', UploadController.deleteImage);

export default router;
