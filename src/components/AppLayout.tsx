import type { PropsWithChildren } from "react";
import type { Role } from "../data/roles";
import type { Section } from "../data/sections";
import { Sidebar } from "./Sidebar";
import { TopProgress } from "./TopProgress";

interface AppLayoutProps extends PropsWithChildren {
  sections: Section[];
  currentIndex: number;
  selectedRole: Role | "All";
  presenterMode: boolean;
  onSelect: (index: number) => void;
  onRoleChange: (role: Role | "All") => void;
  onOpenQuickJump: () => void;
  onTogglePresenter: () => void;
}

export function AppLayout(props: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white text-slate-950">
      <Sidebar
        sections={props.sections}
        currentIndex={props.currentIndex}
        selectedRole={props.selectedRole}
        presenterMode={props.presenterMode}
        onSelect={props.onSelect}
        onRoleChange={props.onRoleChange}
        onOpenQuickJump={props.onOpenQuickJump}
        onTogglePresenter={props.onTogglePresenter}
      />
      <div className="min-w-0 flex-1">
        <TopProgress sections={props.sections} currentIndex={props.currentIndex} onSelect={props.onSelect} />
        {props.children}
      </div>
    </div>
  );
}
