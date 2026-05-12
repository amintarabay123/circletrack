import { execSync } from "child_process";
import { existsSync } from "fs";

const CHROMIUM = "/nix/store/5afrhwm7zqn1vb7p5z1mc2rkh2grsfgz-ungoogled-chromium-138.0.7204.100/bin/chromium";
const BASE = "http://localhost:80/__mockup/preview";
const W = 1284;
const H = 2778;

const shots = [
  { slug: "screenshot-circles-list-en",   out: "screenshots/iphone65-1-circles-list-en.jpg" },
  { slug: "screenshot-circle-detail-en",  out: "screenshots/iphone65-2-circle-detail-en.jpg" },
  { slug: "screenshot-add-member-en",     out: "screenshots/iphone65-3-add-member-en.jpg" },
  { slug: "screenshot-record-payment-en", out: "screenshots/iphone65-4-payment-en.jpg" },
];

for (const { slug, out } of shots) {
  console.log(`Capturing ${slug}...`);
  const url = `${BASE}/${slug}`;
  const cmd = [
    CHROMIUM,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-software-rasterizer",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=5000",
    `--window-size=${W},${H}`,
    `--screenshot=${out}`,
    `"${url}"`,
  ].join(" ");
  try {
    execSync(cmd, { timeout: 25000, stdio: "pipe" });
    console.log(`  ✓ ${out}`);
  } catch (e) {
    console.error(`  ✗ failed: ${e.message}`);
  }
}

execSync(`identify -format "%f: %wx%h\\n" screenshots/iphone65-*-en.jpg`, { stdio: "inherit" });
