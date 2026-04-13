"use client";
import { FileDropzone } from "@/components/molecules/FileDropzone";
import { useProcessStore } from "@/store/useProcessStore";
import { formatBytes } from "@/utils/fileUtils";

/**
 * Organism: full file selection panel — Streamliner Configuration screen.
 * Combines FileDropzone with a list of accepted source files.
 * Permission required: LOAD_FILES
 */
export function FileSelector() {
  const { sourceFiles } = useProcessStore();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-sm font-medium mb-2">Source documents</h2>
        <FileDropzone />
      </div>
      {sourceFiles.length > 0 && (
        <ul className="divide-y rounded-lg border text-sm">
          {sourceFiles.map((f) => (
            <li key={f.id} className="flex items-center justify-between px-4 py-3">
              <span className="truncate font-mono text-xs">{f.name}</span>
              <span className="text-xs text-muted-foreground shrink-0 ml-4">
                {f.type} · {formatBytes(f.sizeBytes)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
