import { Injectable } from '@cellularjs/di';
import { IRQ } from '@cellularjs/net';
import { BadRequest } from '$share/message';

export interface UpdateArticleReq {
  id: string;
  title: string;
  content: string;
}

@Injectable()
export class UpdateArticleReq {
  constructor(irq: IRQ) {
    if (!irq.body.title) {
      throw new BadRequest([
        { src: 'title', err: 'REQUIRED' },
      ]);
    }

    Object.assign(this, irq.body);
  }
}
