import { FetchExternalJoke } from '../../../../../../src/contexts/jokes/application/use-cases/FetchExternalJoke';
import { ChuckNorrisApiService } from '../../../../../../src/contexts/jokes/infrastructure/external-apis/ChuckNorrisApiService';
import { DadJokesApiService } from '../../../../../../src/contexts/jokes/infrastructure/external-apis/DadJokesApiService';
import { ValidationError } from '../../../../../../src/contexts/shared/domain/errors/ValidationError';

jest.mock(
  '../../../../../../src/contexts/jokes/infrastructure/external-apis/ChuckNorrisApiService'
);
jest.mock(
  '../../../../../../src/contexts/jokes/infrastructure/external-apis/DadJokesApiService'
);

describe('FetchExternalJoke', () => {
  let useCase: FetchExternalJoke;
  let mockChuckNorrisService: jest.Mocked<ChuckNorrisApiService>;
  let mockDadJokesService: jest.Mocked<DadJokesApiService>;

  beforeEach(() => {
    mockChuckNorrisService =
      new ChuckNorrisApiService() as jest.Mocked<ChuckNorrisApiService>;
    mockDadJokesService =
      new DadJokesApiService() as jest.Mocked<DadJokesApiService>;

    useCase = new FetchExternalJoke(
      mockChuckNorrisService,
      mockDadJokesService
    );
  });

  describe('execute', () => {
    it('should fetch joke from Chuck Norris API when type is Chuck', async () => {
      const expectedJoke = 'Chuck Norris can divide by zero.';
      mockChuckNorrisService.getRandomJoke = jest
        .fn()
        .mockResolvedValue(expectedJoke);

      const result = await useCase.execute('Chuck');

      expect(result).toBe(expectedJoke);
      expect(mockChuckNorrisService.getRandomJoke).toHaveBeenCalledTimes(1);
      expect(mockDadJokesService.getRandomJoke).not.toHaveBeenCalled();
    });

    it('should fetch joke from Dad Jokes API when type is Dad', async () => {
      const expectedJoke =
        'Why did the scarecrow win an award? Because he was outstanding in his field.';
      mockDadJokesService.getRandomJoke = jest
        .fn()
        .mockResolvedValue(expectedJoke);

      const result = await useCase.execute('Dad');

      expect(result).toBe(expectedJoke);
      expect(mockDadJokesService.getRandomJoke).toHaveBeenCalledTimes(1);
      expect(mockChuckNorrisService.getRandomJoke).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when type is invalid', async () => {
      await expect(useCase.execute('invalid')).rejects.toThrow(ValidationError);
      await expect(useCase.execute('invalid')).rejects.toThrow(
        'Invalid joke type. Must be "Chuck" or "Dad"'
      );

      expect(mockChuckNorrisService.getRandomJoke).not.toHaveBeenCalled();
      expect(mockDadJokesService.getRandomJoke).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when type is empty', async () => {
      await expect(useCase.execute('')).rejects.toThrow(ValidationError);

      expect(mockChuckNorrisService.getRandomJoke).not.toHaveBeenCalled();
      expect(mockDadJokesService.getRandomJoke).not.toHaveBeenCalled();
    });

    it('should be case-insensitive for Chuck', async () => {
      const expectedJoke = 'Chuck Norris can slam a revolving door.';
      mockChuckNorrisService.getRandomJoke = jest
        .fn()
        .mockResolvedValue(expectedJoke);

      const result = await useCase.execute('chuck');

      expect(result).toBe(expectedJoke);
      expect(mockChuckNorrisService.getRandomJoke).toHaveBeenCalledTimes(1);
    });

    it('should be case-insensitive for Dad', async () => {
      const expectedJoke =
        'What do you call cheese that is not yours? Nacho cheese.';
      mockDadJokesService.getRandomJoke = jest
        .fn()
        .mockResolvedValue(expectedJoke);

      const result = await useCase.execute('dad');

      expect(result).toBe(expectedJoke);
      expect(mockDadJokesService.getRandomJoke).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from Chuck Norris API', async () => {
      const apiError = new Error('Chuck Norris API is down');
      mockChuckNorrisService.getRandomJoke = jest
        .fn()
        .mockRejectedValue(apiError);

      await expect(useCase.execute('Chuck')).rejects.toThrow(
        'Chuck Norris API is down'
      );
    });

    it('should propagate errors from Dad Jokes API', async () => {
      const apiError = new Error('Dad Jokes API is down');
      mockDadJokesService.getRandomJoke = jest.fn().mockRejectedValue(apiError);

      await expect(useCase.execute('Dad')).rejects.toThrow(
        'Dad Jokes API is down'
      );
    });
  });
});
