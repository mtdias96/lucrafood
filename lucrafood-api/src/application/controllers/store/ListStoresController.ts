import { Controller } from '@application/contracts/Controller';
import { ListIngredientStoresUseCase } from '@application/usecases/ingredients/ListIngredientStoresUseCase';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class ListStoresController extends Controller<'private', ListStoresController.Response> {

  constructor(private readonly listStoresUseCase: ListIngredientStoresUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<'private', any>): Promise<Controller.Response<ListStoresController.Response>> {
    const { accountId } = request;

    const result = await this.listStoresUseCase.execute({
      accountId,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace ListStoresController {
  export type Response = {
    stores: {
      id: string,
      name: string,
      createdAt: Date
    }[]
  }
}
