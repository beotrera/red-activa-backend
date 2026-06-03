import { Router } from 'express';
import { healthRouter } from './health.route';
import { authRouter } from './auth.route';
import { institutionRouter } from './institution.route';
import { personRouter } from './person.route';
import { uploadRouter } from './upload.route';

const router: Router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/institutions', institutionRouter);
router.use('/persons', personRouter);
router.use('/upload', uploadRouter);

export const routes: Router = router;
