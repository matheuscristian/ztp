import { ChangeEvent, useEffect, useRef, useState } from "react";
import useFileStore from "../stores/fileStore";
import { parseFileListToArray } from "../utils";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { File } from "../types";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { basename } from "@tauri-apps/api/path";

export default function DropZone() {
  const fileInput = useRef<HTMLInputElement>(null);
  const setFiles = useFileStore((s) => s.setFiles);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const fileArray = parseFileListToArray(e.target.files);
      setFiles(fileArray.filter((f) => f?.type === "text/plain") as File[]);

      setIsDraggingOver(false);
    }
  }

  function handleClick() {
    fileInput.current?.click();
  }

  useEffect(() => {
    const unresolved = getCurrentWebview().onDragDropEvent((event) => {
      if (event.payload.type === "over") {
        setIsDraggingOver(true);
        return;
      }

      setIsDraggingOver(false);

      (async () => {
        if (event.payload.type !== "drop") return;

        const files: File[] = [];
        for (const path of event.payload.paths) {
          if (!path.endsWith(".txt")) continue;

          files.push({
            name: await basename(path),
            type: "plain/txt",
            text: () => readTextFile(path),
          });
        }
        setFiles(files);
      })();
    });

    return () => {
      unresolved.then((unlisten) => unlisten());
    };
  });

  return (
    <div
      className={`file-input-zone ${isDraggingOver ? "dragover" : ""}`}
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-file"
      >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      </svg>
      <span>
        Arraste arquivos ou <span>clique para selecionar</span>
      </span>
      <input
        ref={fileInput}
        type="file"
        accept=".txt"
        multiple
        hidden
        onChange={handleInputChange}
      />
    </div>
  );
}
