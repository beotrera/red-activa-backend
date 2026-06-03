import { Request, Response, NextFunction } from 'express';
import { WSresponse, CustomError } from '../lib';
import { ApiError } from '../enums';
import { institutionService } from '../services/institution.service';

const findNearby = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { longitude, latitude, maxDistance } = req.query as Record<string, string>;

    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);

    if (isNaN(lng) || isNaN(lat)) throw new CustomError(ApiError.Generic.generic);

    const institution = await institutionService.findNearby({
      longitude: lng,
      latitude: lat,
      maxDistance: maxDistance ? parseInt(maxDistance) : undefined,
    });
    res.send(new WSresponse(true, institution));
  } catch (err) {
    next(err);
  }
};

export const institutionController = { findNearby };
