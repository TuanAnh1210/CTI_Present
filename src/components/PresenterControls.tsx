import { ChevronLeft, ChevronRight, Maximize2, Search } from "lucide-react";

interface PresenterControlsProps {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onOpenQuickJump: () => void;
  onTogglePresenter: () => void;
  presenterMode: boolean;
}

export function PresenterControls({ canPrev, canNext, onPrev, onNext, onOpenQuickJump, onTogglePresenter, presenterMode }: PresenterControlsProps) {
  return (
    <div className="fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-slate-200 bg-white/95 p-2 shadow-soft backdrop-blur">
      <button type="button" onClick={onPrev} disabled={!canPrev} className="rounded-lg border border-slate-200 p-2 text-slate-700 disabled:opacity-30">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button type="button" onClick={onOpenQuickJump} className="rounded-lg border border-slate-200 p-2 text-slate-700">
        <Search className="h-5 w-5" />
      </button>
      <button type="button" onClick={onTogglePresenter} className={`rounded-lg border p-2 ${presenterMode ? "border-cti-green bg-green-50 text-cti-green" : "border-slate-200 text-slate-700"}`}>
        <Maximize2 className="h-5 w-5" />
      </button>
      <button type="button" onClick={onNext} disabled={!canNext} className="rounded-lg border border-slate-200 p-2 text-slate-700 disabled:opacity-30">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
