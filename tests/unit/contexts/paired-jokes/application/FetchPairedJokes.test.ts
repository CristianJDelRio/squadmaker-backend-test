import { FetchPairedJokes } from '../../../../../src/contexts/paired-jokes/application/FetchPairedJokes';
import { ChuckNorrisApiService } from '../../../../../src/contexts/jokes/infrastructure/external-apis/ChuckNorrisApiService';
import { DadJokesApiService } from '../../../../../src/contexts/jokes/infrastructure/external-apis/DadJokesApiService';
import { ClaudeApiService } from '../../../../../src/contexts/paired-jokes/infrastructure/external-apis/ClaudeApiService';

jest.mock('../../../../../src/contexts/jokes/infrastructure/external-apis/ChuckNorrisApiService');
jest.mock('../../../../../src/contexts/jokes/infrastructure/external-apis/DadJokesApiService');
jest.mock('../../../../../src/contexts/paired-jokes/infrastructure/external-apis/ClaudeApiService');

describe('FetchPairedJokes Use Case', () => {
  let useCase: FetchPairedJokes;
  let chuckService: jest.Mocked<ChuckNorrisApiService>;
  let dadService: jest.Mocked<DadJokesApiService>;
  let claudeService: jest.Mocked<ClaudeApiService>;

  beforeEach(() => {
    jest.clearAllMocks();

    chuckService = new ChuckNorrisApiService() as jest.Mocked<ChuckNorrisApiService>;
    dadService = new DadJokesApiService() as jest.Mocked<DadJokesApiService>;
    claudeService = new ClaudeApiService() as jest.Mocked<ClaudeApiService>;

    chuckService.getRandomJoke = jest.fn();
    dadService.getRandomJoke = jest.fn();
    claudeService.combineJokes = jest.fn();

    useCase = new FetchPairedJokes(chuckService, dadService, claudeService);
  });

  describe('execute', () => {
    it('should fetch 5 jokes from Chuck Norris API', async () => {
      chuckService.getRandomJoke.mockResolvedValue('Chuck joke');
      dadService.getRandomJoke.mockResolvedValue('Dad joke');
      claudeService.combineJokes.mockResolvedValue('Combined joke');

      await useCase.execute();

      expect(chuckService.getRandomJoke).toHaveBeenCalledTimes(5);
    });

    it('should fetch 5 jokes from Dad Jokes API', async () => {
      chuckService.getRandomJoke.mockResolvedValue('Chuck joke');
      dadService.getRandomJoke.mockResolvedValue('Dad joke');
      claudeService.combineJokes.mockResolvedValue('Combined joke');

      await useCase.execute();

      expect(dadService.getRandomJoke).toHaveBeenCalledTimes(5);
    });

    it('should combine 5 pairs of jokes using Claude', async () => {
      chuckService.getRandomJoke.mockResolvedValue('Chuck joke');
      dadService.getRandomJoke.mockResolvedValue('Dad joke');
      claudeService.combineJokes.mockResolvedValue('Combined joke');

      await useCase.execute();

      expect(claudeService.combineJokes).toHaveBeenCalledTimes(5);
      expect(claudeService.combineJokes).toHaveBeenCalledWith('Chuck joke', 'Dad joke');
    });

    it('should return array of 5 paired jokes', async () => {
      chuckService.getRandomJoke
        .mockResolvedValueOnce('Chuck 1')
        .mockResolvedValueOnce('Chuck 2')
        .mockResolvedValueOnce('Chuck 3')
        .mockResolvedValueOnce('Chuck 4')
        .mockResolvedValueOnce('Chuck 5');

      dadService.getRandomJoke
        .mockResolvedValueOnce('Dad 1')
        .mockResolvedValueOnce('Dad 2')
        .mockResolvedValueOnce('Dad 3')
        .mockResolvedValueOnce('Dad 4')
        .mockResolvedValueOnce('Dad 5');

      claudeService.combineJokes
        .mockResolvedValueOnce('Combined 1')
        .mockResolvedValueOnce('Combined 2')
        .mockResolvedValueOnce('Combined 3')
        .mockResolvedValueOnce('Combined 4')
        .mockResolvedValueOnce('Combined 5');

      const result = await useCase.execute();

      expect(result).toHaveLength(5);
      expect(result[0]!.toPrimitives()).toEqual({
        chuck: 'Chuck 1',
        dad: 'Dad 1',
        combined: 'Combined 1',
      });
      expect(result[4]!.toPrimitives()).toEqual({
        chuck: 'Chuck 5',
        dad: 'Dad 5',
        combined: 'Combined 5',
      });
    });

    it('should fetch jokes in parallel', async () => {
      const chuckPromises: Array<Promise<void>> = [];
      const dadPromises: Array<Promise<void>> = [];

      chuckService.getRandomJoke.mockImplementation(() => {
        const promise = new Promise<string>((resolve) => {
          setTimeout(() => resolve('Chuck joke'), 100);
        });
        chuckPromises.push(promise.then(() => {}));
        return promise;
      });

      dadService.getRandomJoke.mockImplementation(() => {
        const promise = new Promise<string>((resolve) => {
          setTimeout(() => resolve('Dad joke'), 100);
        });
        dadPromises.push(promise.then(() => {}));
        return promise;
      });

      claudeService.combineJokes.mockResolvedValue('Combined joke');

      const startTime = Date.now();
      await useCase.execute();
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(500);
    });
  });
});
