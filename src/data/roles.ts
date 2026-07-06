import { Briefcase, Code2, Database, FlaskConical, ShieldCheck } from "lucide-react";

export type Role = "BA/DA" | "DS" | "DE" | "Dev" | "System/Security";

export interface RoleDefinition {
  role: Role;
  label: string;
  memberNames: string[];
  responsibility: string;
  color: string;
  Icon: typeof Briefcase;
}

export const roles: RoleDefinition[] = [
  {
    role: "BA/DA",
    label: "Business & Data Analysis",
    memberNames: ["Phạm Thị Mỹ Dung"],
    responsibility: "Business case, KPI, policy, reporting need, domain language.",
    color: "bg-slate-900 text-white",
    Icon: Briefcase,
  },
  {
    role: "DE",
    label: "Data Engineering",
    memberNames: ["Dương Thùy An"],
    responsibility: "Data source, lineage, feature pipeline, SLA, data quality.",
    color: "bg-teal-600 text-white",
    Icon: Database,
  },
  {
    role: "DS",
    label: "Data Science",
    memberNames: ["Mai Thị Bảo Ngọc"],
    responsibility: "Target, feature logic, model training, validation, calibration.",
    color: "bg-purple-600 text-white",
    Icon: FlaskConical,
  },
  {
    role: "Dev",
    label: "Application Development",
    memberNames: ["Nguyễn Tuấn Anh", "Hoàng Mai Duy"],
    responsibility: "API, runtime integration, logging, error handling, CI/CD.",
    color: "bg-blue-600 text-white",
    Icon: Code2,
  },
  {
    role: "System/Security",
    label: "System & Security",
    memberNames: ["Trần Hoàng Dương"],
    responsibility: "IAM, audit, encryption, network, deployment control.",
    color: "bg-red-600 text-white",
    Icon: ShieldCheck,
  },
];

export const roleOrder = roles.map((item) => item.role);
