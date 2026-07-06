import type { Section } from "../data/sections";
import { laneStyles } from "../lib/lane";

interface TopProgressProps {
  sections: Section[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export function TopProgress({ sections, currentIndex, onSelect }: TopProgressProps) {
  return (
    <div className="h-16 border-b border-slate-200 bg-white/90 px-5 backdrop-blur">
      <div className="flex h-full items-center gap-1 overflow-x-auto">
        {sections.map((section, index) => {
          const active = index === currentIndex;
          const style = laneStyles[section.lane];
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(index)}
              className={`h-2 min-w-16 flex-1 rounded-full transition-all ${active ? "h-4" : "opacity-45 hover:opacity-80"}`}
              title={`${section.order}. ${section.title}`}
              style={{ backgroundColor: style.accent }}
              aria-label={`Go to ${section.title}`}
            />
          );
        })}
      </div>
    </div>
  );
}
