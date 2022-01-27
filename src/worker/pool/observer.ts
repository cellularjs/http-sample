type ObserverListener<Data> = (data: Data) => void;

export class Observer<Data> {
  private _subscribeCb: ObserverListener<Data> = () => null;

  update(data: Data) {
    this._subscribeCb(data);
  }

  subcribe(cb: ObserverListener<Data>) {
    this._subscribeCb = cb;
  }
}
