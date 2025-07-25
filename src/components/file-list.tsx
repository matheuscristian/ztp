import useFileStore from "../stores/fileStore";

export default function FileListC() {
  const files = useFileStore((s) => s.files);
  const setFiles = useFileStore((s) => s.setFiles);

  return (
    <div className="file-list">
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
      <div className="clear-btn" onClick={() => setFiles([])}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-eraser-icon lucide-eraser lucide-eraser"
        >
          <path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21" />
          <path d="m5.082 11.09 8.828 8.828" />
        </svg>
      </div>
    </div>
  );
}
