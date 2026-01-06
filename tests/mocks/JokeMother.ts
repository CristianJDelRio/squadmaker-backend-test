import { Joke } from '../../src/contexts/jokes/domain/entities/Joke';
import { randomUUID } from 'crypto';

export class JokeMother {
  static random(
    overrides?: Partial<{
      id: string;
      text: string;
      userId: string;
      categoryId: string;
      createdAt: Date;
      updatedAt: Date;
    }>
  ): Joke {
    const now = new Date();
    return Joke.create({
      id: overrides?.id || randomUUID(),
      text:
        overrides?.text ||
        `Random joke ${Math.random().toString(36).substring(7)}`,
      userId: overrides?.userId || 'test-user-id',
      categoryId: overrides?.categoryId || 'test-category-id',
      createdAt: overrides?.createdAt || now,
      updatedAt: overrides?.updatedAt || now,
    });
  }

  static withUser(userId: string): Joke {
    const now = new Date();
    return Joke.create({
      id: randomUUID(),
      text: `Joke for user ${userId}`,
      userId,
      categoryId: 'test-category-id',
      createdAt: now,
      updatedAt: now,
    });
  }

  static withCategory(categoryId: string): Joke {
    const now = new Date();
    return Joke.create({
      id: randomUUID(),
      text: `Joke for category ${categoryId}`,
      userId: 'test-user-id',
      categoryId,
      createdAt: now,
      updatedAt: now,
    });
  }

  static withUserAndCategory(userId: string, categoryId: string): Joke {
    const now = new Date();
    return Joke.create({
      id: randomUUID(),
      text: `Joke for user ${userId} and category ${categoryId}`,
      userId,
      categoryId,
      createdAt: now,
      updatedAt: now,
    });
  }

  static chuckNorris(): Joke {
    const now = new Date();
    return Joke.create({
      id: randomUUID(),
      text: 'Chuck Norris counted to infinity. Twice.',
      userId: 'test-user-id',
      categoryId: 'test-category-id',
      createdAt: now,
      updatedAt: now,
    });
  }

  static dadJoke(): Joke {
    const now = new Date();
    return Joke.create({
      id: randomUUID(),
      text: 'Why did the scarecrow win an award? Because he was outstanding in his field.',
      userId: 'test-user-id',
      categoryId: 'test-category-id',
      createdAt: now,
      updatedAt: now,
    });
  }
}
