import { ErrorCode } from '../ErrorCode';
import { HttpError } from './HttpError';

export class Conflict extends HttpError {
  public override statusCode = 409;
  public override code = ErrorCode.CONFLICT;

  constructor(message = 'Conflict') {
    super(message);
  }
}
