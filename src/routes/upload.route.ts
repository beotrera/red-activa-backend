import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { jwtMiddleware } from '../middlewares/jwt.middleware';
import { upload } from '../config/multer.config';

const router: Router = Router();

router.use(jwtMiddleware);

router.route('/').post(upload.single('image'), uploadController.uploadImage);

export const uploadRouter: Router = router;
