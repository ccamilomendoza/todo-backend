import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/modules/shared/infrastructure/db/*",
  dialect: "sqlite",
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: The DB_FILE_NAME variable should be define
    url: process.env.DB_FILE_NAME!,
  },
});
