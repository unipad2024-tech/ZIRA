import type { Metadata } from "next";
import { FarmClient } from "./farm-client";

export const metadata: Metadata = { title: "مزرعتي" };

export default function FarmPage() {
  return <FarmClient />;
}
