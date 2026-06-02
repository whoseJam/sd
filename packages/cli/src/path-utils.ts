import fs from "node:fs";
import path from "node:path";

export function relativeTo(source: string, filePath: string): string {
  return path.relative(source, filePath).replaceAll("\\", "/");
}

export function toTargetFolder(source: string, target: string, filePath: string): string {
  const rel = relativeTo(source, filePath);
  const dir = path.dirname(rel);
  return dir === "." ? target : `${target}/${dir}`;
}

export function toTargetFile(source: string, target: string, filePath: string): string {
  return `${target}/${relativeTo(source, filePath)}`;
}

export function toOriginFile(source: string, filePath: string): string {
  return `${source}/${relativeTo(source, filePath)}`;
}

export function walk(
  directoryPath: string,
  callback: (filePath: string) => void,
): void {
  if (!fs.existsSync(directoryPath)) return;
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const full = `${directoryPath}/${entry.name}`;
    if (entry.isDirectory()) walk(full, callback);
    else callback(full);
  }
}
