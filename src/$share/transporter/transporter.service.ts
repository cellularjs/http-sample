import { Injectable } from '@cellularjs/di';
import { send, CellContext, getResolvedCell, IRQ, LOCAL_DRIVER } from '@cellularjs/net';

const CORR_ID_HEADER = 'id';
let dummyIdCount = 0;

@Injectable()
export class Transporter {
  constructor(
    private cellCtx?: CellContext,
    private inCommingIrq?: IRQ,
  ) { }

  async send(irq: IRQ) {
    const irqWithId = this.requestWithId(irq);
    try {
      const driver = this.specifyDriver(irq);
      return await send(irqWithId, {
        refererCell: this.cellCtx,
        driver,
        throwOriginalError: true,
      });

    } catch (errIrs) {
      console.log(errIrs)
      if (errIrs.header[CORR_ID_HEADER]) {
        throw errIrs;
      }

      throw errIrs.withHeaderItem(
        CORR_ID_HEADER,
        irqWithId.header[CORR_ID_HEADER],
      );
    }
  }

  private requestWithId(irq: IRQ) {
    if (irq.header[CORR_ID_HEADER]) {
      return irq;
    }

    if (!this.inCommingIrq?.header[CORR_ID_HEADER]) {
      return irq.withHeaderItem(CORR_ID_HEADER, dummyIdCount += 1);
    }

    return irq.withHeaderItem(
      CORR_ID_HEADER,
      this.inCommingIrq.header[CORR_ID_HEADER],
    );
  }

  private specifyDriver(irq: IRQ) {
    if (!this.cellCtx ) {
      return LOCAL_DRIVER;
    }

    const fromSpace = getResolvedCell(this.cellCtx.cellName).spaceId;
    const toSpace = getResolvedCell(irq.header.to.split(':')[0]).spaceId;

    if (fromSpace !== toSpace) {
      return 'remote'; // 'ssh', '***'
    }

    return LOCAL_DRIVER;
  }
}
