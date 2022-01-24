import { Router } from "express";
export function Controller(basePath: string) {
  return class {
     router: Router = Router();
    register(method: string, route, func: Function) {
        this.router[method](`/${basePath}${route}`, func)
    }
 
  };
}
