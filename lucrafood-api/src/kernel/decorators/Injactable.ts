import { Registry } from '@kernel/di/Registry';
import { Constructor } from '@shared/types/Constructor';

export function Injectable(): ClassDecorator {
  return (target) => {
    Registry.getInstace().register(target as unknown as Constructor);
  };
}
