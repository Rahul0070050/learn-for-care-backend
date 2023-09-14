import { createClient } from "redis";
import { config } from "dotenv";

config();

export const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

export function getRedisConnection(done: CallableFunction) {
  client.on("error", (err) => {
    if (err) return done(err);
  });

  client
    .connect()
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
}
