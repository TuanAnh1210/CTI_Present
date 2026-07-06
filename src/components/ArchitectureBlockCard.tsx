import { CheckCircle2, GitBranch, Landmark, ListTodo } from "lucide-react";
import type { Role } from "../data/roles";
import type { ArchitectureBlock } from "../data/sections";
import { RoleBadge } from "./RoleBadge";

interface ArchitectureBlockCardProps {
  block: ArchitectureBlock;
  selectedRole: Role | "All";
}

function listPreview(items: string[]) {
  return items.slice(0, 3);
}

export function ArchitectureBlockCard({ block, selectedRole }: ArchitectureBlockCardProps) {
  const related = selectedRole === "All" || block.ownerRoles.includes(selectedRole) || block.contributorRoles.includes(selectedRole);
  const todos = selectedRole === "All" ? Object.values(block.todos).flat() : block.todos[selectedRole] ?? [];

  return (
    <article className={`rounded-lg border bg-white p-4 shadow-soft transition ${related ? "border-slate-200" : "border-slate-100 opacity-30"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-950">{block.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{block.what}</p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-1">
          {block.ownerRoles.map((role) => <RoleBadge key={role} role={role} />)}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400">Why</div>
          <p className="text-sm leading-6 text-slate-700">{block.why}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-3">
          <div className="mb-1 text-xs font-black uppercase tracking-widest text-green-700">How</div>
          <p className="text-sm leading-6 text-slate-700">{block.how}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <MiniList title="Input" icon={<GitBranch className="h-4 w-4" />} items={listPreview(block.input)} />
        <MiniList title="Output" icon={<CheckCircle2 className="h-4 w-4" />} items={listPreview(block.output)} />
        <MiniList title="Dependencies" icon={<Landmark className="h-4 w-4" />} items={listPreview(block.dependencies)} />
        <MiniList title="TODO" icon={<ListTodo className="h-4 w-4" />} items={todos.slice(0, 3)} highlight />
      </div>
    </article>
  );
}

function MiniList({ title, icon, items, highlight = false }: { title: string; icon: React.ReactNode; items: string[]; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${highlight ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"}`}>
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
        {icon}
        {title}
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="text-xs leading-5 text-slate-600">{item}</li>
        ))}
      </ul>
    </div>
  );
}
