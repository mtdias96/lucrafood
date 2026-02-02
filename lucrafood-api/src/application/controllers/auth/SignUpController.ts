;
import { Controller } from '@application/contracts/Controller';
import { SignUpUseCase } from '@application/usecases/auth/SignUpUseCase';

import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { SignUpBody, SignUpSchema } from './schemas/SignUpSchema';

@Injectable()
@Schema(SignUpSchema)
export class SignUpController extends Controller<'public', SignUpController.Response> {

  constructor(private readonly signUpUseCase: SignUpUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<'public', SignUpBody>): Promise<Controller.Response<SignUpController.Response>> {
    const { accessToken } = await this.signUpUseCase.execute({
      email: request.body.account.email,
      name: request.body.account.name,
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

export namespace SignUpController {
  export type Response = {
    accessToken: string;
  }
}
