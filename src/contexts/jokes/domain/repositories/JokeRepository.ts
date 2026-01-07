import { Joke } from '../entities/Joke';

export interface JokeRepository {
  save(joke: Joke): Promise<void>;
  findById(id: string): Promise<Joke | null>;
  findAll(): Promise<Joke[]>;
  findByUserId(userId: string): Promise<Joke[]>;
  findByCategoryId(categoryId: string): Promise<Joke[]>;
  findByUserIdAndCategoryId(
    userId: string,
    categoryId: string
  ): Promise<Joke[]>;
  findByUserName(userName: string): Promise<Joke[]>;
  findByCategoryName(categoryName: string): Promise<Joke[]>;
  findByUserNameAndCategoryName(
    userName: string,
    categoryName: string
  ): Promise<Joke[]>;
  delete(id: string): Promise<void>;
  update(joke: Joke): Promise<void>;
}
