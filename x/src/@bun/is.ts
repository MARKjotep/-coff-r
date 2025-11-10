import { exists, mkdir, writeFile } from "node:fs/promises";

export const isPath = async (path: string) => {
    return await exists(path);
  },
  isFile = async (path: string, data: string = "") => {
    if (await isPath(path)) return true;
    await writeFile(path, data, { flag: "wx" });
    return true;
  } /*
-------------------------
-------------------------
*/,
  isDir = async (path: string) => {
    if (await isPath(path)) return true;

    await mkdir(path, { recursive: true });
    return true;
  };
