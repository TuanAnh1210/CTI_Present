import { ShieldCheck } from "lucide-react";

export function GovernanceBar({ notes }: { notes: string[] }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <ShieldCheck className="mt-0.5 h-5 w-5 text-cti-green" />
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400">Governance notes</div>
        <div className="mt-1 flex flex-wrap gap-2">
          {notes.map((note) => (
            <span key={note} className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-600">
              {note}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
