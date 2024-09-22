import { type Config } from "drizzle-kit";

import { env } from "creasybear/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["lumina_*"],
} satisfies Config;
