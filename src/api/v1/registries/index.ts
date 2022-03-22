import { IServerOptions } from "../../../server";
import { Application } from "express";

const getAllMethods = (obj: any) => {
  let props: string[] = [];

  do {
    const l = Object.getOwnPropertyNames(obj)
      .concat(Object.getOwnPropertySymbols(obj).map((s) => s.toString()))
      .sort()
      .filter(
        (p, i, arr) =>
          p != "init" &&
          p != "basePath" &&
          p != "router" &&
          p != "register" &&
          typeof obj[p] === "function" && //only the methods
          p !== "constructor" && //not the constructor
          (i == 0 || p !== arr[i - 1]) && //not overriding in this prototype
          props.indexOf(p) === -1 //not overridden in a child
      );
    props = props.concat(l);
  } while (
    (obj = Object.getPrototypeOf(obj)) && //walk-up the prototype chain
    Object.getPrototypeOf(obj) //not the the Object prototype methods (hasOwnProperty, etc...)
  );

  return props;
};

export function registerController(
  app: Application,
  options: IServerOptions,
  name: string,
  constructor: new () => any
) {
  const controller = new constructor();
  for (const funcName of getAllMethods(controller)) {
    const [method, route] = funcName.split(/(?<=^\S+)\s/) as string[];
    controller.register(method.toLowerCase(), route, controller[funcName]);
  }
  app.use("/", controller.router);
}
