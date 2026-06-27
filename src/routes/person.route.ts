import { Router, Request, Response, NextFunction } from 'express';
import { personController } from '../controllers/person.controller';
import { jwtMiddleware } from '../middlewares/jwt.middleware';
import { uploadPersonImages, uploadPersonAudio } from '../config/multer.config';
import { similarityMatchService } from '../services/similarity-match.service';
import { similarityService } from '../services/similarity.service';
import { PersonModel } from '../models/person.model';
import { WSresponse } from '../lib';

const router: Router = Router();

router.use(jwtMiddleware);

router
  .route('/')
  .get(personController.findAll)
  .post(uploadPersonImages.array('images', 10), personController.create);

router
  .route('/:id')
  .get(personController.findById)
  .put(personController.update);

router
  .route('/:id/audio')
  .get(personController.getAudio)
  .post(uploadPersonAudio.single('audio'), personController.uploadAudio);

router.get('/:id/similarities', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matches = await similarityMatchService.findByPerson(req.params.id);
    res.send(new WSresponse(true, matches));
  } catch (err) {
    next(err);
  }
});

// Dispara la comparación IA para todos los NNs existentes (uso admin/one-shot)
router.post('/run-similarity-all', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const persons = await PersonModel.find({ deletedAt: null }).lean();
    res.send(new WSresponse(true, { queued: persons.length }));
    // Corre en background sin bloquear la respuesta
    for (const person of persons) {
      await similarityService.findAndSaveMatches(person as any);
    }
  } catch (err) {
    next(err);
  }
});

export const personRouter: Router = router;
