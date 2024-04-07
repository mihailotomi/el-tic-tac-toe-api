import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export type DbType = NodePgDatabase<typeof schema>;
