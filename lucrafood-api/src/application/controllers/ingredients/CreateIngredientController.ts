import { Controller } from '@application/contracts/Controller';
import { IngredientUnit } from '@application/types/ingredientUnit';
import { CreateIngredientUseCase } from '@application/usecases/ingredients/CreateIngredientUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { IngredientsSchema, ingredientsSchema } from './schemas/ingredientsSchema';

@Injectable()
@Schema(ingredientsSchema)
export class CreateIngredientController extends Controller<'private', CreateIngredientController.Response> {

  constructor(private readonly createIngredientUseCase: CreateIngredientUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<'private', IngredientsSchema>): Promise<Controller.Response<CreateIngredientController.Response>> {
    const { accountId } = request;
    const { name, unit } = request.body.ingredients;

    const result = await this.createIngredientUseCase.execute({
      name,
      unit,
      accountId,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}
export namespace CreateIngredientController {
  export type Request = {
    name: string;
    unit: IngredientUnit;
  }

  export type Response = {
    ingredient: {
      id: string,
      name: string,
      unit: IngredientUnit,
      createdAt: Date
    }
  }
}
