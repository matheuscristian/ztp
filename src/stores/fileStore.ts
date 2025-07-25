import { create } from "zustand";
import { File } from "../types";

interface StoreType {
  files: File[];
  setFiles(files: File[]): void;
}

const useFileStore = create<StoreType>((set) => ({
  files: [] as File[],
  setFiles(files: File[]) {
    set(() => ({
      files,
    }));
  },
}));

export default useFileStore;
