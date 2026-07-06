import type { Role } from "../data/roles";
import { roleOrder } from "../data/roles";
import type { Section } from "../data/sections";
import { RoleBadge } from "./RoleBadge";

interface TodoByRolePanelProps {
  section: Section;
  selectedRole: Role | "All";
}

export function TodoByRolePanel({ section, selectedRole }: TodoByRolePanelProps) {
  const roles = selectedRole === "All" ? roleOrder : [selectedRole];
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="mb-3 text-xs font-black uppercase tracking-widest text-amber-700">Needs input from</div>
      <div className="grid gap-3 md:grid-cols-2">
        {roles.map((role) => {
          const items = section.blocks.flatMap((block) => block.todos[role] ?? []);
          if (!items.length) return null;
          return (
            <div key={role} className="rounded-lg bg-white p-3">
              <RoleBadge role={role} />
              <ul className="mt-2 space-y-1">
                {items.slice(0, 4).map((item) => (
                  <li key={item} className="text-xs leading-5 text-slate-600">{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
