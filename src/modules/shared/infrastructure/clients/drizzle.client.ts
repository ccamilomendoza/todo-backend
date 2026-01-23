import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

config({ path: ".env" }); // or .env.local

// biome-ignore lint/style/noNonNullAssertion: The DATABASE_URL must be defined
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
