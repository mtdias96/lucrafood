import { ErrorCode } from '../ErrorCode';
import { DomainError } from './DomainError';

export class InvalidSalePriceError extends DomainError {
  public override statusCode = 400;
  public override code = ErrorCode.INVALID_SALE_PRICE;

  constructor(message = 'Sale price must be greater than zero') {
    super(message);
  }
}
