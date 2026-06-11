import mongoose from 'mongoose';
import { SimilarityMatchModel } from '../models/similarity-match.model';
import { SimilarityResult } from './similarity.service';

const SCORE_THRESHOLD = 0.70;

const saveMany = async (personId: string, results: SimilarityResult[]): Promise<void> => {
  const above = results.filter((r) => r.score >= SCORE_THRESHOLD);
  if (above.length === 0) return;

  const docs = above.map((r) => ({
    person: new mongoose.Types.ObjectId(personId),
    report: new mongoose.Types.ObjectId(r.personId),
    score: r.score,
    matches: r.matches,
  }));

  await SimilarityMatchModel.insertMany(docs);
};

const findByPerson = async (personId: string) => {
  return SimilarityMatchModel.find({ person: new mongoose.Types.ObjectId(personId) })
    .populate('report')
    .sort({ score: -1 });
};

const findByReport = async (reportId: string) => {
  return SimilarityMatchModel.find({ report: new mongoose.Types.ObjectId(reportId) })
    .populate('person', 'estimatedAge gender distinctiveFeatures status location dateOfAdmission identifyingPhotos')
    .sort({ score: -1 });
};

export const similarityMatchService = { saveMany, findByPerson, findByReport };
