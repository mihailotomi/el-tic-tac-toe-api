import { NodePgDatabase, NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { ExtractTablesWithRelations } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";

export type DbType = NodePgDatabase<typeof schema>;

export type SchemaType = typeof import("../schema/schema");

export type SchemaTablesType = ExtractTablesWithRelations<SchemaType>;

export type TransactionType = PgTransaction<NodePgQueryResultHKT, SchemaType, SchemaTablesType>;
