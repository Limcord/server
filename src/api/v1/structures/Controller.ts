import { Router } from "express";
import { logger, Constants } from "../../../config";
export function Controller(basePath: string = "/") {
  return class {
    basePath = basePath;
    router: Router = Router();
    register(method: string, route: string, func: Function) {
      if (`${basePath}${route}`.endsWith("/")) {
        route = route.substring(0, route.length - 1);
      }
      logger.info(
        `${method.toUpperCase()} ${Constants.baseurl}${basePath}${route}`
      );
      (this.router as any)[method](`${basePath}${route}`, func);
    }
  };
}
