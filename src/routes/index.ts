import { Router } from 'express';
import { healthRouter } from './health.route';
import { authRouter } from './auth.route';
import { institutionRouter } from './institution.route';
import { personRouter } from './person.route';
import { uploadRouter } from './upload.route';
import { reportRouter } from './report.route';

const router: Router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/institutions', institutionRouter);
router.use('/persons', personRouter);
router.use('/upload', uploadRouter);
router.use('/reports', reportRouter);

export const routes: Router = router;
