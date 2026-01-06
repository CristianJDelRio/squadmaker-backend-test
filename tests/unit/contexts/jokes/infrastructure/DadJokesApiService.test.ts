import axios from 'axios';
import { DadJokesApiService } from '../../../../../src/contexts/jokes/infrastructure/external-apis/DadJokesApiService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DadJokesApiService', () => {
  let service: DadJokesApiService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DadJokesApiService();
  });

  describe('getRandomJoke', () => {
    it('should fetch a random joke from Dad Jokes API', async () => {
      const mockApiResponse = {
        data: {
          id: 'R7UfaahVfFd',
          joke: 'My dog used to chase people on a bike a lot. It got so bad I had to take his bike away.',
          status: 200,
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

      const result = await service.getRandomJoke();

      expect(result).toBe(
        'My dog used to chase people on a bike a lot. It got so bad I had to take his bike away.'
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://icanhazdadjoke.com',
        expect.objectContaining({
          headers: {
            Accept: 'application/json',
          },
        })
      );
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should retry on network failure and succeed on second attempt', async () => {
      const mockApiResponse = {
        data: {
          id: 'abc123',
          joke: 'Why did the scarecrow win an award? Because he was outstanding in his field.',
          status: 200,
        },
      };

      mockedAxios.get
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockApiResponse);

      const result = await service.getRandomJoke();

      expect(result).toBe(
        'Why did the scarecrow win an award? Because he was outstanding in his field.'
      );
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });

    it('should throw error after max retries exceeded', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(service.getRandomJoke()).rejects.toThrow(
        'Failed to fetch joke from Dad Jokes API after 3 attempts'
      );
      expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Timeout') as Error & { code: string };
      timeoutError.code = 'ECONNABORTED';
      mockedAxios.get.mockRejectedValue(timeoutError);

      await expect(service.getRandomJoke()).rejects.toThrow(
        'Failed to fetch joke from Dad Jokes API after 3 attempts'
      );
      expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    });

    it('should handle invalid response format', async () => {
      const mockApiResponse = {
        data: {
          id: 'test-id',
          status: 200,
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

      await expect(service.getRandomJoke()).rejects.toThrow(
        'Invalid response from Dad Jokes API'
      );
    });
  });
});
