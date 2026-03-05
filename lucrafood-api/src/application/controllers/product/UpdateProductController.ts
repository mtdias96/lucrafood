import { Controller } from '@application/contracts/Controller';
import { UpdateProductUseCase } from '@application/usecases/product/UpdateProductUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { ProductUpdateBody, productUpdateSchema } from './schemas/productUpdateSchema';

@Injectable()
@Schema(productUpdateSchema)
export class UpdateProductController extends Controller<
  'private',
  UpdateProductController.Response
> {
  constructor(private readonly updateProductUseCase: UpdateProductUseCase) {
    super();
  }

  protected override async handle({
    body,
    params,
    accountId,
  }: UpdateProductController.Request): Promise<
    Controller.Response<UpdateProductController.Response>
  > {
    const { productId } = params;
    const { name, yieldQty, yieldUnit, targetMargin } = body.product;

    const result = await this.updateProductUseCase.execute({
      accountId,
      productId,
      name,
      yieldQty,
      yieldUnit,
      targetMargin,
    });

    return { statusCode: 200, body: result };
  }
}

export namespace UpdateProductController {
  export type Params = { productId: string };

  export type Request = Controller.Request<
    'private',
    ProductUpdateBody,
    Params
  >;

  export type Response = UpdateProductUseCase.Output;
}
