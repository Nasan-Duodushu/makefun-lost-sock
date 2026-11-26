// Funniest Lost Sock Status Update — entry program.
// Writes one status update (<=120 chars) to /output/entry.txt.
// Field study: the modal takes are the dryer eating the sock and the partner
// dating a slipper — this entry angles away: the dog buried the sock in the
// garden, and the sock has made peace with it. Small, domestic, anxious sock
// voice; clear premise; punch lands in the last words ("no regrets").
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const MAX_CHARS = 120;

const BEATS = [
  "Update: the dog buried me in the garden.",
  "I have a view, a worm for a neighbour, and no regrets.",
];

function buildUpdate(): string {
  return BEATS.join(" ");
}

function validate(text: string): string[] {
  const problems: string[] = [];
  const line = text.trim();
  if ([...line].length > MAX_CHARS || line.length === 0) {
    problems.push(`update must be 1-${MAX_CHARS} characters`);
  }
  if (line.includes("\n")) problems.push("update must be one line");
  if (!/^Update:/.test(line)) problems.push("update must open as a status update");
  // The punch must land in the last words, and the sock's predicament named.
  if (!/no regrets\.$/.test(line)) problems.push("update must end on the punch");
  if (!/buried me/.test(line)) problems.push("update must name where the sock ended up");
  // Modal guard: no dryer, no missing partner, no slipper romance.
  if (/dryer|partner|slipper|other one|missing/i.test(line)) {
    problems.push("update must dodge the dryer/partner modal");
  }
  return problems;
}

const update = buildUpdate();
const problems = validate(update);
if (problems.length > 0) {
  throw new Error(problems.join("; "));
}
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, new TextEncoder().encode(update));
console.log(`wrote ${[...update].length} chars to ${target}`);
