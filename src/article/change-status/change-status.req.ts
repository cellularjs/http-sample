import { Injectable } from '@cellularjs/di';
import { IRQ } from '@cellularjs/net';
import { ArticleStatus } from '$share/type';

export interface ChangeStatusArticleReq {
  id: string;
  status: ArticleStatus;
}

@Injectable()
export class ChangeStatusArticleReq {
  constructor(irq: IRQ) {
    Object.assign(this, irq.body);
  }
}
