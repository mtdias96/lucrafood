import { Injectable } from '@kernel/decorators/Injactable';
import { env } from 'node:process';

@Injectable()
export class AppConfig {
  readonly database: AppConfig.Database;

  constructor() {
    this.database = {
      db: {
        baseURL: env.DATABASE_URL! ?? '',
      },
    };

  }
}

export namespace AppConfig {
  export type Database = {
    db: {
      baseURL: string
    }
  }

}
