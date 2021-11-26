import { Cell } from '@cellularjs/net';
import { CommonModule } from '$share/common'

@Cell({
  imports: [CommonModule],
  providers: [
    './data',
    { token: 'foo', useValue: 'bar' },
  ],
  listen: './services',
})
export class Auth { }
