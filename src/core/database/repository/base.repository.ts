import { DbType, TransactionType } from "../schema/db-type";
import { PgTransactionConfig } from "drizzle-orm/pg-core";

export class BaseRepository {
  constructor(protected dbContext: DbType) {}

  withTransaction<T>(transaction: (tx: TransactionType) => Promise<T>, config?: PgTransactionConfig): Promise<T> {
    return this.dbContext.transaction(transaction, config);
  }
}
