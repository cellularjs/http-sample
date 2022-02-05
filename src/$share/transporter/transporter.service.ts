import { Injectable } from '@cellularjs/di';
import { send, CellContext, getResolvedCell, IRQ, LOCAL_DRIVER } from '@cellularjs/net';
import { TRACE_ID_KEY } from '$share/const'
import { sendViaWorker } from '$share/worker';

@Injectable()
export class Transporter {
  constructor(
    private cellCtx?: CellContext,
    private inCommingIrq?: IRQ,
  ) { }

  sendViaWorker = async (irq: IRQ) => {
    const modifiedIRQ = this.modifyIRQ(irq);
    return sendViaWorker(modifiedIRQ);
  }

  send = async (irq: IRQ) => {
    const modifiedIRQ = this.modifyIRQ(irq);

    try {
      const driver = this.specifyDriver(irq);
      return await send(modifiedIRQ, {
        driver,
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
        modifiedIRQ.header[TRACE_ID_KEY],
      );
    }
  }

  private modifyIRQ(irq: IRQ) {
    if (irq.header[TRACE_ID_KEY]) {
      return irq.withHeaderItem('referer', this.cellCtx?.cellName);
    }

    // if (!this.inCommingIrq?.header[TRACE_ID_KEY]) {
    //   return irq.withHeaderItem(TRACE_ID_KEY, uuidv4());
    // }

    return irq
      .withHeaderItem('referer', this.cellCtx?.cellName)
      .withHeaderItem(
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
