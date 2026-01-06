import Anthropic from '@anthropic-ai/sdk';
import { env } from '../../../../shared/infrastructure/config/env';

export class ClaudeApiService {
  private readonly client: Anthropic;
  private readonly model = 'claude-sonnet-4-20250514';
  private readonly maxTokens = 300;

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || env.anthropicApiKey,
    });
  }

  async combineJokes(chuckJoke: string, dadJoke: string): Promise<string> {
    if (!chuckJoke || chuckJoke.trim() === '') {
      throw new Error('Chuck joke cannot be empty');
    }

    if (!dadJoke || dadJoke.trim() === '') {
      throw new Error('Dad joke cannot be empty');
    }

    const prompt = `You are a creative comedian. Your task is to combine two jokes into one hilarious, creative joke that incorporates elements from both.

Chuck Norris Joke: "${chuckJoke}"
Dad Joke: "${dadJoke}"

Create a single, creative joke that cleverly combines both jokes. Be witty and creative. Return only the combined joke, no explanations.`;

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const textContent = message.content.find(
        (block) => block.type === 'text'
      );

      if (!textContent || textContent.type !== 'text') {
        throw new Error('Invalid response from Claude API');
      }

      return textContent.text.trim();
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        throw new Error(
          `Claude API Error: ${error.status} ${JSON.stringify(error.error)}`
        );
      }
      throw error;
    }
  }
}
