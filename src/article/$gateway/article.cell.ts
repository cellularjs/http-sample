import { Cell } from '@cellularjs/net';
import { CommonModule } from '$share/common/common.module';

@Cell({
  imports: [CommonModule],
  providers: ['../'],
  listen: '../',
})
export class ArticleCell {}