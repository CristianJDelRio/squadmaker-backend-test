export interface INotificador {
  send(recipient: string, message: string): Promise<void>;
}
