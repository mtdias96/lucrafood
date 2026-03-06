import { Registry } from '@kernel/di/Registry';

import { CheckAlertsController } from '@application/controllers/alerts/CheckAlertsController';
import { ListAlertsController } from '@application/controllers/alerts/ListAlertsController';
import { MarkAlertAsReadController } from '@application/controllers/alerts/MarkAlertAsReadController';

const resolve = Registry.getInstace().resolve.bind(Registry.getInstace());

export const makeListAlertsController = () => resolve(ListAlertsController);
export const makeMarkAlertAsReadController = () => resolve(MarkAlertAsReadController);
export const makeCheckAlertsController = () => resolve(CheckAlertsController);
