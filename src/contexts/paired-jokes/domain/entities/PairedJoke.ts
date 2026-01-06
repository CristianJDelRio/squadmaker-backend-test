import { ValidationError } from '../../../shared/domain/errors/ValidationError';

interface PairedJokeProps {
  chuckJoke: string;
  dadJoke: string;
  combined: string;
}

export class PairedJoke {
  private constructor(
    public readonly chuckJoke: string,
    public readonly dadJoke: string,
    public readonly combined: string
  ) {}

  static create(props: PairedJokeProps): PairedJoke {
    if (!props.chuckJoke || props.chuckJoke.trim() === '') {
      throw new ValidationError('Chuck joke cannot be empty');
    }

    if (!props.dadJoke || props.dadJoke.trim() === '') {
      throw new ValidationError('Dad joke cannot be empty');
    }

    if (!props.combined || props.combined.trim() === '') {
      throw new ValidationError('Combined joke cannot be empty');
    }

    return new PairedJoke(props.chuckJoke, props.dadJoke, props.combined);
  }

  toPrimitives(): { chuck: string; dad: string; combined: string } {
    return {
      chuck: this.chuckJoke,
      dad: this.dadJoke,
      combined: this.combined,
    };
  }
}
