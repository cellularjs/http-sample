import { WorkerStatus } from '../internal';
import { SubjectQueue } from './subject-queue';
import { Observer } from './observer';
import { Worker } from './worker';

export class Pool {
  private static _pool: Worker[] = [];
  private static _subjectQueue = new SubjectQueue<Worker>();

  static totalWorker() {
    return this._pool.length;
  }

  /**
   * Add worker into pool.
   */
  static addWorker(worker: Worker): void {
    this._pool.push(worker);

    worker.onUpdateStatus((status) => {
      if (status === WorkerStatus.BUSY) {
        return;
      }

      this._subjectQueue.notify(worker);
    });
  }

  static getWorkerById(threadId: number) {
    return this._pool.find(
      (worker) => worker.getNodeJsWorker().threadId === threadId,
    );
  }

  /**
   * Waiting for idle CellularJS Worker.
   */
  static async waitForIdleWorker(): Promise<Worker> {
    const idleWorker = this.getIdleWorker();

    if (idleWorker) {
      idleWorker.setStatus(WorkerStatus.BUSY);
      return idleWorker;
    }

    return new Promise((resolve) => {
      const obs = new Observer<Worker>();
      obs.subcribe((worker) => {
        worker.setStatus(WorkerStatus.BUSY);
        resolve(worker);
      });

      this._subjectQueue.addObserver(obs);
    });
  }

  static async drain() {
    return Promise.all(this._pool.map((worker) => worker.terminate()));
  }

  private static getIdleWorker(): Worker | undefined {
    return this._pool.find(
      (worker) => worker.getStatus() === WorkerStatus.IDLE,
    );
  }
}
