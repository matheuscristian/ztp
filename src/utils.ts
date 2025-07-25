import { File } from "./types";

export function parseFileListToArray(files: FileList) {
  const fileArray = [];

  for (let i = 0; i < files.length; i++) {
    fileArray.push(files.item(i));
  }

  return fileArray as (File | null)[];
}

export function sleep(delay: number) {
  return new Promise((res) => {
    setTimeout(res, delay);
  });
}
