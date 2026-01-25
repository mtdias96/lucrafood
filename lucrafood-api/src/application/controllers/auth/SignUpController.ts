import { Schema } from '@/kernel/Schema';

import { Controller } from '@/application/contracts/Controller';
import { SignUpBody, SignUpSchema } from './schemas/SignUpSchema';

@Schema(SignUpSchema)
export class SignUpController extends Controller<unknown> {
  protected override async handle(request: Controller.Request<SignUpBody>): Promise<Controller.Response<unknown>> {
    return {
      statusCode: 200,
      body: request.body.account,
    };
  }

}
