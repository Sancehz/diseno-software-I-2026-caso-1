"use client";
import { Badge as ShadBadge } from "@/components/ui/badge";
import type { ComponentProps } from "react";
export function Badge(props: ComponentProps<typeof ShadBadge>) {
  return <ShadBadge {...props} />;
}
