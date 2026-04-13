"use client";
import { Button as ShadButton } from "@/components/ui/button";
import type { ComponentProps } from "react";
/** Atom: wraps shadcn/ui Button with project defaults. */
export function Button(props: ComponentProps<typeof ShadButton>) {
  return <ShadButton {...props} />;
}
