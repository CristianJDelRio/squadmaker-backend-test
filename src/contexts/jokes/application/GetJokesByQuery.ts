import { Joke } from '../domain/entities/Joke';
import { JokeRepository } from '../domain/repositories/JokeRepository';

export interface GetJokesByQueryParams {
  userId?: string;
  categoryId?: string;
  userName?: string;
  categoryName?: string;
}

export class GetJokesByQuery {
  constructor(private readonly repository: JokeRepository) {}

  async execute(params: GetJokesByQueryParams): Promise<Joke[]> {
    const { userId, categoryId, userName, categoryName } = params;

    if (userName && categoryName) {
      return this.repository.findByUserNameAndCategoryName(
        userName,
        categoryName
      );
    }

    if (userName) {
      return this.repository.findByUserName(userName);
    }

    if (categoryName) {
      return this.repository.findByCategoryName(categoryName);
    }

    if (userId && categoryId) {
      return this.repository.findByUserIdAndCategoryId(userId, categoryId);
    }

    if (userId) {
      return this.repository.findByUserId(userId);
    }

    if (categoryId) {
      return this.repository.findByCategoryId(categoryId);
    }

    return this.repository.findAll();
  }
}
