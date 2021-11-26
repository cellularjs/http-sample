import { NetworkConfig } from '@cellularjs/net';
import { Auth } from '@cell/auth'

export const yoAppNetwork: NetworkConfig = [
  {
    name: 'Auth',
    driver: Auth,
    space: 'neverland',
  },
];