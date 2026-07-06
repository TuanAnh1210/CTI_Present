import type { Section } from "../data/sections";
import { laneStyles } from "../lib/lane";

export function LifecycleMiniMap({ sections, currentIndex }: { sections: Section[]; currentIndex: number }) {
  return (
    <div className="grid grid-cols-17 gap-1">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className={`h-2 rounded-full ${index === currentIndex ? "ring-2 ring-slate-900 ring-offset-2" : ""}`}
          style={{ backgroundColor: laneStyles[section.lane].accent }}
          title={section.title}
        />
      ))}
    </div>
  );
}
