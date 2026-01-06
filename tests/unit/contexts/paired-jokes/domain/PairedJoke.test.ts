import { PairedJoke } from '../../../../../src/contexts/paired-jokes/domain/entities/PairedJoke';

describe('PairedJoke Entity', () => {
  describe('create', () => {
    it('should create a paired joke with valid data', () => {
      const chuckJoke = 'Chuck Norris can divide by zero.';
      const dadJoke = 'Why did the scarecrow win an award? He was outstanding in his field.';
      const combined = 'Chuck Norris can divide by zero while being outstanding in his field.';

      const pairedJoke = PairedJoke.create({
        chuckJoke,
        dadJoke,
        combined,
      });

      expect(pairedJoke.chuckJoke).toBe(chuckJoke);
      expect(pairedJoke.dadJoke).toBe(dadJoke);
      expect(pairedJoke.combined).toBe(combined);
    });

    it('should throw error when chuck joke is empty', () => {
      expect(() => {
        PairedJoke.create({
          chuckJoke: '',
          dadJoke: 'Some dad joke',
          combined: 'Some combination',
        });
      }).toThrow('Chuck joke cannot be empty');
    });

    it('should throw error when dad joke is empty', () => {
      expect(() => {
        PairedJoke.create({
          chuckJoke: 'Some chuck joke',
          dadJoke: '',
          combined: 'Some combination',
        });
      }).toThrow('Dad joke cannot be empty');
    });

    it('should throw error when combined joke is empty', () => {
      expect(() => {
        PairedJoke.create({
          chuckJoke: 'Some chuck joke',
          dadJoke: 'Some dad joke',
          combined: '',
        });
      }).toThrow('Combined joke cannot be empty');
    });
  });

  describe('toPrimitives', () => {
    it('should return primitive representation', () => {
      const pairedJoke = PairedJoke.create({
        chuckJoke: 'Chuck joke',
        dadJoke: 'Dad joke',
        combined: 'Combined joke',
      });

      const primitives = pairedJoke.toPrimitives();

      expect(primitives).toEqual({
        chuck: 'Chuck joke',
        dad: 'Dad joke',
        combined: 'Combined joke',
      });
    });
  });
});
