import { CellularConfig } from '@cellularjs/cli';

const cellularConfig: CellularConfig = {
  entry: {
    crud: './src/$gateway/crud/index.ts',
    worker: './src/$gateway/worker/index.ts',
  },
};

export default cellularConfig;
