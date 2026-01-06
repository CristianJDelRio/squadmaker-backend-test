/**
 * Jest Setup File
 *
 * This file is loaded once before all tests run.
 * It handles environment variable loading for the test environment.
 *
 * In CI: Uses environment variables from docker-compose
 * Locally: Loads from .env.test file
 */

import * as path from 'path';

if (process.env.CI !== 'true') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dotenv = require('dotenv');
  dotenv.config({
    path: path.resolve(__dirname, '../.env.test'),
    override: true,
  });
}
