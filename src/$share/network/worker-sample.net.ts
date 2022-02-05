import { NetworkConfig } from '@cellularjs/net';
import { WorkerCell } from 'worker/$gateway/worker.cell';

export const workerSampleNetwork: NetworkConfig = [
  {
    name: 'Worker',
    driver: WorkerCell,
  },
];