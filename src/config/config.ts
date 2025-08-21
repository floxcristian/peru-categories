import { registerAs } from '@nestjs/config';

export const loadConfig = registerAs('config', () => ({
  api: {
    port: parseInt(process.env.PORT ?? '3000', 10),
    lang: process.env.DEFAULT_LANG,
  },
  database: {
    mongoUriEcommerce: process.env.MONGO_URI_ECOMMERCE,
    mongoDebug: process.env.MONGO_DEBUG === 'true',
    mongoDebugIndent: process.env.MONGO_DEBUG_INDENT === 'true',
  },
}));
