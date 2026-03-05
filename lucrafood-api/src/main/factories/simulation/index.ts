import { Registry } from '@kernel/di/Registry';

import { SimulateSalePriceController } from '@application/controllers/simulation/SimulateSalePriceController';
import { SimulateIngredientPriceController } from '@application/controllers/simulation/SimulateIngredientPriceController';

const resolve = Registry.getInstace().resolve.bind(Registry.getInstace());

export const makeSimulateSalePriceController = () => resolve(SimulateSalePriceController);
export const makeSimulateIngredientPriceController = () => resolve(SimulateIngredientPriceController);
