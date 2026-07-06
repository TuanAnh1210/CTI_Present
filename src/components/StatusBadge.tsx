import type { SectionStatus } from "../data/sections";

const styles: Record<SectionStatus, string> = {
  Draft: "bg-slate-100 text-slate-700",
  "Need Input": "bg-amber-100 text-amber-800",
  "In Review": "bg-blue-100 text-blue-800",
  Final: "bg-green-100 text-green-800",
};

export function StatusBadge({ status }: { status: SectionStatus }) {
  return <span className={`rounded-md px-2.5 py-1 text-xs font-extrabold ${styles[status]}`}>{status}</span>;
}
