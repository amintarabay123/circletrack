import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const sk = process.env.CLERK_SECRET_KEY ?? "";
const liveSk = process.env.CLERK_LIVE_SECRET_KEY ?? "";
const pk = process.env.CLERK_PUBLISHABLE_KEY ?? "";
logger.info({
  CLERK_SECRET_KEY: sk ? `${sk.slice(0, 10)}...${sk.slice(-4)}` : "NOT SET",
  CLERK_LIVE_SECRET_KEY: liveSk ? `${liveSk.slice(0, 10)}...${liveSk.slice(-4)}` : "NOT SET",
  CLERK_PUBLISHABLE_KEY: pk ? `${pk.slice(0, 10)}...` : "NOT SET",
}, "Clerk key config at startup");

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
