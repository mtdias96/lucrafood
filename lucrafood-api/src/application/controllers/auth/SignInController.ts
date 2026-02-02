
import { Controller } from '@application/contracts/Controller';

import { SignInUseCase } from '@application/usecases/auth/SignInUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { SignInBody, SignInSchema } from './schemas/SignInSchema';

@Injectable()
@Schema(SignInSchema)
export class SignInController extends Controller<'public', SignInController.Response> {
  constructor(private readonly signInUseCase: SignInUseCase) {
    super();
  }
  protected override async handle(request: Controller.Request<'public', SignInBody>): Promise<Controller.Response<SignInController.Response>> {
    const { accessToken } = await this.signInUseCase.execute({
      email: request.body.account.email,
      password: request.body.account.password,
    });

    return {
      statusCode: 200,
      body: {
        accessToken,
      },
    };
  }
}

export namespace SignInController {
  export type Response = {
    accessToken: string;
  }
}
