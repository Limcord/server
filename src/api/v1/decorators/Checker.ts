import { ValidationSchema } from "fastest-validator";
import { validator } from "../utils";
import types from "node:util/types";
import { NextFunction, Request, Response } from "express";

export function Check(
  options: Record<string, string[] | string> | ValidationSchema,
  where: keyof Request
) {
  return (
    target: Object,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const checker = validator.compile(options);
    const originalMethod = descriptor.value;
    if (types.isAsyncFunction(originalMethod)) {
      descriptor.value = async function (
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        const isValid = checker(req[where]);
        if (isValid != true) {
        return res.status(400).send(isValid);
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
        const isValid = checker(req[where]);
        if (isValid != true) {
          return res.status(400).send(isValid);
        }
        if (res.headersSent) return;
        const result =  originalMethod.apply(this, [req, res, next]);
        return result;
      };
    }
  };
}
