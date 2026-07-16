import path from "node:path";
import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const databasePath = path.join(root, "prisma", "dev.db").replaceAll("\\", "/");
const standaloneDir = path.join(root, ".next", "standalone");

async function copyIfExists(from, to) {
  try {
    await fs.cp(from, to, { recursive: true, force: true });
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

process.env.APP_ROOT = root;
process.env.DATABASE_URL = `file:${databasePath}`;

await copyIfExists(path.join(root, "public"), path.join(standaloneDir, "public"));
await copyIfExists(path.join(root, ".next", "static"), path.join(standaloneDir, ".next", "static"));

await import(pathToFileURL(path.join(standaloneDir, "server.js")).href);
