import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";

import { DB_CONTEXT } from "./constants/injection-token";
import * as schema from "./schema/schema";
import { DbType } from "./schema/db-type";

@Module({
  providers: [
    {
      provide: DB_CONTEXT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.get("CONNECTION_STRING") as string;
        const pool = new Pool({
          connectionString,
          keepAlive: true,
          ssl: false,
        });

        const dbContext: DbType = drizzle(pool, { schema, logger: false });
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
