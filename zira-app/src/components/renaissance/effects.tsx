"use client";

import { FilmGrain } from "./grain";

/* App-level ambient effects — cursor is handled globally in root layout */
export function RenaissanceEffects() {
  return <FilmGrain opacity={0.035} />;
}
