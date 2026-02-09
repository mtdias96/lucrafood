import { Controller } from '@application/contracts/Controller';
import { CreateIngredientUseCase } from '@application/usecases/ingredients/CreateIngredientUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { PackageUnit } from '@shared/types/PackageUnit';
import { IngredientsBody, ingredientsSchema } from './schemas/ingredientsSchema';

@Injectable()
@Schema(ingredientsSchema)
export class CreateIngredientController extends Controller<'private', CreateIngredientController.Response> {

  constructor(private readonly createIngredientUseCase: CreateIngredientUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<'private', IngredientsBody>): Promise<Controller.Response<CreateIngredientController.Response>> {
    const { accountId } = request;
    const { name, baseUnit } = request.body.ingredients;

    const result = await this.createIngredientUseCase.execute({
      name,
      baseUnit,
      accountId,
    });

    return {
      statusCode: 201,
      body: result,
    };
  }
}
export namespace CreateIngredientController {
  export type Request = {
    name: string;
    baseUnit: PackageUnit;
  }

  export type Response = {
    ingredient: {
      id: string,
      name: string,
      baseUnit: PackageUnit,
      createdAt: Date
    }
  }
}
