import { logger, config } from "../../../config";
import { User } from "../entities";
import Redis from 'ioredis'
import mongoose, { connection } from "mongoose";

async function connect(uri: string) {
  return new Promise((res, rej) =>
    mongoose.connect(uri, {}, (err) => {
      if (err) rej(err);
      res(res);
    })
  );
}

export const createRedisConnection = () => {
	// return new Redis(config.database.redis)
}


async function registerModels() {
  await new User().init();
}

export async function init() {
  try {
    await connect(config.database.mongo.uri + config.database.mongo.name);
    await registerModels()
    logger.info("Database has been initilized");
  } catch (error) {
    logger.error(error);
  }
}
