import types from "node:util/types";
import { RateLimiterMemory } from "rate-limiter-flexible";
import ms from "ms";
import { NextFunction, Request, Response } from "express";

export function Limit(opts: string) {
  return (
    target: Object,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const [max, interval] = opts.split(/\/|--/).map((s) => s.trim());
    const limiter = new RateLimiterMemory({
      points: parseInt(max),
      duration: ms(interval) / 1000,
      keyPrefix: target.constructor.name.toLowerCase(),
    });

    const originalMethod = descriptor.value;
    if (types.isAsyncFunction(originalMethod)) {
      descriptor.value = async function (
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        const key =
          req.ip ||
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress;
        const data = await limiter
          .consume(key as string)
          .then(() => false)
          .catch((res) => res);
        if (!data) {
          if (res.headersSent) return;

          const result = await originalMethod.apply(this, [req, res, next]);
          return result;
        }
        if (!res.headersSent)
          res
            .setHeader("Retry-After", data.msBeforeNext / 1000)
            .setHeader("X-RateLimit-Limit", max)
            .setHeader("X-RateLimit-Remaining", data.remainingPoints)
            .setHeader(
              "X-RateLimit-Reset",
              new Date(Date.now() + data.msBeforeNext).toString()
            );

        res.status(429).json({
          message: "Too many requests, please try again later.",
          retry_after: data.msBeforeNext / 1000,
        });
      };
    } else {
      descriptor.value = async function (
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        console.log("wat");

        const key =
          req.ip ||
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress;
        const data = await limiter
          .consume(key as string)
          .then(() => false)
          .catch((res) => res);
        if (!data) {
          if (res.headersSent) return;
          const result = originalMethod.apply(this, [req, res, next]);
          return result;
        }
        if (!res.headersSent)
          res
            .setHeader("Retry-After", data.msBeforeNext / 1000)
            .setHeader("X-RateLimit-Limit", max)
            .setHeader("X-RateLimit-Remaining", data.remainingPoints)
            .setHeader(
              "X-RateLimit-Reset",
              new Date(Date.now() + data.msBeforeNext).toString()
            );

        res.status(429).json({
          message: "Too many requests, please try again later.",
          retry_after: data.msBeforeNext / 1000,
        });
      };
    }

    return descriptor;
  };
}
