import Anthropic from '@anthropic-ai/sdk';
import { ClaudeApiService } from '../../../../../src/contexts/paired-jokes/infrastructure/external-apis/ClaudeApiService';

jest.mock('@anthropic-ai/sdk');

const MockedAnthropic = Anthropic as jest.MockedClass<typeof Anthropic>;

describe('ClaudeApiService', () => {
  let service: ClaudeApiService;
  let mockMessagesCreate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockMessagesCreate = jest.fn();

    MockedAnthropic.mockImplementation(
      () =>
        ({
          messages: {
            create: mockMessagesCreate,
          },
        }) as unknown as Anthropic
    );

    service = new ClaudeApiService('test-api-key');
  });

  describe('constructor', () => {
    it('should create Anthropic client with provided API key', () => {
      new ClaudeApiService('custom-api-key');

      expect(MockedAnthropic).toHaveBeenCalledWith({
        apiKey: 'custom-api-key',
      });
    });
  });

  describe('combineJokes', () => {
    const chuckJoke = 'Chuck Norris can divide by zero.';
    const dadJoke =
      'Why did the scarecrow win an award? He was outstanding in his field.';

    describe('input validation', () => {
      it('should throw error when chuck joke is empty string', async () => {
        await expect(service.combineJokes('', dadJoke)).rejects.toThrow(
          'Chuck joke cannot be empty'
        );

        expect(mockMessagesCreate).not.toHaveBeenCalled();
      });

      it('should throw error when chuck joke is whitespace only', async () => {
        await expect(service.combineJokes('   ', dadJoke)).rejects.toThrow(
          'Chuck joke cannot be empty'
        );

        expect(mockMessagesCreate).not.toHaveBeenCalled();
      });

      it('should throw error when dad joke is empty string', async () => {
        await expect(service.combineJokes(chuckJoke, '')).rejects.toThrow(
          'Dad joke cannot be empty'
        );

        expect(mockMessagesCreate).not.toHaveBeenCalled();
      });

      it('should throw error when dad joke is whitespace only', async () => {
        await expect(service.combineJokes(chuckJoke, '   ')).rejects.toThrow(
          'Dad joke cannot be empty'
        );

        expect(mockMessagesCreate).not.toHaveBeenCalled();
      });
    });

    describe('successful API call', () => {
      it('should call Anthropic API with correct parameters', async () => {
        mockMessagesCreate.mockResolvedValue({
          content: [{ type: 'text', text: 'Combined joke result' }],
        });

        await service.combineJokes(chuckJoke, dadJoke);

        expect(mockMessagesCreate).toHaveBeenCalledTimes(1);
        expect(mockMessagesCreate).toHaveBeenCalledWith({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [
            {
              role: 'user',
              content: expect.stringContaining(chuckJoke),
            },
          ],
        });
        expect(mockMessagesCreate).toHaveBeenCalledWith({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [
            {
              role: 'user',
              content: expect.stringContaining(dadJoke),
            },
          ],
        });
      });

      it('should return combined joke from API response', async () => {
        const expectedJoke =
          'Chuck Norris is so outstanding, he won a scarecrow award just by standing in a field.';
        mockMessagesCreate.mockResolvedValue({
          content: [{ type: 'text', text: expectedJoke }],
        });

        const result = await service.combineJokes(chuckJoke, dadJoke);

        expect(result).toBe(expectedJoke);
      });

      it('should trim whitespace from response', async () => {
        mockMessagesCreate.mockResolvedValue({
          content: [{ type: 'text', text: '  Combined joke with spaces  ' }],
        });

        const result = await service.combineJokes(chuckJoke, dadJoke);

        expect(result).toBe('Combined joke with spaces');
      });
    });

    describe('error handling', () => {
      it('should throw error when response has no text content', async () => {
        mockMessagesCreate.mockResolvedValue({
          content: [{ type: 'image', source: {} }],
        });

        await expect(service.combineJokes(chuckJoke, dadJoke)).rejects.toThrow(
          'Invalid response from Claude API'
        );
      });

      it('should throw error when response content is empty', async () => {
        mockMessagesCreate.mockResolvedValue({
          content: [],
        });

        await expect(service.combineJokes(chuckJoke, dadJoke)).rejects.toThrow(
          'Invalid response from Claude API'
        );
      });

      it('should wrap Anthropic API errors with details', async () => {
        const apiError = Object.assign(new Error('API Error'), {
          status: 401,
          error: { message: 'Invalid API key' },
        });
        Object.setPrototypeOf(apiError, Anthropic.APIError.prototype);
        mockMessagesCreate.mockRejectedValue(apiError);

        await expect(service.combineJokes(chuckJoke, dadJoke)).rejects.toThrow(
          'Claude API Error: 401'
        );
      });

      it('should rethrow non-Anthropic errors as-is', async () => {
        const genericError = new Error('Network timeout');
        mockMessagesCreate.mockRejectedValue(genericError);

        await expect(service.combineJokes(chuckJoke, dadJoke)).rejects.toThrow(
          'Network timeout'
        );
      });
    });
  });
});
