export function FlowDiagram({ flow }: { flow: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {flow.map((item, index) => (
        <div key={`${item}-${index}`} className="flex items-center gap-2">
          <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm">
            {item}
          </span>
          {index < flow.length - 1 && <span className="text-cti-yellow">→</span>}
        </div>
      ))}
    </div>
  );
}
