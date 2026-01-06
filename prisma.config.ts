/* eslint-disable @typescript-eslint/no-require-imports */
if (!process.env.CI) {
  require('dotenv/config');
}
/* eslint-enable @typescript-eslint/no-require-imports */

import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
