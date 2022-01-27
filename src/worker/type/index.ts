export enum WorkerStatus {
  BUSY,
  IDLE,
}

export enum MessageType {
  /**
   * Ready.
   */
  READY = 'READY',

  /**
   * Stop, resolve.
   */
  DONE = 'DONE',

  /**
   * Stop, reject.
   */
  ERROR = 'ERROR',

  // /**
  //  * Run hook.
  //  */
  // HOOK = 'HOOK',

  /**
   * Run task.
   */
  TASK = 'TASK',
}

interface WorkerMessage<Payload> {
  type: MessageType;
  payload?: Payload;
}

export type PostMessage<Payload = any> = WorkerMessage<Payload>;

export type RecievedMessage<Payload = any> = WorkerMessage<Payload>;

export interface HookMessage {
  hook: string;
  hookData: any;
}
