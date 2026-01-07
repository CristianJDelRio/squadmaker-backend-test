import { randomUUID } from 'crypto';

export class UserId {
  public readonly value: string;

  constructor(value?: string) {
    this.value = value || randomUUID();
  }

  public toString(): string {
    return this.value;
  }
}
