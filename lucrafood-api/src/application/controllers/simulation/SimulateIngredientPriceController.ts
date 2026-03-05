import { Controller } from '@application/contracts/Controller';
import { SimulateIngredientPriceUseCase } from '@application/usecases/simulation/SimulateIngredientPriceUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { SimulateIngredientPriceBody, simulateIngredientPriceSchema } from './schemas/simulateIngredientPriceSchema';

@Injectable()
@Schema(simulateIngredientPriceSchema)
export class SimulateIngredientPriceController extends Controller<'private', SimulateIngredientPriceController.Response> {
  constructor(
    private readonly simulateIngredientPriceUseCase: SimulateIngredientPriceUseCase,
  ) {
    super();
  }

  protected override async handle({
    body,
    params,
    accountId,
  }: SimulateIngredientPriceController.Request): Promise<Controller.Response<SimulateIngredientPriceController.Response>> {
    const { ingredientId } = params;

    const result = await this.simulateIngredientPriceUseCase.execute({
      accountId,
      ingredientId,
      simulatedUnitPrice: body.simulatedUnitPrice,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace SimulateIngredientPriceController {
  export type Request = Controller.Request<
    'private',
    SimulateIngredientPriceBody,
    { ingredientId: string }
  >;

  export type Response = SimulateIngredientPriceUseCase.Output;
}
