import { CellularConfig } from '@cellularjs/cli';

const cellularConfig: CellularConfig = {
  entry: {
    http: './src/$gateway/http/index.ts',
    halo: './src/$gateway/halo/index.ts',
  },
};

export default cellularConfig;
