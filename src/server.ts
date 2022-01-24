import express, { Application } from "express";
// import { App, extendMiddleware } from "@tinyhttp/app";
import { config, IConstants, logger } from "./config";
export interface IServerOptions {
  version: IConstants["versions"];
}
export class Server {
  readonly app: Application = express();
  constructor(private readonly options: IServerOptions) {}
  private async registerControllers() {
    const api = await import(`./api/${this.options.version}`);
    for (const [name, constructor] of Object.entries(api.controllers)) {
      api.registries.registerController(
        this.app,
        this.options,
        name,
        constructor
      );
    }
  }
  onListen() {
    logger.info(`Listing on port ${config.server.port}`);
  }
  init() {
    this.registerControllers();
    this.app.listen(config.server.port, this.onListen);
  }
}
