import { NetworkConfig } from '@cellularjs/net';
import { ArticleCell } from 'article/$gateway/article.cell';

export const blogAppNetwork: NetworkConfig = [
  {
    name: 'Article',
    driver: ArticleCell,
    space: 'neverland',
  },
];