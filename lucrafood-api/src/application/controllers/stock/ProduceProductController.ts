import { Controller } from '@application/contracts/Controller';
import { ProduceProductUseCase } from '@application/usecases/stock/ProduceProductUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { produceSchema, ProduceBody } from './schemas/produceSchema';

@Injectable()
@Schema(produceSchema)
export class ProduceProductController extends Controller<'private', ProduceProductController.Response> {

  constructor(
    private readonly produceProductUseCase: ProduceProductUseCase,
  ) {
    super();
  }

  protected override async handle({ accountId, params, body }: ProduceProductController.Request): Promise<Controller.Response<ProduceProductController.Response>> {
    const { productId } = params;
    const { quantity } = body.produce;

    const result = await this.produceProductUseCase.execute({
      accountId,
      productId,
      quantity,
    });

    return {
      statusCode: 201,
      body: result,
    };
  }
}

export namespace ProduceProductController {
  export type Request = Controller.Request<
    'private',
    ProduceBody,
    { productId: string }
  >;

  export type Response = ProduceProductUseCase.Output;
}
