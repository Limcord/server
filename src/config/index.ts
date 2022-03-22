import env from "env-var";
type TStatus = "development" | "production";
export const config = {
  status: env.get("NODE_ENV").required(true).asString() as unknown as TStatus,
  epoch: 1643134102434,
  server: {
    port: env.get("port").default(3000).asPortNumber(),
  },
  database: {
    mongo: {
      uri: "mongodb://localhost:27017/",
      name: "water",
    },
  },
} as const;
export * from "./constants";
export * from "./logger";
