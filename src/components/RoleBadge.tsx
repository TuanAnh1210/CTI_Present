import type { Role } from "../data/roles";

const colorMap: Record<Role, string> = {
  "BA/DA": "bg-slate-900 text-white",
  DS: "bg-purple-600 text-white",
  DE: "bg-teal-600 text-white",
  Dev: "bg-blue-600 text-white",
  "System/Security": "bg-red-600 text-white",
};

export function RoleBadge({ role, muted = false }: { role: Role; muted?: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-extrabold ${muted ? "bg-slate-100 text-slate-500" : colorMap[role]}`}>
      {role}
    </span>
  );
}
