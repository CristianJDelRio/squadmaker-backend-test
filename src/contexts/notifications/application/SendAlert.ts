import { INotificador } from '../domain/services/INotificador';

export class SendAlert {
  constructor(private readonly notificador: INotificador) {}

  async execute(recipient: string, message: string): Promise<void> {
    await this.notificador.send(recipient, message);
  }
}
