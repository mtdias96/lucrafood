import { Schema } from '@/kernel/Schema';

import { Controller } from '@/application/contracts/Controller';
import { SignInBody, SignInSchema } from './schemas/SignInSchema';

@Schema(SignInSchema)
export class SignInController extends Controller<unknown> {
  protected override async handle(request: Controller.Request<SignInBody>): Promise<Controller.Response<unknown>> {
    return {
      statusCode: 200,
      body: request.body.account,
    };
  }

}
