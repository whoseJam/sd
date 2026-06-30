#!/usr/bin/env bun
// Batch snapshot: launch ONE chromium, navigate each (url, output) pair, screenshot.
// For reveal decks: walks slides via location.hash (#/N), stitches grid.
// For animations: navigates via window-message protocol the framework uses for pause stepping.
// Input: tab-separated lines on stdin: kind\turl\toutput\tmax
//   kind = "deck" | "anim"
//   max = upper bound on slides/pauses (we clamp)

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { chromium, type Page } from "playwright";
import sharp from "sharp";

const VIEWPORT = { width: 1200, height: 690 };
const DPR = 2;
const IDLE_MS = 800;
const READY_TIMEOUT_MS = 15000;
const PER_URL_TIMEOUT_MS = 45000;

interface Job {
  kind: "deck" | "anim";
  url: string;
  output: string;
  max: number;
}

async function readJobs(): Promise<Job[]> {
  const text = await Bun.stdin.text();
  const jobs: Job[] = [];
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    const [kind, url, output, maxStr] = line.split("\t");
    if (kind !== "deck" && kind !== "anim") continue;
    jobs.push({
      kind: kind as "deck" | "anim",
      url,
      output,
      max: Number(maxStr || "20"),
    });
  }
  return jobs;
}

async function waitForRevealReady(page: Page): Promise<number> {
  return await page
    .waitForFunction(
      () => {
        const w = window as unknown as {
          Reveal?: { isReady?: () => boolean; getTotalSlides?: () => number };
        };
        if (w.Reveal?.isReady?.() && (w.Reveal.getTotalSlides?.() ?? 0) > 0) {
          return w.Reveal.getTotalSlides();
        }
        return false;
      },
      null,
      { timeout: READY_TIMEOUT_MS },
    )
    .then((handle) => handle.jsonValue() as Promise<number>);
}

async function waitForAnimationReady(page: Page): Promise<number> {
  // Animation pages expose window.__sd?.animation with maxPause and goto via post-message?
  // Just wait for body to settle.
  await page.waitForFunction(
    () => {
      const w = window as unknown as { sd?: unknown };
      return !!w.sd;
    },
    null,
    { timeout: READY_TIMEOUT_MS },
  );
  return 1; // We snap one frame per animation (final state).
}

async function navigateRevealSlide(page: Page, index: number): Promise<void> {
  // 0-indexed linear: drive via location.hash. reveal honors #/N for horizontal nav.
  await page.evaluate(
    ([i]) => {
      location.hash = `#/${i}`;
    },
    [index] as [number],
  );
}

async function snapDeck(page: Page, job: Job): Promise<Buffer[]> {
  await page.goto(job.url, { waitUntil: "load", timeout: PER_URL_TIMEOUT_MS });
  const total = await waitForRevealReady(page);
  const count = Math.min(job.max, total);
  const shots: Buffer[] = [];
  for (let i = 0; i < count; i++) {
    await navigateRevealSlide(page, i);
    await page.waitForTimeout(IDLE_MS);
    const buf = await page.screenshot({ fullPage: false, type: "png" });
    shots.push(buf);
  }
  return shots;
}

async function snapAnim(page: Page, job: Job): Promise<Buffer[]> {
  await page.goto(job.url, { waitUntil: "load", timeout: PER_URL_TIMEOUT_MS });
  await waitForAnimationReady(page);
  // Let the animation play once to its end. We snap a single final frame.
  await page.waitForTimeout(2000);
  const buf = await page.screenshot({ fullPage: false, type: "png" });
  return [buf];
}

async function stitchGrid(shots: Buffer[]): Promise<Buffer> {
  if (shots.length === 0) return Buffer.alloc(0);
  if (shots.length === 1) return shots[0];
  const metas = await Promise.all(shots.map((b) => sharp(b).metadata()));
  const w = metas[0].width!;
  const h = metas[0].height!;
  const cols = Math.min(shots.length, 4);
  const rows = Math.ceil(shots.length / cols);
  const composites = shots.map((buf, i) => ({
    input: buf,
    top: Math.floor(i / cols) * h,
    left: (i % cols) * w,
  }));
  return await sharp({
    create: {
      width: cols * w,
      height: rows * h,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer();
}

async function main(): Promise<void> {
  const jobs = await readJobs();
  process.stderr.write(`batch-snap: ${jobs.length} jobs\n`);
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DPR,
  });
  const page = await context.newPage();
  let ok = 0,
    fail = 0;
  const t0 = Date.now();
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    try {
      const shots =
        job.kind === "deck"
          ? await snapDeck(page, job)
          : await snapAnim(page, job);
      const png = await stitchGrid(shots);
      mkdirSync(dirname(job.output), { recursive: true });
      writeFileSync(job.output, png);
      ok++;
      process.stdout.write(`OK\t${job.kind}\t${job.url}\t${job.output}\n`);
    } catch (e) {
      fail++;
      process.stdout.write(
        `FAIL\t${job.kind}\t${job.url}\t${String(e).slice(0, 200)}\n`,
      );
    }
    if ((i + 1) % 25 === 0) {
      const elapsed = (Date.now() - t0) / 1000;
      process.stderr.write(
        `progress: ${i + 1}/${jobs.length} (ok=${ok} fail=${fail}) ${elapsed.toFixed(0)}s\n`,
      );
    }
  }
  await browser.close();
  process.stderr.write(
    `batch-snap done: ok=${ok} fail=${fail} elapsed=${((Date.now() - t0) / 1000).toFixed(0)}s\n`,
  );
}

main().catch((e) => {
  process.stderr.write(`fatal: ${e}\n`);
  process.exit(1);
});
