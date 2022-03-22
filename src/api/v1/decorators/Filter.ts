import { ValidationSchema } from "fastest-validator";
import types from "node:util/types";
import { NextFunction, Request, Response } from "express";

export function Filter(
  options: Record<string, (...args: any[]) => any>,
  where: keyof Request
) {
  return (
    target: Object,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalMethod = descriptor.value;
    if (types.isAsyncFunction(originalMethod)) {
      descriptor.value = async function (
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        for (const key of Object.keys(options)) {
            req[where][key] = options[key](req[where][key]);
          }
        if (res.headersSent) return;
        const result = await originalMethod.apply(this, [req, res, next]);
        return result;
      };
    } else {
      descriptor.value = function (
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        for (const key of Object.keys(options)) {
          req[where][key] = options[key](req[where][key]);
        }
        if (res.headersSent) return;
        const result = originalMethod.apply(this, [req, res, next]);
        return result;
      };
    }
  };
}
