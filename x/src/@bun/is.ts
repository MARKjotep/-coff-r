export const isPath = async (path: string): Promise<boolean> => {
  return await Bun.file(path).exists();
};

export const isFile = async (path: string, data = ""): Promise<boolean> => {
  if (await isPath(path)) return true;

  await Bun.write(path, data);
  return true;
};

export const isDir = async (path: string): Promise<boolean> => {
  // Bun delegates mkdir to node:fs under the hood
  const { mkdir } = await import("node:fs/promises");
  if (await isPath(path)) return true;

  await mkdir(path, { recursive: true });
  return true;
};
