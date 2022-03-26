import { Injectable } from '@cellularjs/di';
import { send, getResolvedCell, IRQ, LOCAL_DRIVER } from '@cellularjs/net';
import { transfer } from '@cellularjs/worker';
import { TRACE_ID_KEY } from '$share/const'

@Injectable()
export class Transporter {
  constructor(
    private inCommingIrq?: IRQ,
  ) { }

  sendViaWorker = async (irq: IRQ) => {
    const modifiedIRQ = this.modifyIRQ(irq);
    return transfer(modifiedIRQ);
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
      return irq.withHeaderItem('referer', this.inCommingIrq?.header.to);
    }

    // if (!this.inCommingIrq?.header[TRACE_ID_KEY]) {
    //   return irq.withHeaderItem(TRACE_ID_KEY, uuidv4());
    // }

    return irq
      .withHeaderItem('referer', this.inCommingIrq?.header.to)
      .withHeaderItem(
        TRACE_ID_KEY,
        this.inCommingIrq.header[TRACE_ID_KEY],
      );
  }

  private specifyDriver(irq: IRQ) {
    if (!this.inCommingIrq) {
      return LOCAL_DRIVER;
    }

    const fromCell = this.inCommingIrq.header.to.split(':')[0];
    const toCell = irq.header.to.split(':')[0];

    const fromSpace = getResolvedCell(fromCell).spaceId;
    const toSpace = getResolvedCell(toCell).spaceId;

    if (fromSpace !== toSpace) {
      return 'remote'; // 'ssh', '***'
    }

    return LOCAL_DRIVER;
  }
}
