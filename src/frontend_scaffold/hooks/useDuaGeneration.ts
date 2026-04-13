"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DuaService } from "@/services/DuaService";
import { useProcessStore } from "@/store/useProcessStore";
import type { DuaDocument } from "@/models";

/**
 * useDuaGeneration — triggers and monitors the AI DUA generation process.
 * Uses TanStack Query mutation for the async call lifecycle.
 */
export function useDuaGeneration() {
  const { templateFileId, sourceFiles, setStatus, setOutputUrl } = useProcessStore();
  const duaService = new DuaService();

  const mutation = useMutation<DuaDocument, Error>({
    mutationFn: () =>
      duaService.generate({
        templateFileId,
        sourceFileIds: sourceFiles.map((f) => f.id),
      }),
    onSuccess: (doc) => {
      setStatus("complete");
      if (doc.outputUrl) setOutputUrl(doc.outputUrl);
    },
    onError: () => setStatus("error"),
  });

  return {
    generate: mutation.mutate,
    isGenerating: mutation.isPending,
    error: mutation.error?.message ?? null,
    document: mutation.data ?? null,
  };
}
