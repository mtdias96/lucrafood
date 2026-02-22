import { Controller } from '@application/contracts/Controller';
import { UpdateProductSalePriceUseCase } from '@application/usecases/product/UpdateProductSalePriceUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { ProductUpdateSalePiceBody, productUpdateSalePiceSchema } from './schemas/productUpdateSalePiceSchema';

@Injectable()
@Schema(productUpdateSalePiceSchema)
export class UpdateProductSalePriceController extends Controller<
  'private',
  UpdateProductSalePriceController.Response
> {
  constructor(private readonly updateProductSalePriceUseCase: UpdateProductSalePriceUseCase) {
    super();
  }

  protected override async handle({
    body,
    params,
    accountId,
  }: UpdateProductSalePriceController.Request): Promise<
    Controller.Response<UpdateProductSalePriceController.Response>
  > {
    const { productId } = params;
    const salePrice = body.product.salePrice;

    await this.updateProductSalePriceUseCase.execute({ salePrice, productId, accountId });

    return { statusCode: 200 };
  }
}

export namespace UpdateProductSalePriceController {
  export type Params = { productId: string };

  export type Request = Controller.Request<
    'private',
    ProductUpdateSalePiceBody,
    Params
  >;

  export type Response = void;
}
