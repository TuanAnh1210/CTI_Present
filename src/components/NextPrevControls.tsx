import type { Section } from "../data/sections";

export function NextPrevControls({ prev, next, onPrev, onNext }: { prev?: Section; next?: Section; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <button type="button" onClick={onPrev} disabled={!prev} className="rounded-lg border border-slate-200 bg-white p-4 text-left disabled:opacity-40">
        <div className="text-xs font-black uppercase tracking-widest text-slate-400">Previous</div>
        <div className="mt-1 font-black text-slate-900">{prev?.title ?? "Start"}</div>
      </button>
      <button type="button" onClick={onNext} disabled={!next} className="rounded-lg border border-slate-200 bg-white p-4 text-left disabled:opacity-40">
        <div className="text-xs font-black uppercase tracking-widest text-slate-400">Next</div>
        <div className="mt-1 font-black text-slate-900">{next?.title ?? "End"}</div>
      </button>
    </div>
  );
}
