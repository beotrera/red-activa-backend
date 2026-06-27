import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

export const UPLOADS_ROOT = path.join(process.cwd(), 'uploads');
export const IMAGES_TEMP_DIR = path.join(UPLOADS_ROOT, 'images', 'temp');

// Ensure required folders exist at startup
const ensureDir = (dir: string) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

ensureDir(UPLOADS_ROOT);
ensureDir(IMAGES_TEMP_DIR);
ensureDir(path.join(UPLOADS_ROOT, 'images'));
ensureDir(path.join(UPLOADS_ROOT, 'avatar'));

const imageFileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowed = /jpeg|jpg|png|webp/;
  const valid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
  valid ? cb(null, true) : cb(new Error('Only JPEG, PNG and WEBP images are allowed'));
};

const audioFileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowed = /mp3|mpeg|wav|m4a|ogg|webm|opus/;
  const valid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
  valid ? cb(null, true) : cb(new Error('Only MP3, WAV, M4A, OGG, WEBM and OPUS audio files are allowed'));
};

// Generic single-image upload (for other endpoints)
const singleStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_ROOT),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`);
  },
});

// Person images — saved to temp first, then moved after person ID is known
const personImagesStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, IMAGES_TEMP_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`);
  },
});

export const upload = multer({
  storage: singleStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadPersonImages = multer({
  storage: personImagesStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
});

// Person audio — kept in memory only; persisted as a Buffer on the Person document
export const uploadPersonAudio = multer({
  storage: multer.memoryStorage(),
  fileFilter: audioFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});
