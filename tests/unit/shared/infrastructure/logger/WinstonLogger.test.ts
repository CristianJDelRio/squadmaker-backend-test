import { WinstonLogger } from '../../../../../src/shared/infrastructure/logger/WinstonLogger';

describe('WinstonLogger', () => {
  let logger: WinstonLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    logger = new WinstonLogger();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('info', () => {
    it('should log info messages', () => {
      expect(() => logger.info('Test info message')).not.toThrow();
    });

    it('should log info messages with metadata', () => {
      expect(() =>
        logger.info('Test info message', { key: 'value' })
      ).not.toThrow();
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      expect(() => logger.error('Test error message')).not.toThrow();
    });

    it('should log error messages with metadata', () => {
      expect(() =>
        logger.error('Test error message', { errorCode: 500 })
      ).not.toThrow();
    });
  });

  describe('warn', () => {
    it('should log warn messages', () => {
      expect(() => logger.warn('Test warn message')).not.toThrow();
    });

    it('should log warn messages with metadata', () => {
      expect(() =>
        logger.warn('Test warn message', { warning: 'deprecated' })
      ).not.toThrow();
    });
  });

  describe('debug', () => {
    it('should log debug messages', () => {
      expect(() => logger.debug('Test debug message')).not.toThrow();
    });

    it('should log debug messages with metadata', () => {
      expect(() =>
        logger.debug('Test debug message', { debugInfo: 'trace' })
      ).not.toThrow();
    });
  });
});
