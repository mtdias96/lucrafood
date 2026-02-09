import { ErrorCode } from '../ErrorCode';

export abstract class HttpError extends Error {
  public abstract statusCode: number;
  public abstract code: ErrorCode;

  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
