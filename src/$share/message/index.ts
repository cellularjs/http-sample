import { IRS } from '@cellularjs/net';

type ErrorCode = string;

interface ErrorData {
  src: string;
  err: ErrorCode;
  [ext: string]: any;
}

export class BadRequest extends IRS {
  constructor(errs: ErrorData[]) {
    super(
      { status: 400 },
      {
        err: 'BAD_REQUEST',
        errs,
      },
    );
  }
}

export class ResourceNotFound extends IRS {
  constructor(msg: string = undefined) {
    super({ status: 404 }, { err: 'RESOURCE_NOT_FOUND', msg });
  }
}
