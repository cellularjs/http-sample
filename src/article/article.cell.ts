import { Cell } from '@cellularjs/net';
import { CommonModule } from '$share/common';

@Cell({
  imports: [CommonModule],
  listen: './services',
})
export class ArticleCell {}