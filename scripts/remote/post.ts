#!/usr/bin/env bun
// Post a message into the chat from CLI (called by the agent in tmux after a
// chunk of work). Default is text-only; images are optional attachments.
//
// Usage:
//   bun scripts/remote/post.ts "text here"
//   bun scripts/remote/post.ts "text here" img1.png img2.png
//   echo "text from stdin" | bun scripts/remote/post.ts -

const PORT = Number(process.env.PORT ?? 8765);

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("usage: bun scripts/remote/post.ts <text|-> [images...]");
  process.exit(1);
}

let text = args[0];
const imagePaths = args.slice(1);

if (text === "-") {
  const chunks: Buffer[] = [];
  for await (const chunk of Bun.stdin.stream()) chunks.push(Buffer.from(chunk));
  text = Buffer.concat(chunks).toString("utf-8").trim();
}

if (!text && imagePaths.length === 0) {
  console.error("empty message");
  process.exit(1);
}

const form = new FormData();
form.append("text", text);
for (const p of imagePaths) {
  const file = Bun.file(p);
  if (!(await file.exists())) {
    console.error(`image not found: ${p} (skipping)`);
    continue;
  }
  form.append("image", file);
}

const r = await fetch(`http://127.0.0.1:${PORT}/api/post-agent`, {
  method: "POST",
  body: form,
});

if (!r.ok) {
  console.error(`error ${r.status}: ${await r.text()}`);
  process.exit(1);
}

const m = (await r.json()) as { id: string };
console.log(`posted ${m.id}`);
