import { JokeRepository } from '../domain/repositories/JokeRepository';
import { Joke } from '../domain/entities/Joke';
import { NotFoundError } from '../../shared/domain/errors/NotFoundError';

export interface UpdateJokeRequest {
  id: string;
  text: string;
}

export class UpdateJoke {
  constructor(private readonly jokeRepository: JokeRepository) {}

  async execute(request: UpdateJokeRequest): Promise<Joke> {
    const existingJoke = await this.jokeRepository.findById(request.id);

    if (!existingJoke) {
      throw new NotFoundError(`Joke with id ${request.id} not found`);
    }

    const updatedJoke = existingJoke.updateText(request.text);

    await this.jokeRepository.update(updatedJoke);

    return updatedJoke;
  }
}
