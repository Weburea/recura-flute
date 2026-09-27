"use client";
import React from "react";
import { ProjectPreview } from "@webprodigies/flute/preview";
import { sceneModules } from "./catalog";
// Host-owned development flag: no process, Vite or Electron globals in this adapter.
export function FluteProjectPreview({ children, enabled, active, ...props }) {
  if (!enabled) return children;
  return <ProjectPreview {...props} projectId="f3e8663f-4d9f-484e-a2ae-75300880d61e" enabled={enabled} active={active} sceneModules={sceneModules}>{children}</ProjectPreview>;
}
