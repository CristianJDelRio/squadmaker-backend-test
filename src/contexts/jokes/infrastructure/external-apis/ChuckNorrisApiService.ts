import axios from 'axios';
import { ZodError } from 'zod';
import { env } from '../../../../shared/infrastructure/config/env';
import { ChuckNorrisJokeSchema } from './dto/ChuckNorrisJokeDto';

export class ChuckNorrisApiService {
  private readonly apiUrl = `${env.chuckNorrisApiUrl}/jokes/random`;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  async getRandomJoke(): Promise<string> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await axios.get(this.apiUrl);

        const validatedData = ChuckNorrisJokeSchema.parse(response.data);

        return validatedData.value;
      } catch (error) {
        if (error instanceof ZodError) {
          throw new Error('Invalid response from Chuck Norris API');
        }

        if (attempt === this.maxRetries) {
          break;
        }

        await this.delay(this.retryDelay * attempt);
      }
    }

    throw new Error(
      `Failed to fetch joke from Chuck Norris API after ${this.maxRetries} attempts`
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
