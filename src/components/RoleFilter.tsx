import type { Role, RoleDefinition } from "../data/roles";
import { RoleBadge } from "./RoleBadge";

interface RoleFilterProps {
  roles: RoleDefinition[];
  selectedRole: Role | "All";
  onChange: (role: Role | "All") => void;
  compact?: boolean;
}

export function RoleFilter({ roles, selectedRole, onChange, compact = false }: RoleFilterProps) {
  return (
    <div>
      <div className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">Role overlay</div>
      <div className={`flex ${compact ? "flex-col" : "flex-wrap"} gap-2`}>
        <button
          type="button"
          onClick={() => onChange("All")}
          className={`rounded-md px-2.5 py-1.5 text-xs font-extrabold ${selectedRole === "All" ? "bg-cti-green text-white" : "bg-slate-100 text-slate-600"}`}
        >
          All roles
        </button>
        {roles.map((item) => (
          <button key={item.role} type="button" onClick={() => onChange(item.role)} className={selectedRole === item.role ? "opacity-100" : "opacity-75 hover:opacity-100"}>
            <RoleBadge role={item.role} muted={selectedRole !== "All" && selectedRole !== item.role} />
          </button>
        ))}
      </div>
    </div>
  );
}
