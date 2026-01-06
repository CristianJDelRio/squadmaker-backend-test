import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://squadmakers_user:squadmakers_password@localhost:5432/squadmakers_db?schema=public',
  chuckNorrisApiUrl:
    process.env.CHUCK_NORRIS_API_URL || 'https://api.chucknorris.io',
  dadJokesApiUrl: process.env.DAD_JOKES_API_URL || 'https://icanhazdadjoke.com',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
};
