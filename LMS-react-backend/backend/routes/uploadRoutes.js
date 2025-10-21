import express from 'express';
import { upload, uploadFileToR2 } from '../controllers/uploadController.js';

const router = express.Router();
router.post('/upload/file', upload.single('file'), uploadFileToR2);
export default router;
