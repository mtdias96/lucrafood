import { ErrorCode } from '../ErrorCode';
import { HttpError } from './HttpError';

export class Unauthorized extends HttpError {
  public override statusCode = 401;
  public override code = ErrorCode.UNAUTHORIZED;

  constructor(message = 'Unauthorized') {
    super(message);
  }
}
