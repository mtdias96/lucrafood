import { Controller } from '@application/contracts/Controller';
import { CreateIngredientStoreUseCase } from '@application/usecases/ingredients/CreateIngredientStoreUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { IngredientStoreBody, IngredientStoreSchema } from './schemas/ingredientStoreSchema';

@Injectable()
@Schema(IngredientStoreSchema)
export class CreateIngredientStoreController extends Controller<'private', CreateIngredientStoreController.Response> {

  constructor(private readonly createIngredientStoreUseCase: CreateIngredientStoreUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<'private', IngredientStoreBody>): Promise<Controller.Response<CreateIngredientStoreController.Response>> {
    const { name, ingredientId } = request.body.ingredientStore;

    const result = await this.createIngredientStoreUseCase.execute({
      name,
      ingredientId,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}
export namespace CreateIngredientStoreController {
  export type Request = {
    name: string;
    ingredientId: string;
  }

  export type Response = {
    ingredientStore: {
      id: string,
      name: string,
      ingredientId: string
      createdAt: Date
    }
  }
}
