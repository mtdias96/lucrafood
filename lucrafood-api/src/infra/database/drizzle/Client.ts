
import { Injectable } from '@kernel/decorators/Injactable';
import { AppConfig } from '@shared/config/AppConfig';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '../schemas/index';

@Injectable()
export class DrizzleClient {
  private readonly pool: Pool;
  private readonly db;

  constructor(private readonly config: AppConfig) {
    this.pool = new Pool({ connectionString: this.config.database.db.baseURL });
    this.db = drizzle(this.pool, { schema });
  }

  get client() {
    return this.db;
  }

  async close() {
    await this.pool.end();
  }
}
