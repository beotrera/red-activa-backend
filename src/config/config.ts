export default {
  logger: {
    level: process.env.LOG_LEVEL || 'trace',
  },
  env: process.env.ENV?.toUpperCase(),
  databaseUrl: process.env.DATABASE_URL,
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/red-activa',
  port: parseInt(process.env.PORT) || 3000,
  connectionPool: parseInt(process.env.CONNECTION_POOL) || 5,
  jwt: {
    secret: process.env.JWT_SECRET || 'changeme_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },
  buckets: {
    pdf: process.env.BUCKET_PDF || 'pdf',
    image: process.env.BUCKET_IMAGE || 'image',
  },
};
