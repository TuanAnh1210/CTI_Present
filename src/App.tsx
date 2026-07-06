import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppLayout } from "./components/AppLayout";
import { PresenterControls } from "./components/PresenterControls";
import { QuickJumpModal } from "./components/QuickJumpModal";
import { SectionView } from "./components/SectionView";
import type { Role } from "./data/roles";
import { sections } from "./data/sections";

export function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState<Role | "All">("All");
  const [quickJumpOpen, setQuickJumpOpen] = useState(false);
  const [presenterMode, setPresenterMode] = useState(false);

  const sortedSections = useMemo(() => [...sections].sort((a, b) => a.order - b.order), []);
  const current = sortedSections[currentIndex];

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(sortedSections.length - 1, index)));
  }, [sortedSections.length]);

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "/" && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        setQuickJumpOpen(true);
      }
      if (quickJumpOpen) return;
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(sortedSections.length - 1);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, next, prev, quickJumpOpen, sortedSections.length]);

  return (
    <AppLayout
      sections={sortedSections}
      currentIndex={currentIndex}
      selectedRole={selectedRole}
      presenterMode={presenterMode}
      onSelect={goTo}
      onRoleChange={setSelectedRole}
      onOpenQuickJump={() => setQuickJumpOpen(true)}
      onTogglePresenter={() => setPresenterMode((value) => !value)}
    >
      <AnimatePresence mode="wait">
        <SectionView
          section={current}
          sections={sortedSections}
          currentIndex={currentIndex}
          selectedRole={selectedRole}
          presenterMode={presenterMode}
          onPrev={prev}
          onNext={next}
        />
      </AnimatePresence>
      <PresenterControls
        canPrev={currentIndex > 0}
        canNext={currentIndex < sortedSections.length - 1}
        onPrev={prev}
        onNext={next}
        onOpenQuickJump={() => setQuickJumpOpen(true)}
        onTogglePresenter={() => setPresenterMode((value) => !value)}
        presenterMode={presenterMode}
      />
      <QuickJumpModal open={quickJumpOpen} sections={sortedSections} onClose={() => setQuickJumpOpen(false)} onSelect={goTo} />
    </AppLayout>
  );
}
