import { IRQ, IRS } from '@cellularjs/net';
import { Router, Response, Request } from 'express';
import { Transporter } from '$share/transporter'

// type CellList = keyof VirtualNetwork;
// type Route<CellName extends CellList = CellList> =
//   CellName extends string ? `${CellName}:${VirtualNetwork[CellName]}` : any;

export function expressProxy(): ExpressProxy {
  const router = Router();

  return new ExpressProxy(router);
}

class ExpressProxy {
  private static transporter = new Transporter();

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
    const { transporter } = ExpressProxy;

    return this.router[method](path, async function (req: Request, res: Response) {
      const irq = self.fromExpressRequest(req, proxyTo);
      let irs: IRS;

      try {
        irs = await transporter.send(irq);
      } catch(error) {
        irs = error;
      }

      self.toJsonResponse(irs, res);
    });
  }

  private fromExpressRequest(req, proxyTo) {
    return new IRQ(
      { to: proxyTo },
      { ...req.query, ...req.params, ...req.body },
    );
  }

  private toJsonResponse(irs: IRS, res: Response) {
    res.status(irs.header?.status || 500).json(irs.body);
  }
}
