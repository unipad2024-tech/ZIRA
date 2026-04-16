"use client";

import { RenaissanceCursor } from "./cursor";
import { FilmGrain } from "./grain";

/* Global Renaissance ambient effects — injected once in the app layout */
export function RenaissanceEffects() {
  return (
    <>
      <RenaissanceCursor />
      <FilmGrain opacity={0.035} />
    </>
  );
}
