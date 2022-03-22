import { Request, Response } from "express";
import { Controller } from "../structures/Controller";

export class Test extends Controller("/test") {
  "GET /"(req: Request, res: Response) {
    res.send("tested.")
  }
}
