import { INotificador } from '../../domain/services/INotificador';
import { Logger } from '../../../../shared/infrastructure/logger/Logger';
import { ValidationError } from '../../../shared/domain/errors/ValidationError';

export class EmailNotificador implements INotificador {
  constructor(private readonly logger: Logger) {}

  async send(recipient: string, message: string): Promise<void> {
    if (!recipient || recipient.trim().length === 0) {
      throw new ValidationError('Recipient cannot be empty');
    }

    if (!message || message.trim().length === 0) {
      throw new ValidationError('Message cannot be empty');
    }

    if (!this.isValidEmail(recipient)) {
      throw new ValidationError('Invalid email format');
    }

    this.logger.info(`[EMAIL] Sending to ${recipient}: ${message}`);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
