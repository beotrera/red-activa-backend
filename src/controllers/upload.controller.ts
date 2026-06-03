import { Request, Response, NextFunction } from 'express';
import { WSresponse, CustomError } from '../lib';
import { ApiError } from '../enums';
import { uploadService } from '../services/upload.service';

const uploadImage = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) throw new CustomError(ApiError.Generic.generic);

    const url = uploadService.getPublicUrl(req.file.filename);
    res.status(201).send(new WSresponse(true, { url, filename: req.file.filename }));
  } catch (err) {
    next(err);
  }
};

export const uploadController = { uploadImage };
