import { Controller } from '@application/contracts/Controller';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class MeController extends Controller<'private', MeController.Response> {
  protected override async handle(request: Controller.Request<'private'>): Promise<Controller.Response<MeController.Response>> {
    const accountID = request.accountId;

    return {
      statusCode: 200,
      body: {
        email: accountID,
        name: '',
      },
    };
  }

}

export namespace MeController {
  export type Request = {
    id: string;
  }

  export type Response = {
    name: string;
    email: string
  }
}
