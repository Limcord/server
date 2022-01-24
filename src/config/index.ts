
import env from "env-var";
type TStatus = "development" | "production";
export const config = {
  status: env.get("NODE_ENV").required(true).asString() as unknown as TStatus,
  server: {
    port: env.get("port").default(3000).asPortNumber(),
  },
} as const;
export * from "./constants";
export * from "./logger";
