import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.CONNECTION_STRING,
  },
  verbose: false,
  strict: true,
  out: "./migrations",
});
