import { Router } from 'express';
import { institutionController } from '../controllers/institution.controller';
import { jwtMiddleware } from '../middlewares/jwt.middleware';

const router: Router = Router();

router.use(jwtMiddleware);

router.route('/nearby').get(institutionController.findNearby);

export const institutionRouter: Router = router;
