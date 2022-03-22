import { models } from "mongoose";
import { buffer } from "node:stream/consumers";
import { Base } from ".";
import { Snowflake } from "../utils";
type ExcludeFunctionPrototypeMethods<T extends () => any> = {
  [K in Exclude<keyof T, keyof Function>]: T[K];
};

export interface UserOptions {
  username: string;
  email: string;
  password: string;
  verified?: boolean;
}

export class User extends Base {
  constructor() {
    super();
  }

  username = String;
  email = String;
  password = String;
  token = String;
  verified = Boolean;

  static from(opts: UserOptions) {
    const user = new User();
    const token = Snowflake.createToken(user.id, Date.now(), 10);
    return Object.assign(user, { token, ...opts });
  }

  static async findOne(options: Partial<UserOptions>) {
    const model = models[this.tableName];
    return await model.findOne(options);
  }
}