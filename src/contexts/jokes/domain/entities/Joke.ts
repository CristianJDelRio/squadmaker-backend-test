import { JokeId } from '../value-objects/JokeId';
import { JokeText } from '../value-objects/JokeText';
import { UserId } from '../../../shared/domain/value-objects/UserId';
import { CategoryId } from '../../../shared/domain/value-objects/CategoryId';

export interface JokePrimitives {
  id: string;
  text: string;
  userId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Joke {
  public readonly id: JokeId;
  public readonly text: JokeText;
  public readonly userId: UserId;
  public readonly categoryId: CategoryId;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(
    id: JokeId,
    text: JokeText,
    userId: UserId,
    categoryId: CategoryId,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.text = text;
    this.userId = userId;
    this.categoryId = categoryId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(data: JokePrimitives): Joke {
    return new Joke(
      new JokeId(data.id),
      new JokeText(data.text),
      new UserId(data.userId),
      new CategoryId(data.categoryId),
      data.createdAt,
      data.updatedAt
    );
  }

  updateText(newText: string): Joke {
    return new Joke(
      this.id,
      new JokeText(newText),
      this.userId,
      this.categoryId,
      this.createdAt,
      new Date()
    );
  }

  toPrimitives(): JokePrimitives {
    return {
      id: this.id.value,
      text: this.text.value,
      userId: this.userId.value,
      categoryId: this.categoryId.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
