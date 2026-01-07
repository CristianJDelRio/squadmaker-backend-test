import { INotificador } from '../../domain/services/INotificador';
import { Logger } from '../../../../shared/infrastructure/logger/Logger';
import { ValidationError } from '../../../shared/domain/errors/ValidationError';

export class SmsNotificador implements INotificador {
  constructor(private readonly logger: Logger) {}

  async send(recipient: string, message: string): Promise<void> {
    if (!recipient || recipient.trim().length === 0) {
      throw new ValidationError('Recipient cannot be empty');
    }

    if (!message || message.trim().length === 0) {
      throw new ValidationError('Message cannot be empty');
    }

    if (!this.isValidPhone(recipient)) {
      throw new ValidationError('Invalid phone format');
    }

    this.logger.info(`[SMS] Sending to ${recipient}: ${message}`);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }
}
