import { motion } from "framer-motion";
import { CheckCircle2, HelpCircle, Link2 } from "lucide-react";
import type { Role } from "../data/roles";
import type { Section } from "../data/sections";
import { raci } from "../data/raci";
import { appendixLinks } from "../data/sampleContent";
import { laneStyles } from "../lib/lane";
import { ArchitectureBlockCard } from "./ArchitectureBlockCard";
import { FlowDiagram } from "./FlowDiagram";
import { GovernanceBar } from "./GovernanceBar";
import { LifecycleMiniMap } from "./LifecycleMiniMap";
import { NextPrevControls } from "./NextPrevControls";
import { RaciMatrix } from "./RaciMatrix";
import { RoleBadge } from "./RoleBadge";
import { SpeakerNotes } from "./SpeakerNotes";
import { StatusBadge } from "./StatusBadge";
import { TodoByRolePanel } from "./TodoByRolePanel";

interface SectionViewProps {
  section: Section;
  sections: Section[];
  currentIndex: number;
  selectedRole: Role | "All";
  presenterMode: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function SectionView({ section, sections, currentIndex, selectedRole, presenterMode, onPrev, onNext }: SectionViewProps) {
  const style = laneStyles[section.lane];
  const Icon = style.Icon;
  const prev = sections[currentIndex - 1];
  const next = sections[currentIndex + 1];

  return (
    <motion.section
      key={section.id}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.28 }}
      className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1500px] flex-col gap-5 p-5 lg:p-7"
    >
      <div className={`rounded-xl border border-slate-200 ${style.bg} p-5 shadow-soft`}>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-5xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-black" style={{ color: style.accent }}>
                <Icon className="h-4 w-4" />
                {section.lane}
              </span>
              <StatusBadge status={section.status} />
              <span className="rounded-lg bg-white px-3 py-2 text-sm font-black text-slate-500">
                {String(section.order).padStart(2, "0")} / {sections.length}
              </span>
            </div>
            <h2 className="mt-5 text-4xl font-black leading-tight text-slate-950 lg:text-6xl">{section.title}</h2>
            <p className="mt-3 text-xl font-semibold text-slate-600">{section.subtitle}</p>
          </div>
          <div className="min-w-72 rounded-lg bg-white p-4">
            <div className="text-xs font-black uppercase tracking-widest text-slate-400">Role ownership</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {section.ownerRoles.map((role) => <RoleBadge key={role} role={role} />)}
              {section.contributorRoles.map((role) => <RoleBadge key={role} role={role} muted />)}
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-lg bg-white p-4">
            <div className="text-xs font-black uppercase tracking-widest text-slate-400">Purpose</div>
            <p className="mt-2 text-base leading-7 text-slate-700">{section.purpose}</p>
          </div>
          <div className="rounded-lg bg-white p-4">
            <div className="text-xs font-black uppercase tracking-widest text-slate-400">Key message</div>
            <p className="mt-2 text-xl font-black leading-8 text-slate-950">{section.keyMessage}</p>
          </div>
        </div>
      </div>

      {presenterMode && (
        <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
          <SpeakerNotes notes={section.speakerNotes} />
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-black uppercase tracking-widest text-slate-400">Next section preview</div>
            <div className="mt-2 text-lg font-black text-slate-950">{next?.title ?? "End of presentation"}</div>
            <p className="mt-1 text-sm leading-6 text-slate-600">{next?.keyMessage ?? "Close with decisions and TODO owners."}</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1fr_.8fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Lifecycle flow</div>
          <FlowDiagram flow={section.flow} />
          <div className="mt-5">
            <LifecycleMiniMap sections={sections} currentIndex={currentIndex} />
          </div>
        </div>
        <GovernanceBar notes={section.governanceNotes} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {section.blocks.map((block) => <ArchitectureBlockCard key={block.id} block={block} selectedRole={selectedRole} />)}
          {section.id === "raci" && <RaciMatrix rows={raci} />}
        </div>
        <div className="space-y-4">
          <TodoByRolePanel section={section} selectedRole={selectedRole} />
          <Panel title="Questions to answer" icon={<HelpCircle className="h-4 w-4" />} items={section.questionsToAnswer} />
          <Panel title="Definition of Done" icon={<CheckCircle2 className="h-4 w-4" />} items={section.doneDefinition} />
          <Panel title="Dependencies" icon={<Link2 className="h-4 w-4" />} items={section.dependencies} />
        </div>
      </div>

      {section.id === "summary" && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Appendix quick links</div>
          <div className="grid gap-2 md:grid-cols-3">
            {appendixLinks.map((link) => (
              <a key={link.href} href={link.href} className="rounded-lg border border-slate-200 p-3 text-sm font-black text-slate-700 hover:border-cti-green hover:text-cti-green">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <NextPrevControls prev={prev} next={next} onPrev={onPrev} onNext={onNext} />
    </motion.section>
  );
}

function Panel({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
        {icon}
        {title}
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-slate-600">{item}</li>
        ))}
      </ul>
    </div>
  );
}
