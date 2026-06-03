import path from 'path';
import fs from 'fs';
import config from '../config/config';
import { UPLOADS_ROOT } from '../config/multer.config';

const getPublicUrl = (relativePath: string): string =>
  `${config.appUrl}/uploads/${relativePath}`;

/**
 * Moves temp person images to uploads/images/<personId>/
 * Returns the public URLs of the moved files.
 */
const movePersonImages = (
  files: Express.Multer.File[],
  personId: string,
): string[] => {
  const personDir = path.join(UPLOADS_ROOT, 'images', personId);
  if (!fs.existsSync(personDir)) fs.mkdirSync(personDir, { recursive: true });

  return files.map((file) => {
    const dest = path.join(personDir, file.filename);
    fs.renameSync(file.path, dest);
    return getPublicUrl(`images/${personId}/${file.filename}`);
  });
};

export const uploadService = { getPublicUrl, movePersonImages };
