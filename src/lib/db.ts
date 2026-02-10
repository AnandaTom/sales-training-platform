import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "src", "lib", "data");

function getFilePath(collection: string): string {
  return join(DATA_DIR, `${collection}.json`);
}

export function readCollection<T>(collection: string): T[] {
  const filePath = getFilePath(collection);
  if (!existsSync(filePath)) return [];
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T[];
}

export function writeCollection<T>(collection: string, data: T[]): void {
  const filePath = getFilePath(collection);
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function findById<T extends { id: string }>(collection: string, id: string): T | null {
  const items = readCollection<T>(collection);
  return items.find((item) => item.id === id) ?? null;
}

export function insert<T extends { id: string }>(collection: string, item: T): T {
  const items = readCollection<T>(collection);
  items.push(item);
  writeCollection(collection, items);
  return item;
}

export function update<T extends { id: string }>(
  collection: string,
  id: string,
  data: Partial<T>
): T | null {
  const items = readCollection<T>(collection);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...data };
  writeCollection(collection, items);
  return items[index];
}

export function remove(collection: string, id: string): boolean {
  const items = readCollection<{ id: string }>(collection);
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  writeCollection(collection, filtered);
  return true;
}
