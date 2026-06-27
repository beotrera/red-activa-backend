import mongoose from 'mongoose';
import { PersonAudioModel } from '../models/person-audio.model';
import { personService } from './person.service';
import { CustomError } from '../lib';
import { ApiError } from '../enums';

const setAudio = async (personId: string, data: Buffer, mimeType: string) => {
  const personExists = await personService.exists(personId);
  if (!personExists) throw new CustomError(ApiError.Person.notFound);

  await PersonAudioModel.findOneAndUpdate(
    { person: new mongoose.Types.ObjectId(personId) },
    { data, mimeType, uploadedAt: new Date() },
    { new: true, upsert: true },
  );

  return personService.findById(personId);
};

const getAudio = async (personId: string) => {
  const audio = await PersonAudioModel.findOne({ person: new mongoose.Types.ObjectId(personId) });
  if (!audio) throw new CustomError(ApiError.Person.audioNotFound);
  return audio;
};

export const personAudioService = { setAudio, getAudio };
