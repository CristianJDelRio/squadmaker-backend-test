import { SmsNotificador } from '../../../../../../src/contexts/notifications/infrastructure/services/SmsNotificador';
import { Logger } from '../../../../../../src/shared/infrastructure/logger/Logger';

describe('SmsNotificador', () => {
  let notificador: SmsNotificador;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as jest.Mocked<Logger>;

    notificador = new SmsNotificador(mockLogger);
  });

  describe('send', () => {
    it('should send SMS notification via logger', async () => {
      const recipient = '+1234567890';
      const message = 'Test SMS message';

      await notificador.send(recipient, message);

      expect(mockLogger.info).toHaveBeenCalledWith(
        `[SMS] Sending to ${recipient}: ${message}`
      );
    });

    it('should handle multiple notifications', async () => {
      await notificador.send('+1111111111', 'Message 1');
      await notificador.send('+2222222222', 'Message 2');
      await notificador.send('+3333333333', 'Message 3');

      expect(mockLogger.info).toHaveBeenCalledTimes(3);
    });

    it('should validate recipient is not empty', async () => {
      await expect(notificador.send('', 'message')).rejects.toThrow(
        'Recipient cannot be empty'
      );
    });

    it('should validate message is not empty', async () => {
      await expect(notificador.send('+1234567890', '')).rejects.toThrow(
        'Message cannot be empty'
      );
    });

    it('should validate recipient phone format', async () => {
      await expect(
        notificador.send('invalid-phone', 'message')
      ).rejects.toThrow('Invalid phone format');
    });

    it('should accept phone with country code', async () => {
      await notificador.send('+521234567890', 'message');

      expect(mockLogger.info).toHaveBeenCalledWith(
        '[SMS] Sending to +521234567890: message'
      );
    });
  });
});
