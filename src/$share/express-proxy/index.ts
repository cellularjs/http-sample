import { IRQ, IRS } from '@cellularjs/net';
import { Router, Response, Request } from 'express';
import { TRACE_ID_KEY } from '$share/const'
import { localTransporter } from '$share/transporter'
import { v4 as uuidv4 } from 'uuid';

// type CellList = keyof VirtualNetwork;
// type Route<CellName extends CellList = CellList> =
//   CellName extends string ? `${CellName}:${VirtualNetwork[CellName]}` : any;

export function expressProxy(): ExpressProxy {
  const router = Router();

  return new ExpressProxy(router);
}

class ExpressProxy {
  constructor(
    public router: Router,
  ) { }

  get(path: string, proxyTo) {
    return this._map('get', path, proxyTo);
  }

  post(path: string, proxyTo) {
    return this._map('post', path, proxyTo);
  }

  put(path: string, proxyTo) {
    return this._map('put', path, proxyTo);
  }

  delete(path: string, proxyTo) {
    return this._map('delete', path, proxyTo);
  }

  patch(path: string, proxyTo) {
    return this._map('patch', path, proxyTo);
  }

  options(path: string, proxyTo) {
    return this._map('options', path, proxyTo);
  }

  head(path: string, proxyTo) {
    return this._map('head', path, proxyTo);
  }

  private _map(method, path, proxyTo) {
    const self = this;

    return this.router[method](path, async function (req: Request, res: Response) {
      // use base62
      const irq = self.fromExpressRequest(req, proxyTo);
      let irs: IRS;

      try {
        irs = await localTransporter.send(irq);
      } catch (error) {
        irs = error;
      }

      self.toJsonResponse(irq, irs, res);
    });
  }

  private fromExpressRequest(req, proxyTo) {
    return new IRQ(
      { to: proxyTo, [TRACE_ID_KEY]: uuidv4() },
      { ...req.query, ...req.params, ...req.body },
    );
  }

  private toJsonResponse(irq: IRQ, irs: IRS, res: Response) {
    res.status(irs.header?.status || 500).header('X-Trace-Id', irq.header.id).json(irs.body);
  }
}
