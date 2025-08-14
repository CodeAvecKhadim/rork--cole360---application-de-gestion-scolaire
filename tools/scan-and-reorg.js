// tools/scan-and-reorg.js
// Usage: node tools/scan-and-reorg.js [--apply] [--json out.json]
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const moves = [
  // Teacher (prof)
  ["app/classes/index.tsx", "app/(teacher)/classes/index.tsx"],
  ["app/attendance/index.tsx", "app/(teacher)/attendance/index.tsx"],
  ["app/grades/index.tsx", "app/(teacher)/grades/index.tsx"],
  ["app/messages/index.tsx", "app/(teacher)/messages/index.tsx"], // si c'était la vue prof
  ["app/profile/index.tsx", "app/(teacher)/profile/index.tsx"],   // si c'était la vue prof

  // Parent
  ["app/students/index.tsx", "app/(parent)/students/index.tsx"],
  ["app/payments/index.tsx", "app/(parent)/payments/index.tsx"],
  ["app/messages/parent-index.tsx", "app/(parent)/messages/index.tsx"], // cas custom
  ["app/profile/parent-index.tsx", "app/(parent)/profile/index.tsx"],   // cas custom

  // Admin
  ["app/schools/index.tsx", "app/(admin)/schools/index.tsx"],
  ["app/users/index.tsx",   "app/(admin)/users/index.tsx"],
  ["app/classes/admin-index.tsx", "app/(admin)/classes/index.tsx"],     // cas custom
  ["app/messages/admin-index.tsx", "app/(admin)/messages/index.tsx"],   // cas custom
  ["app/profile/admin-index.tsx",  "app/(admin)/profile/index.tsx"],    // cas custom
];

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const jsonIdx = args.indexOf("--json");
const JSON_OUT = jsonIdx !== -1 ? args[jsonIdx + 1] : null;

function ensureDir(p){ if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function exists(p){ return fs.existsSync(path.join(process.cwd(), p)); }
function tryGitMv(src, dst){
  try { execSync(`git mv "${src}" "${dst}"`, { stdio: "ignore" }); return true; } catch { return false; }
}

const plan = [];
for (const [from, to] of moves) {
  if (exists(from)) {
    plan.push({ from, to, action: APPLY ? "move" : "preview" });
  }
}

// Affiche un mini inventaire
function listFiles(dir, level=0, acc=[]) {
  const base = path.join(process.cwd(), dir);
  if (!fs.existsSync(base)) return acc;
  for (const name of fs.readdirSync(base)) {
    const p = path.join(base, name);
    const rel = path.relative(process.cwd(), p).replace(/\\/g, "/");
    const stat = fs.statSync(p);
    if (stat.isDirectory()) listFiles(rel, level+1, acc);
    else if (/\.(tsx|ts|js|jsx)$/.test(rel)) acc.push(rel);
  }
  return acc;
}

const found = listFiles("app");

if (!APPLY) {
  console.log("=== INVENTAIRE app/ ===");
  for (const f of found) console.log("•", f);
  console.log("\n=== PLAN DEPLACEMENT (dry-run) ===");
  if (plan.length === 0) console.log("(aucun déplacement proposé — soit déjà clean, soit chemins différents)");
  for (const p of plan) console.log("→", p.from, "=>", p.to);
} else {
  // appliquer
  for (const { from, to } of plan) {
    ensureDir(path.dirname(path.join(process.cwd(), to)));
    const usedGit = tryGitMv(from, to);
    if (!usedGit) fs.renameSync(from, to);
    console.log("✔ déplacé :", from, "→", to, usedGit ? "(git mv)" : "(fs.rename)");
  }
  console.log("\n✅ Réorganisation appliquée.");
}

if (JSON_OUT) {
  const out = { apply: APPLY, found, plan };
  fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 2));
  console.log("JSON écrit dans", JSON_OUT);
}
