import express, { Application } from "express";
// import { App, extendMiddleware } from "@tinyhttp/app";
import { config, IConstants, logger } from "./config";
export interface IServerOptions {
  version: IConstants["versions"];
}
export class Server {
  readonly app: Application = express();
  private api: any;
  async setAPIsrc() {
    this.api = await import(`./api/${this.options.version}`);
  }
  constructor(private readonly options: IServerOptions) {}
  private registerControllers() {
    for (const [name, constructor] of Object.entries(this.api.controllers)) {
      this.api.registries.registerController(
        this.app,
        this.options,
        name,
        constructor
      );
    }
  }
  async registerDatabase() {
    await this.api.database.init();
  }
  onListen() {
    logger.info(`Listing on port ${config.server.port}`);
  }
  registerMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
  async init() {
    this.registerMiddlewares();
    await this.setAPIsrc();
    await this.registerDatabase();
    this.registerControllers();
    this.app.listen(config.server.port, this.onListen);
  }
}
