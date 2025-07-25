import DropZone from "./components/drop-zone";
import FileList from "./components/file-list";
import useFileStore from "./stores/fileStore";

import "./App.css";
import { open } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { useState } from "react";
import { sleep } from "./utils";

const API_BASE_URL = "http://api.labelary.com/v1/printers";
const API_URL = `${API_BASE_URL}/8dpmm/labels/3.1496x0.984252/`;

const CHUNK_SIZE = 50;

export default function App() {
  const files = useFileStore((s) => s.files);
  const setFiles = useFileStore((s) => s.setFiles);

  const [loading, setLoading] = useState(false);

  // Divide o conteúdo ZPL em blocos de até 50 etiquetas
  function splitZplIntoChunks(zpl: string, chunkSize = CHUNK_SIZE): string[] {
    const labels = zpl
      .split("^XA")
      .filter((block) => block.trim() !== "")
      .map((block) => `^XA${block}`);

    const chunks: string[] = [];
    for (let i = 0; i < labels.length; i += chunkSize) {
      chunks.push(labels.slice(i, i + chunkSize).join(""));
    }

    return chunks;
  }

  // Função principal de conversão
  async function convertFiles() {
    if (!Array.isArray(files) || files.length === 0) return;

    const outputPath = await open({
      directory: true,
      canCreateDirectories: false,
    });
    if (!outputPath) return;

    setLoading(true);
    let hadError = false;

    for (const file of files) {
      const content = await file.text();
      const chunks = splitZplIntoChunks(content);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/pdf",
          },
          body: chunk,
        });

        if (!response.ok) {
          console.warn(
            `Erro ao processar "${file.name}" (parte ${i + 1}):`,
            response.statusText
          );
          hadError = true;
          break;
        }

        const pdfBytes = await response.arrayBuffer();
        const baseName = file.name.replace(/\.txt$/i, "");
        const fileName =
          chunks.length > 1
            ? `${baseName}_parte_${i + 1}.pdf`
            : `${baseName}.pdf`;

        const fullPath = await join(outputPath, fileName);
        await writeFile(fullPath, new Uint8Array(pdfBytes));

        await sleep(1000);
      }
    }

    setLoading(false);
    setFiles([]);

    alert(
      hadError
        ? "Ocorreu um erro ao processar um ou mais arquivos."
        : "Conversão concluída com sucesso!"
    );
  }

  return (
    <main>
      {files.length === 0 ? <DropZone /> : <FileList />}
      <div className="btn-container">
        <button
          className="confirm-btn"
          onClick={convertFiles}
          disabled={loading}
        >
          {!loading ? "Confirmar" : "Carregando..."}
        </button>
      </div>
    </main>
  );
}
