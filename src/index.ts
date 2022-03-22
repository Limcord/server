console.clear();
import "dotenv/config";

import { config, logger } from "./config";
import { Server } from "./server";
logger.info(`App is working on ${config.status.toUpperCase()} mode.`);
(async () => {
  await new Server({ version: "v1" }).init();
})();
