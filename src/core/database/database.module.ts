import { Inject, Module, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";

import { Pool } from "pg";
import { DB_CONTEXT } from "./dependency-injection/injection-token";
import { ConfigService } from "@nestjs/config";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/schema";
import { DbType } from "./schema/db-type";
import { migrate } from "drizzle-orm/node-postgres/migrator";

@Module({
  providers: [
    {
      provide: DB_CONTEXT,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get("CONNECTION_STRING");
        const pool = new Pool({
          connectionString,
          ssl: false,
        });

        const dbContext: DbType = drizzle(pool, { schema, logger: true });
        return dbContext;
      },
    },
  ],
  exports: [DB_CONTEXT],
})
export class DatabaseModule implements OnModuleInit {
  constructor(@Inject(DB_CONTEXT) private dbContext: NodePgDatabase) {}

  async onModuleInit() {
    await migrate(this.dbContext, { migrationsFolder: "src/core/database/migrations" });
  }
}
