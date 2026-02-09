import { Controller } from '@application/contracts/Controller';

import { CreateIngredientStoreUseCase } from '@application/usecases/ingredients/CreateIngredientStoreUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { storeBody, storeSchema } from './schema/storeSchema';

@Injectable()
@Schema(storeSchema)
export class CreateStoreController extends Controller<'private', CreateStoreController.Response> {

  constructor(private readonly createStoreUseCase: CreateIngredientStoreUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<'private', storeBody>): Promise<Controller.Response<CreateStoreController.Response>> {
    const { accountId } = request;
    const { name } = request.body.store;

    const result = await this.createStoreUseCase.execute({
      name,
      accountId,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}
export namespace CreateStoreController {
  export type Request = {
    name: string;
  }

  export type Response = {
    store: {
      id: string,
      name: string,
      createdAt: Date
    }
  }
}
