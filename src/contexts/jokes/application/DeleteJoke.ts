import { JokeRepository } from '../domain/repositories/JokeRepository';

export class DeleteJoke {
  constructor(private readonly jokeRepository: JokeRepository) {}

  async execute(id: string): Promise<void> {
    await this.jokeRepository.delete(id);
  }
}
