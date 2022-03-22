import mongoose, { model, Schema, SchemaDefinitionProperty } from "mongoose";
import { logger } from "../../../config";
import { Snowflake } from "../utils";
export abstract class Base {
  id = Snowflake.generate();

  get tableName(): string {
    return this.constructor.name.toLowerCase();
  }
  static get tableName(): string {
    return this.name.toLowerCase();
  }

  async init() {
    let skips = ["model"];
    let toSchema: Record<string, SchemaDefinitionProperty<undefined>> = {};
    for (const [key, value] of Object.entries(
      new (this.constructor as any)()
    )) {
      if (skips.includes(key)) continue;
      (toSchema[key] as any) = value;
    }
    toSchema.id = String;
    model(this.tableName, new Schema(toSchema as any));
  }

  async save() {
    const data = new mongoose.models[this.tableName](this);
    await data.save();
    return data;
  }

}
