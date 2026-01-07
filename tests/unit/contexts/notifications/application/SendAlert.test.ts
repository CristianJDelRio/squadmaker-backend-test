import { SendAlert } from '../../../../../src/contexts/notifications/application/SendAlert';
import { INotificador } from '../../../../../src/contexts/notifications/domain/services/INotificador';

class MockNotificador implements INotificador {
  public calls: Array<{ recipient: string; message: string }> = [];

  async send(recipient: string, message: string): Promise<void> {
    this.calls.push({ recipient, message });
  }
}

describe('SendAlert', () => {
  let sendAlert: SendAlert;
  let mockNotificador: MockNotificador;

  beforeEach(() => {
    mockNotificador = new MockNotificador();
    sendAlert = new SendAlert(mockNotificador);
  });

  describe('execute', () => {
    it('should send alert via injected notificador', async () => {
      const recipient = 'user@example.com';
      const message = 'Important alert';

      await sendAlert.execute(recipient, message);

      expect(mockNotificador.calls).toHaveLength(1);
      expect(mockNotificador.calls[0]).toEqual({
        recipient,
        message,
      });
    });

    it('should handle multiple alerts', async () => {
      await sendAlert.execute('user1@example.com', 'Alert 1');
      await sendAlert.execute('user2@example.com', 'Alert 2');
      await sendAlert.execute('+1234567890', 'Alert 3');

      expect(mockNotificador.calls).toHaveLength(3);
    });

    it('should propagate errors from notificador', async () => {
      const failingNotificador: INotificador = {
        send: jest.fn().mockRejectedValue(new Error('Network error')),
      };

      const service = new SendAlert(failingNotificador);

      await expect(
        service.execute('user@example.com', 'message')
      ).rejects.toThrow('Network error');
    });

    it('should work with different notificador implementations', async () => {
      const anotherMock = new MockNotificador();
      const anotherService = new SendAlert(anotherMock);

      await anotherService.execute('+999999999', 'SMS alert');

      expect(anotherMock.calls).toHaveLength(1);
      expect(anotherMock.calls[0]?.recipient).toBe('+999999999');
    });
  });
});
