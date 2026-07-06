import type { Role } from "./roles";
import { sections } from "./sections";

export type RaciValue = "R" | "A" | "C" | "I";

export interface RaciRow {
  sectionId: string;
  sectionTitle: string;
  values: Partial<Record<Role, RaciValue>>;
}

export const raci: RaciRow[] = sections.map((section) => {
  const values: Partial<Record<Role, RaciValue>> = {};
  section.ownerRoles.forEach((role, index) => {
    values[role] = index === 0 ? "A" : "R";
  });
  section.contributorRoles.forEach((role) => {
    if (!values[role]) values[role] = "C";
  });
  return {
    sectionId: section.id,
    sectionTitle: section.title,
    values,
  };
});
