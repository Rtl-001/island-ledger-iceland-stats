// The Island Ledger — hand-in program.
// Copies app/ and screenshots/ from this repository into the output
// directory and writes dossier.json there with the kit's library.
// Runs under Node 22 as-is; the output directory is MAKEFUN_OUTPUT_DIR
// outside the grader and /output inside it.

import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = import.meta.dirname;
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

function copyTree(fromDir, toDir) {
  mkdirSync(toDir, { recursive: true });
  const entries = readdirSync(fromDir, { withFileTypes: true }).sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0
  );
  for (const entry of entries) {
    const from = join(fromDir, entry.name);
    const to = join(toDir, entry.name);
    if (entry.isDirectory()) {
      copyTree(from, to);
    } else if (entry.isFile()) {
      copyFileSync(from, to);
    }
  }
}

for (const part of ["app", "screenshots"]) {
  const source = join(repoRoot, part);
  if (!existsSync(source)) {
    throw new Error(`missing ${part}/ beside main.ts`);
  }
  copyTree(source, join(outputDir, part));
}

const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
  app_path_max_bytes: 1000
});
writeFileSync(join(outputDir, "dossier.json"), dossier);
console.log("dossier.json written:", dossier.length, "bytes");
