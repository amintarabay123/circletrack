import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { CLERK_PROXY_PATH, clerkProxyMiddleware } from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Replit's auth integration keeps CLERK_PUBLISHABLE_KEY as pk_test_... (dev Replit instance).
// The production iOS app sends JWTs from the live Clerk instance (circletrack.islandtacosbvi.com).
// clerkMiddleware uses the publishable key to derive the JWKS endpoint — a pk_test/sk_live
// mismatch causes it to look up the wrong instance and reject every live JWT with 401.
// CLERK_LIVE_PUBLISHABLE_KEY overrides this; the hardcoded value is the safe fallback
// (publishable keys are not secret — they are already baked into the iOS binary in eas.json).
// Replit manages CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY for its own Clerk instance
// (i-phone-organizer.replit.app). The iOS app uses a separate live Clerk instance
// (circletrack.islandtacosbvi.com). CLERK_LIVE_SECRET_KEY must be set in Replit secrets
// to the sk_live_... key from the circletrack.islandtacosbvi.com Clerk dashboard.
const LIVE_PK = "pk_live_Y2xlcmsuY2lyY2xldHJhY2suaXNsYW5kdGFjb3NidmkuY29tJA";
app.use(clerkMiddleware({
  publishableKey: LIVE_PK,
  secretKey: process.env.CLERK_LIVE_SECRET_KEY,
}));

app.use("/api", router);

app.get("/support", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CircleTrack Support</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 640px; margin: 60px auto; padding: 0 24px; color: #141c2e; background: #f6f8fb; }
    h1 { color: #18a574; font-size: 2rem; margin-bottom: 8px; }
    h2 { font-size: 1.1rem; margin-top: 32px; color: #141c2e; }
    p, li { line-height: 1.7; color: #444; }
    a { color: #18a574; }
    .card { background: #fff; border-radius: 16px; padding: 24px; margin-top: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  </style>
</head>
<body>
  <h1>CircleTrack Support</h1>
  <p>CircleTrack helps you manage ROSCAs, tandas, and savings circles with ease.</p>

  <div class="card">
    <h2>Frequently Asked Questions</h2>
    <h2>How do I create a new circle?</h2>
    <p>Tap the <strong>+</strong> button on the My Circles screen, fill in the circle name, contribution amount, frequency, and number of members, then tap Create.</p>

    <h2>How do I record a payment?</h2>
    <p>Open a circle, find the member in the payment list, and tap <strong>Record Payment</strong> next to their name.</p>

    <h2>How do I add members?</h2>
    <p>Inside a circle, tap <strong>Add Member</strong> and enter their name and contact details.</p>

    <h2>What is a ROSCA / Tanda?</h2>
    <p>A rotating savings and credit association (ROSCA), known as a "tanda" in Latin America, is a group savings system where each member contributes a fixed amount each cycle, and one member receives the full pot per cycle.</p>
  </div>

  <div class="card">
    <h2>Contact Support</h2>
    <p>Need help? Email us at <a href="mailto:support@circletrack.app">support@circletrack.app</a> and we will respond within 1–2 business days.</p>
  </div>
</body>
</html>`);
});

export default app;
