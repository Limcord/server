import { Request, Response } from "express";
import { Controller } from "../structures/Controller";

export class Test extends Controller("test") {
  "GET /"(req: Request, res: Response) {
    res.send("test");
  }

  "GET /test"(req: Request, res: Response) {
    res.send("test2");
  }
}
