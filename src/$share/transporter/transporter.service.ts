import { Injectable } from '@cellularjs/di';
import { send, CellContext, getResolvedCell, IRQ, LOCAL_DRIVER } from '@cellularjs/net';
import { TRACE_ID_KEY } from '$share/const'

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
      if (!errIrs.header) {
        throw errIrs;
      }

      if (errIrs.header[TRACE_ID_KEY]) {
        throw errIrs;
      }

      throw errIrs.withHeaderItem(
        TRACE_ID_KEY,
        irqWithId.header[TRACE_ID_KEY],
      );
    }
  }

  private requestWithId(irq: IRQ) {
    if (irq.header[TRACE_ID_KEY]) {
      return irq;
    }

    // if (!this.inCommingIrq?.header[TRACE_ID_KEY]) {
    //   return irq.withHeaderItem(TRACE_ID_KEY, uuidv4());
    // }

    return irq.withHeaderItem(
      TRACE_ID_KEY,
      this.inCommingIrq.header[TRACE_ID_KEY],
    );
  }

  private specifyDriver(irq: IRQ) {
    if (!this.cellCtx) {
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
