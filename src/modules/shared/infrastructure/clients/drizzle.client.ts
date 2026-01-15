import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";

// biome-ignore lint/style/noNonNullAssertion: The env variable should be defined
export const db = drizzle({ connection: { url: process.env.DB_FILE_NAME! } });
