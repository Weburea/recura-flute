import React from "react";
import { notFound } from "next/navigation";
import FluteStudio from "../../../src/flute/Studio";
export default function FlutePage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <><meta name="flute-project" content="f3e8663f-4d9f-484e-a2ae-75300880d61e" /><FluteStudio /></>;
}
