import { Controller } from '@application/contracts/Controller';
import { DeleteProductUseCase } from '@application/usecases/product/DeleteProductUseCase';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class DeleteProductController extends Controller<
  'private',
  DeleteProductController.Response
> {
  constructor(private readonly deleteProductUseCase: DeleteProductUseCase) {
    super();
  }

  protected override async handle({
    params,
    accountId,
  }: DeleteProductController.Request): Promise<
    Controller.Response<DeleteProductController.Response>
  > {
    const { productId } = params;

    await this.deleteProductUseCase.execute({ accountId, productId });

    return { statusCode: 204 };
  }
}

export namespace DeleteProductController {
  export type Params = { productId: string };

  export type Request = Controller.Request<
    'private',
    Record<string, unknown>,
    Params
  >;

  export type Response = void;
}
