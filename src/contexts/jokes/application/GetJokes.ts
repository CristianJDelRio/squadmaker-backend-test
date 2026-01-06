import { JokeRepository } from '../domain/repositories/JokeRepository';
import { Joke } from '../domain/entities/Joke';

export interface GetJokesRequest {
  userId?: string;
  categoryId?: string;
}

export class GetJokes {
  constructor(private readonly jokeRepository: JokeRepository) {}

  async execute(request: GetJokesRequest): Promise<Joke[]> {
    const { userId, categoryId } = request;

    if (userId && categoryId) {
      return await this.jokeRepository.findByUserIdAndCategoryId(
        userId,
        categoryId
      );
    }

    if (userId) {
      return await this.jokeRepository.findByUserId(userId);
    }

    if (categoryId) {
      return await this.jokeRepository.findByCategoryId(categoryId);
    }

    return await this.jokeRepository.findAll();
  }
}
