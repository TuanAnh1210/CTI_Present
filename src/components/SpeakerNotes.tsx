import { Mic2 } from "lucide-react";

export function SpeakerNotes({ notes }: { notes: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
        <Mic2 className="h-4 w-4 text-cti-green" />
        Speaker notes
      </div>
      <p className="text-sm leading-6 text-slate-600">{notes}</p>
    </div>
  );
}
