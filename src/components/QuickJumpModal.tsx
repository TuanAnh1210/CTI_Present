import { X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Role } from "../data/roles";
import type { Section } from "../data/sections";
import { laneStyles } from "../lib/lane";
import { StatusBadge } from "./StatusBadge";

interface QuickJumpModalProps {
  open: boolean;
  sections: Section[];
  onClose: () => void;
  onSelect: (index: number) => void;
}

export function QuickJumpModal({ open, sections, onClose, onSelect }: QuickJumpModalProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter((section) => {
      const searchable = [
        section.title,
        section.subtitle,
        section.lane,
        section.status,
        section.keyMessage,
        ...section.ownerRoles,
        ...section.contributorRoles,
        ...section.blocks.flatMap((block) => [
          block.title,
          block.what,
          block.why,
          block.how,
          ...block.ownerRoles,
          ...block.contributorRoles,
          ...Object.values(block.todos).flat(),
        ]),
      ].join(" ").toLowerCase();
      return searchable.includes(q);
    });
  }, [query, sections]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/35 p-4 pt-16 backdrop-blur-sm">
      <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-200 p-4">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search section, block, role, status, lane..."
            className="h-12 flex-1 rounded-lg border border-slate-200 px-4 text-base outline-none focus:border-cti-green"
          />
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 p-3">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[68vh] overflow-y-auto p-3">
          {results.map((section) => {
            const index = sections.findIndex((item) => item.id === section.id);
            const style = laneStyles[section.lane];
            const owners = section.ownerRoles.join(", ") as Role | string;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => {
                  onSelect(index);
                  onClose();
                }}
                className="mb-2 w-full rounded-lg border border-slate-200 bg-white p-4 text-left hover:border-cti-green hover:bg-green-50"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md px-2 py-1 text-xs font-black text-white" style={{ backgroundColor: style.accent }}>
                    {String(section.order).padStart(2, "0")}
                  </span>
                  <StatusBadge status={section.status} />
                  <span className="text-xs font-bold text-slate-500">{section.lane}</span>
                  <span className="text-xs font-bold text-slate-400">Owners: {owners}</span>
                </div>
                <div className="mt-2 text-lg font-black text-slate-950">{section.title}</div>
                <p className="mt-1 text-sm text-slate-600">{section.keyMessage}</p>
              </button>
            );
          })}
          {!results.length && <div className="p-8 text-center text-sm font-bold text-slate-500">No matching section.</div>}
        </div>
      </div>
    </div>
  );
}
