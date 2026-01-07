import { INotificador } from '../../domain/services/INotificador';
import { EmailNotificador } from '../services/EmailNotificador';
import { SmsNotificador } from '../services/SmsNotificador';
import { Logger } from '../../../../shared/infrastructure/logger/Logger';

export class NotifierFactory {
  static create(channel: 'email' | 'sms', logger: Logger): INotificador {
    if (channel === 'sms') {
      return new SmsNotificador(logger);
    }
    return new EmailNotificador(logger);
  }
}
