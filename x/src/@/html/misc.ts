export const addBASE = (base: string, str: string) => {
  const isSLASH = str === "/" ? "" : str;
  if (str.startsWith("#")) {
    //
    return base + str;
  }

  return str.startsWith("/") ? base + isSLASH : str;
};
