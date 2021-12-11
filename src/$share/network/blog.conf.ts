import { NetworkConfig } from '@cellularjs/net';
import { ArticleCell } from '@cell/article';

export const blogAppNetwork: NetworkConfig = [
  {
    name: 'Article',
    driver: ArticleCell,
    space: 'neverland',
  },
];