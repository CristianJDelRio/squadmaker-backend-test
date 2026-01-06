import { ValidationError } from '../../../shared/domain/errors/ValidationError';
import { ChuckNorrisApiService } from '../../infrastructure/external-apis/ChuckNorrisApiService';
import { DadJokesApiService } from '../../infrastructure/external-apis/DadJokesApiService';

export class FetchExternalJoke {
  constructor(
    private readonly chuckNorrisService: ChuckNorrisApiService,
    private readonly dadJokesService: DadJokesApiService
  ) {}

  async execute(type: string): Promise<string> {
    const normalizedType = type.toLowerCase();

    if (normalizedType === 'chuck') {
      return await this.chuckNorrisService.getRandomJoke();
    }

    if (normalizedType === 'dad') {
      return await this.dadJokesService.getRandomJoke();
    }

    throw new ValidationError('Invalid joke type. Must be "Chuck" or "Dad"');
  }
}
