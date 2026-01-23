/** biome-ignore-all lint/style/noNonNullAssertion: The DATABASE_URL must be defined */

import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/modules/shared/infrastructure/db/*",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
