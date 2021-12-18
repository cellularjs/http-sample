import { Injectable } from '@cellularjs/di';
import { IRQ } from '@cellularjs/net';
import { BadRequest } from '$share/message';

export interface CreateArticleReq {
  title: string;
  content: string;
}

@Injectable()
export class CreateArticleReq {
  constructor(irq: IRQ) {
    if (!irq.body.title) {
      throw new BadRequest({
        err: 'BAD_REQUEST',
        errs: [
          { src: 'title', err: 'REQUIRED' },
        ],
      });
    }

    Object.assign(this, irq.body);
  }
}
