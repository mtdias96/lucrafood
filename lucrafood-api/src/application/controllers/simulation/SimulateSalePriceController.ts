import { Controller } from '@application/contracts/Controller';
import { SimulateSalePriceUseCase } from '@application/usecases/simulation/SimulateSalePriceUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { SimulateSalePriceBody, simulateSalePriceSchema } from './schemas/simulateSalePriceSchema';

@Injectable()
@Schema(simulateSalePriceSchema)
export class SimulateSalePriceController extends Controller<'private', SimulateSalePriceController.Response> {
  constructor(
    private readonly simulateSalePriceUseCase: SimulateSalePriceUseCase,
  ) {
    super();
  }

  protected override async handle({
    body,
    params,
    accountId,
  }: SimulateSalePriceController.Request): Promise<Controller.Response<SimulateSalePriceController.Response>> {
    const { productId } = params;

    const result = await this.simulateSalePriceUseCase.execute({
      accountId,
      productId,
      simulatedSalePrice: body.simulatedSalePrice,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace SimulateSalePriceController {
  export type Request = Controller.Request<
    'private',
    SimulateSalePriceBody,
    { productId: string }
  >;

  export type Response = SimulateSalePriceUseCase.Output;
}
