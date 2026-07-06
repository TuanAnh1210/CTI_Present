import {
  Archive,
  BarChart3,
  Boxes,
  BrainCircuit,
  Briefcase,
  Gauge,
  Network,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import type { Lane } from "../data/sections";

export const laneStyles: Record<Lane, { accent: string; bg: string; text: string; Icon: typeof Briefcase }> = {
  Business: { accent: "#1e293b", bg: "bg-slate-50", text: "text-slate-900", Icon: Briefcase },
  Ontology: { accent: "#0f766e", bg: "bg-teal-50", text: "text-teal-800", Icon: Network },
  "Design Time": { accent: "#00833E", bg: "bg-green-50", text: "text-green-800", Icon: Boxes },
  "Train Time": { accent: "#7c3aed", bg: "bg-purple-50", text: "text-purple-800", Icon: BrainCircuit },
  Runtime: { accent: "#2563eb", bg: "bg-blue-50", text: "text-blue-800", Icon: Gauge },
  Monitoring: { accent: "#ea580c", bg: "bg-orange-50", text: "text-orange-800", Icon: BarChart3 },
  Governance: { accent: "#4b5563", bg: "bg-gray-50", text: "text-gray-800", Icon: ShieldCheck },
  Deployment: { accent: "#dc2626", bg: "bg-red-50", text: "text-red-800", Icon: Rocket },
  Retirement: { accent: "#d97706", bg: "bg-amber-50", text: "text-amber-800", Icon: Archive },
};
