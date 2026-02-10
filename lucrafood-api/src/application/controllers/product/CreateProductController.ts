import { Controller } from '@application/contracts/Controller';
import { CreateProductUseCase } from '@application/usecases/product/CreateProductUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { PackageUnit } from '@shared/types/PackageUnit';
import { ProductBody, productSchema } from './schemas/productSchema';

@Injectable()
@Schema(productSchema)
export class CreateProductController extends Controller<'private', CreateProductController.Response> {

  constructor(private readonly createProductUseCase: CreateProductUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<'private', ProductBody>): Promise<Controller.Response<CreateProductController.Response>> {
    const { accountId } = request;
    const { name, yieldQty, yieldUnit } = request.body.product;

    const result = await this.createProductUseCase.execute({
      accountId,
      name,
      yieldQty,
      yieldUnit,
    });

    return {
      statusCode: 201,
      body: result,
    };
  }
}
export namespace CreateProductController {
  export type Request = {
    name: string;
    baseUnit: PackageUnit;
  }

  export type Response = {
    product: {
      id: string,
      name: string;
      yieldQty: number,
      yieldUnit: PackageUnit
      createdAt: Date
    }
  }
}
