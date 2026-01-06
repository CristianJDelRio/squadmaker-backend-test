import { ChuckNorrisApiService } from '../../jokes/infrastructure/external-apis/ChuckNorrisApiService';
import { DadJokesApiService } from '../../jokes/infrastructure/external-apis/DadJokesApiService';
import { ClaudeApiService } from '../infrastructure/external-apis/ClaudeApiService';
import { PairedJoke } from '../domain/entities/PairedJoke';

export class FetchPairedJokes {
  constructor(
    private readonly chuckNorrisService: ChuckNorrisApiService,
    private readonly dadJokesService: DadJokesApiService,
    private readonly claudeService: ClaudeApiService
  ) {}

  async execute(): Promise<PairedJoke[]> {
    const chuckPromises = Array.from({ length: 5 }, () =>
      this.chuckNorrisService.getRandomJoke()
    );

    const dadPromises = Array.from({ length: 5 }, () =>
      this.dadJokesService.getRandomJoke()
    );

    const [chuckJokes, dadJokes] = await Promise.all([
      Promise.all(chuckPromises),
      Promise.all(dadPromises),
    ]);

    const pairedJokes: PairedJoke[] = [];

    for (let i = 0; i < 5; i++) {
      const combined = await this.claudeService.combineJokes(
        chuckJokes[i]!,
        dadJokes[i]!
      );

      const pairedJoke = PairedJoke.create({
        chuckJoke: chuckJokes[i]!,
        dadJoke: dadJokes[i]!,
        combined,
      });

      pairedJokes.push(pairedJoke);
    }

    return pairedJokes;
  }
}
