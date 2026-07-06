import { Search, TimerReset } from "lucide-react";
import type { Role } from "../data/roles";
import { roles } from "../data/roles";
import type { Section } from "../data/sections";
import { laneStyles } from "../lib/lane";
import { RoleFilter } from "./RoleFilter";

interface SidebarProps {
  sections: Section[];
  currentIndex: number;
  selectedRole: Role | "All";
  presenterMode: boolean;
  onSelect: (index: number) => void;
  onRoleChange: (role: Role | "All") => void;
  onOpenQuickJump: () => void;
  onTogglePresenter: () => void;
}

export function Sidebar({
  sections,
  currentIndex,
  selectedRole,
  presenterMode,
  onSelect,
  onRoleChange,
  onOpenQuickJump,
  onTogglePresenter,
}: SidebarProps) {
  return (
    <aside className="hidden h-screen w-80 shrink-0 border-r border-slate-200 bg-white xl:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-200 p-5">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-cti-green text-sm font-black text-white">CTI</div>
          <h1 className="mt-4 text-xl font-black leading-tight text-slate-950">A-Score</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Interactive PPT · architecture portal · data-driven template.</p>
        </div>

        <div className="border-b border-slate-200 p-4">
          <button
            type="button"
            onClick={onOpenQuickJump}
            className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700"
          >
            <span className="inline-flex items-center gap-2"><Search className="h-4 w-4" /> Quick Jump</span>
            <kbd className="rounded bg-white px-2 py-0.5 text-xs">/</kbd>
          </button>
          <button
            type="button"
            onClick={onTogglePresenter}
            className={`mt-2 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm font-bold ${
              presenterMode ? "border-cti-green bg-green-50 text-cti-green" : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <span className="inline-flex items-center gap-2"><TimerReset className="h-4 w-4" /> Presenter mode</span>
            <span>{presenterMode ? "On" : "Off"}</span>
          </button>
        </div>

        <div className="border-b border-slate-200 p-4">
          <RoleFilter roles={roles} selectedRole={selectedRole} onChange={onRoleChange} compact />
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto p-3" aria-label="Lifecycle sections">
          {sections.map((section, index) => {
            const style = laneStyles[section.lane];
            const active = index === currentIndex;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSelect(index)}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                  active ? "bg-slate-950 text-white shadow-soft" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: style.accent }} />
                <span className="w-6 font-black">{String(section.order).padStart(2, "0")}</span>
                <span className="truncate font-bold">{section.title}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
