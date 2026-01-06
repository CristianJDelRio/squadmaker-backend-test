import { randomUUID } from 'crypto';
import { JokeRepository } from '../domain/repositories/JokeRepository';
import { Joke } from '../domain/entities/Joke';

export interface CreateJokeRequest {
  text: string;
  userId: string;
  categoryId: string;
}

export class CreateJoke {
  constructor(private readonly jokeRepository: JokeRepository) {}

  async execute(request: CreateJokeRequest): Promise<Joke> {
    const now = new Date();

    const joke = Joke.create({
      id: randomUUID(),
      text: request.text,
      userId: request.userId,
      categoryId: request.categoryId,
      createdAt: now,
      updatedAt: now,
    });

    await this.jokeRepository.save(joke);

    return joke;
  }
}
