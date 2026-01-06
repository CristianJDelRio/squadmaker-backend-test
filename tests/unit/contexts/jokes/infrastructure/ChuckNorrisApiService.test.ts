import axios from 'axios';
import { ChuckNorrisApiService } from '../../../../../src/contexts/jokes/infrastructure/external-apis/ChuckNorrisApiService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ChuckNorrisApiService', () => {
  let service: ChuckNorrisApiService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ChuckNorrisApiService();
  });

  describe('getRandomJoke', () => {
    it('should fetch a random joke from Chuck Norris API', async () => {
      const mockApiResponse = {
        data: {
          icon_url: 'https://api.chucknorris.io/img/avatar/chuck-norris.png',
          id: '0wIjXd4ASTS5Kogij9NTFA',
          url: '',
          value:
            'Chuck Norris never went to karate class, he was born kicking butt.',
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

      const result = await service.getRandomJoke();

      expect(result).toBe(
        'Chuck Norris never went to karate class, he was born kicking butt.'
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.chucknorris.io/jokes/random'
      );
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should retry on network failure and succeed on second attempt', async () => {
      const mockApiResponse = {
        data: {
          icon_url: 'https://api.chucknorris.io/img/avatar/chuck-norris.png',
          id: 'test-id-456',
          url: '',
          value: 'Chuck Norris can divide by zero.',
        },
      };

      mockedAxios.get
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockApiResponse);

      const result = await service.getRandomJoke();

      expect(result).toBe('Chuck Norris can divide by zero.');
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });

    it('should throw error after max retries exceeded', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(service.getRandomJoke()).rejects.toThrow(
        'Failed to fetch joke from Chuck Norris API after 3 attempts'
      );
      expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Timeout') as Error & { code: string };
      timeoutError.code = 'ECONNABORTED';
      mockedAxios.get.mockRejectedValue(timeoutError);

      await expect(service.getRandomJoke()).rejects.toThrow(
        'Failed to fetch joke from Chuck Norris API after 3 attempts'
      );
      expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    });

    it('should handle invalid response format', async () => {
      const mockApiResponse = {
        data: {
          id: 'test-id',
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

      await expect(service.getRandomJoke()).rejects.toThrow(
        'Invalid response from Chuck Norris API'
      );
    });
  });
});
