import { ClaudeApiService } from '../../../../../src/contexts/paired-jokes/infrastructure/external-apis/ClaudeApiService';

describe('ClaudeApiService', () => {
  let service: ClaudeApiService;

  beforeEach(() => {
    service = new ClaudeApiService();
  });

  describe('combineJokes', () => {
    it('should combine two jokes into one creative joke', async () => {
      const chuckJoke = 'Chuck Norris can divide by zero.';
      const dadJoke = 'Why did the scarecrow win an award? He was outstanding in his field.';

      const combined = await service.combineJokes(chuckJoke, dadJoke);

      expect(combined).toBeDefined();
      expect(typeof combined).toBe('string');
      expect(combined.length).toBeGreaterThan(0);
    }, 15000);

    it('should throw error when chuck joke is empty', async () => {
      await expect(
        service.combineJokes('', 'Some dad joke')
      ).rejects.toThrow('Chuck joke cannot be empty');
    });

    it('should throw error when dad joke is empty', async () => {
      await expect(
        service.combineJokes('Some chuck joke', '')
      ).rejects.toThrow('Dad joke cannot be empty');
    });

    it('should handle API errors gracefully', async () => {
      const invalidService = new ClaudeApiService('invalid-api-key');

      await expect(
        invalidService.combineJokes('Chuck joke', 'Dad joke')
      ).rejects.toThrow();
    }, 15000);
  });
});
