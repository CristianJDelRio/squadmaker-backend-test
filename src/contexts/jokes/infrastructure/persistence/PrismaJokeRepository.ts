import { PrismaClient, Prisma } from '@prisma/client';
import { JokeRepository } from '../../domain/repositories/JokeRepository';
import { Joke } from '../../domain/entities/Joke';
import { NotFoundError } from '../../../shared/domain/errors/NotFoundError';

export class PrismaJokeRepository implements JokeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(joke: Joke): Promise<void> {
    const primitives = joke.toPrimitives();

    await this.prisma.joke.create({
      data: {
        id: primitives.id,
        text: primitives.text,
        userId: primitives.userId,
        categoryId: primitives.categoryId,
        createdAt: primitives.createdAt,
        updatedAt: primitives.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Joke | null> {
    const jokeData = await this.prisma.joke.findUnique({
      where: { id },
    });

    if (!jokeData) {
      return null;
    }

    return Joke.create({
      id: jokeData.id,
      text: jokeData.text,
      userId: jokeData.userId,
      categoryId: jokeData.categoryId,
      createdAt: jokeData.createdAt,
      updatedAt: jokeData.updatedAt,
    });
  }

  async findAll(): Promise<Joke[]> {
    const jokesData = await this.prisma.joke.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return jokesData.map((jokeData) =>
      Joke.create({
        id: jokeData.id,
        text: jokeData.text,
        userId: jokeData.userId,
        categoryId: jokeData.categoryId,
        createdAt: jokeData.createdAt,
        updatedAt: jokeData.updatedAt,
      })
    );
  }

  async findByUserId(userId: string): Promise<Joke[]> {
    const jokesData = await this.prisma.joke.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return jokesData.map((jokeData) =>
      Joke.create({
        id: jokeData.id,
        text: jokeData.text,
        userId: jokeData.userId,
        categoryId: jokeData.categoryId,
        createdAt: jokeData.createdAt,
        updatedAt: jokeData.updatedAt,
      })
    );
  }

  async findByCategoryId(categoryId: string): Promise<Joke[]> {
    const jokesData = await this.prisma.joke.findMany({
      where: { categoryId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return jokesData.map((jokeData) =>
      Joke.create({
        id: jokeData.id,
        text: jokeData.text,
        userId: jokeData.userId,
        categoryId: jokeData.categoryId,
        createdAt: jokeData.createdAt,
        updatedAt: jokeData.updatedAt,
      })
    );
  }

  async findByUserIdAndCategoryId(
    userId: string,
    categoryId: string
  ): Promise<Joke[]> {
    const jokesData = await this.prisma.joke.findMany({
      where: {
        userId,
        categoryId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return jokesData.map((jokeData) =>
      Joke.create({
        id: jokeData.id,
        text: jokeData.text,
        userId: jokeData.userId,
        categoryId: jokeData.categoryId,
        createdAt: jokeData.createdAt,
        updatedAt: jokeData.updatedAt,
      })
    );
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.joke.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(`Joke with id ${id} not found`);
      }
      throw error;
    }
  }

  async update(joke: Joke): Promise<void> {
    const primitives = joke.toPrimitives();

    try {
      await this.prisma.joke.update({
        where: { id: primitives.id },
        data: {
          text: primitives.text,
          updatedAt: primitives.updatedAt,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(`Joke with id ${primitives.id} not found`);
      }
      throw error;
    }
  }

  async findByUserName(userName: string): Promise<Joke[]> {
    const jokesData = await this.prisma.joke.findMany({
      where: {
        user: {
          name: userName,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return jokesData.map((jokeData) =>
      Joke.create({
        id: jokeData.id,
        text: jokeData.text,
        userId: jokeData.userId,
        categoryId: jokeData.categoryId,
        createdAt: jokeData.createdAt,
        updatedAt: jokeData.updatedAt,
      })
    );
  }

  async findByCategoryName(categoryName: string): Promise<Joke[]> {
    const jokesData = await this.prisma.joke.findMany({
      where: {
        category: {
          name: categoryName,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return jokesData.map((jokeData) =>
      Joke.create({
        id: jokeData.id,
        text: jokeData.text,
        userId: jokeData.userId,
        categoryId: jokeData.categoryId,
        createdAt: jokeData.createdAt,
        updatedAt: jokeData.updatedAt,
      })
    );
  }

  async findByUserNameAndCategoryName(
    userName: string,
    categoryName: string
  ): Promise<Joke[]> {
    const jokesData = await this.prisma.joke.findMany({
      where: {
        user: {
          name: userName,
        },
        category: {
          name: categoryName,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return jokesData.map((jokeData) =>
      Joke.create({
        id: jokeData.id,
        text: jokeData.text,
        userId: jokeData.userId,
        categoryId: jokeData.categoryId,
        createdAt: jokeData.createdAt,
        updatedAt: jokeData.updatedAt,
      })
    );
  }
}
