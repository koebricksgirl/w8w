import { createClient } from "redis";
import { config } from "../config/config";

export const redis = createClient({ url: config.redis.url });
