import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { jwtMiddleware } from '../middlewares/jwt.middleware';

const router: Router = Router();

router.route('/login').post(authController.login);
router.route('/logout').post(jwtMiddleware, authController.logout);

export const authRouter: Router = router;
