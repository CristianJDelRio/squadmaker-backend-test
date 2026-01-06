import { JokeRepository } from '../domain/repositories/JokeRepository';
import { Joke } from '../domain/entities/Joke';
import { NotFoundError } from '../../shared/domain/errors/NotFoundError';

export class GetJoke {
  constructor(private readonly jokeRepository: JokeRepository) {}

  async execute(id: string): Promise<Joke> {
    const joke = await this.jokeRepository.findById(id);

    if (!joke) {
      throw new NotFoundError(`Joke with id ${id} not found`);
    }

    return joke;
  }
}
