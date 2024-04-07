import { Module, OnApplicationBootstrap } from "@nestjs/common";

import { Pool } from "pg";
import { DB_CONTEXT } from "./dependency-injection/injection-token";
import { ConfigService } from "@nestjs/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/schema";
import { ModuleRef } from "@nestjs/core";
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

        return drizzle(pool, { schema });
      },
    },
  ],
})
export class DatabaseModule implements OnApplicationBootstrap {
  constructor(private moduleRef: ModuleRef) {}

  async onApplicationBootstrap() {
    const dbContext = await this.moduleRef.resolve(DB_CONTEXT);

    await migrate(dbContext, { migrationsFolder: "src/core/database/migrations" });
  }
}
