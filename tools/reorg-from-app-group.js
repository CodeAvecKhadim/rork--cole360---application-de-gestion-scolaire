// tools/reorg-from-app-group.js
// Script pour réorganiser les pages par rôle depuis app/(app)/ vers app/(teacher)/(parent)/(admin) avec expo-router

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Fonction pour créer les dossiers si besoin
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Fonction pour déplacer un fichier (en utilisant git mv si possible)
function tryGitMv(from, to) {
  try {
    execSync(`git mv "${from}" "${to}"`);
    return true;
  } catch {
    return false;
  }
}

// Rôles et mapping des fichiers
const mapping = [
  { from: "app/(app)/(tabs)/classes.tsx", to: "app/(teacher)/classes.tsx" },
  { from: "app/(app)/(tabs)/messages.tsx", to: "app/(teacher)/messages.tsx" },
  { from: "app/(app)/(tabs)/profile.tsx", to: "app/(teacher)/profile.tsx" },
  { from: "app/(app)/attendance/[classId].tsx", to: "app/(teacher)/attendance/[classId].tsx" },
  { from: "app/(app)/grades/[classId].tsx", to: "app/(teacher)/grades/[classId].tsx" },

  { from: "app/(app)/(tabs)/students.tsx", to: "app/(parent)/students.tsx" },
  { from: "app/(app)/bulletin/[studentId].tsx", to: "app/(parent)/bulletin/[studentId].tsx" },

  { from: "app/(app)/(tabs)/schools.tsx", to: "app/(admin)/schools.tsx" },
  { from: "app/(app)/manage-schools.tsx", to: "app/(admin)/manage-schools.tsx" },
  { from: "app/(app)/security-dashboard.tsx", to: "app/(admin)/security-dashboard.tsx" }
];

// Déplacement des fichiers
console.log("\n=== Réorganisation en cours ===");
mapping.forEach(({ from, to }) => {
  const absFrom = path.join(process.cwd(), from);
  const absTo = path.join(process.cwd(), to);

  if (fs.existsSync(absFrom)) {
    ensureDir(path.dirname(absTo));
    const ok = tryGitMv(absFrom, absTo);
    if (!ok) fs.renameSync(absFrom, absTo);
    console.log(`→ ${from}  →  ${to}  ${ok ? "(git mv)" : "(mv)"}`);
  } else {
    console.log(`⚠️  Fichier introuvable : ${from}`);
  }
});

// Suppression des anciens layouts
["app/(app)/(tabs)/_layout.tsx", "app/(app)/_layout.tsx"].forEach(p => {
  const abs = path.join(process.cwd(), p);
  if (fs.existsSync(abs)) {
    fs.rmSync(abs, { force: true });
    console.log(`🗑  Supprimé : ${p}`);
  }
});

console.log("\n✅ Réorganisation terminée.");

