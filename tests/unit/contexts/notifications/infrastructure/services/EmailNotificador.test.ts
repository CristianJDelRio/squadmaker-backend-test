import { EmailNotificador } from '../../../../../../src/contexts/notifications/infrastructure/services/EmailNotificador';
import { Logger } from '../../../../../../src/shared/infrastructure/logger/Logger';

describe('EmailNotificador', () => {
  let notificador: EmailNotificador;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as jest.Mocked<Logger>;

    notificador = new EmailNotificador(mockLogger);
  });

  describe('send', () => {
    it('should send email notification via logger', async () => {
      const recipient = 'user@example.com';
      const message = 'Test notification message';

      await notificador.send(recipient, message);

      expect(mockLogger.info).toHaveBeenCalledWith(
        `[EMAIL] Sending to ${recipient}: ${message}`
      );
    });

    it('should handle multiple notifications', async () => {
      await notificador.send('user1@example.com', 'Message 1');
      await notificador.send('user2@example.com', 'Message 2');
      await notificador.send('user3@example.com', 'Message 3');

      expect(mockLogger.info).toHaveBeenCalledTimes(3);
    });

    it('should validate recipient is not empty', async () => {
      await expect(notificador.send('', 'message')).rejects.toThrow(
        'Recipient cannot be empty'
      );
    });

    it('should validate message is not empty', async () => {
      await expect(notificador.send('user@example.com', '')).rejects.toThrow(
        'Message cannot be empty'
      );
    });

    it('should validate recipient email format', async () => {
      await expect(
        notificador.send('invalid-email', 'message')
      ).rejects.toThrow('Invalid email format');
    });
  });
});
