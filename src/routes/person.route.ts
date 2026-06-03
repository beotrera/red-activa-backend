import { Router } from 'express';
import { personController } from '../controllers/person.controller';
import { jwtMiddleware } from '../middlewares/jwt.middleware';
import { uploadPersonImages } from '../config/multer.config';

const router: Router = Router();

router.use(jwtMiddleware);

router.route('/').get(personController.findAll).post(uploadPersonImages.array('images', 10), personController.create);
router.route('/:id').get(personController.findById).put(personController.update).delete(personController.remove);
router.route('/:id/photos').post(uploadPersonImages.array('images', 10), personController.addPhotos);

export const personRouter: Router = router;
