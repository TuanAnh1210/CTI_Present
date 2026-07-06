import type { Role } from "./roles";

export type SectionStatus = "Draft" | "Need Input" | "In Review" | "Final";
export type Lane =
  | "Business"
  | "Ontology"
  | "Design Time"
  | "Train Time"
  | "Runtime"
  | "Monitoring"
  | "Governance"
  | "Deployment"
  | "Retirement";

export interface ArchitectureBlock {
  id: string;
  title: string;
  what: string;
  why: string;
  how: string;
  input: string[];
  output: string[];
  dependencies: string[];
  governance: string[];
  doneDefinition: string[];
  ownerRoles: Role[];
  contributorRoles: Role[];
  todos: Partial<Record<Role, string[]>>;
}

export interface Section {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  lane: Lane;
  status: SectionStatus;
  ownerRoles: Role[];
  contributorRoles: Role[];
  purpose: string;
  keyMessage: string;
  flow: string[];
  blocks: ArchitectureBlock[];
  questionsToAnswer: string[];
  doneDefinition: string[];
  speakerNotes: string;
  dependencies: string[];
  governanceNotes: string[];
}

const defaultTodos: Partial<Record<Role, string[]>> = {
  "BA/DA": ["[BA/DA TODO] Bổ sung KPI, policy rule, acceptance criteria."],
  DS: ["[DS TODO] Bổ sung feature logic, label definition, calibration method."],
  DE: ["[DE TODO] Bổ sung data source, pipeline, SLA, lineage."],
  Dev: ["[Dev TODO] Bổ sung API contract, error handling, integration."],
  "System/Security": ["[System/Security TODO] Bổ sung access control, audit, encryption, deployment control."],
};

function block(
  id: string,
  title: string,
  ownerRoles: Role[],
  contributorRoles: Role[],
  overrides: Partial<ArchitectureBlock> = {},
): ArchitectureBlock {
  return {
    id,
    title,
    what: overrides.what ?? "Template block để team mô tả nội dung chính của kiến trúc.",
    why: overrides.why ?? "Giải thích vì sao block này quan trọng trong lifecycle A-Score.",
    how: overrides.how ?? "Mô tả cách triển khai, control point và bằng chứng cần có.",
    input: overrides.input ?? ["Input placeholder"],
    output: overrides.output ?? ["Output placeholder"],
    dependencies: overrides.dependencies ?? ["Dependency placeholder"],
    governance: overrides.governance ?? ["Approval / audit / ownership placeholder"],
    doneDefinition: overrides.doneDefinition ?? ["Definition of Done placeholder"],
    ownerRoles,
    contributorRoles,
    todos: overrides.todos ?? defaultTodos,
  };
}

function section(
  order: number,
  id: string,
  title: string,
  subtitle: string,
  lane: Lane,
  ownerRoles: Role[],
  contributorRoles: Role[],
  blocks: ArchitectureBlock[],
  overrides: Partial<Section> = {},
): Section {
  return {
    id,
    order,
    title,
    subtitle,
    lane,
    status: overrides.status ?? "Need Input",
    ownerRoles,
    contributorRoles,
    purpose: overrides.purpose ?? "Mục đích của slide này là đặt câu hỏi đúng và chốt nội dung cần bổ sung.",
    keyMessage: overrides.keyMessage ?? "Key message placeholder để presenter chốt lại trong 1 câu.",
    flow: overrides.flow ?? ["Context", "Decision", "Architecture", "Governance", "Done"],
    blocks,
    questionsToAnswer: overrides.questionsToAnswer ?? [
      "Người nghe cần hiểu điều gì sau slide này?",
      "Input/output chính là gì?",
      "Ai cần bổ sung nội dung nào?",
    ],
    doneDefinition: overrides.doneDefinition ?? [
      "Owner xác nhận nội dung chính.",
      "Dependencies và governance notes được bổ sung.",
      "Các TODO theo role được đóng hoặc chuyển sang backlog.",
    ],
    speakerNotes: overrides.speakerNotes ?? "Speaker notes placeholder: nói ngắn, nhấn key message, mở appendix nếu bị hỏi sâu.",
    dependencies: overrides.dependencies ?? ["Dependency placeholder"],
    governanceNotes: overrides.governanceNotes ?? ["Governance note placeholder"],
  };
}

export const sections: Section[] = [
  section(1, "cover", "Đo lường chỉ số niềm tin khách hàng", "Customer Trust Index", "Business", ["BA/DA"], ["DS", "DE", "Dev", "System/Security"], [
    block("cover-context", "Project identity", ["BA/DA"], ["DS", "DE", "Dev", "System/Security"], {
      what: "Trang mở đầu giới thiệu đề tài, nhóm thực hiện và lời hứa của bài thuyết trình.",
      why: "Giúp người nghe nắm nhanh phạm vi: đo lường niềm tin khách hàng bằng kiến trúc scoring có kiểm soát.",
      input: ["Tên đề tài", "Thành viên", "Scope trình bày"],
      output: ["Narrative frame", "Expectation cho phần lifecycle"],
      doneDefinition: ["Tên đề tài và thành viên đã xác nhận.", "Thông điệp mở đầu rõ trong 30 giây."],
    }),
  ], {
    status: "Draft",
    keyMessage: "CTI không chỉ là điểm số, mà là một lifecycle đo lường, kiểm soát và vận hành niềm tin khách hàng.",
    speakerNotes: "Mở bằng bối cảnh: team không trình bày report dài, mà dẫn người nghe đi qua kiến trúc A-Score theo lifecycle.",
  }),
  section(2, "business-case", "Business Case", "Why now, why CTI, why architecture matters", "Business", ["BA/DA"], ["DS"], [
    block("business-value", "Business value hypothesis", ["BA/DA"], ["DS"], {
      what: "Giả thuyết giá trị kinh doanh của CTI.",
      why: "Không có business case rõ, model dễ trở thành bài toán kỹ thuật không gắn decision.",
      how: "Liên kết KPI, use case ra quyết định, rủi ro vận hành và expected impact.",
      input: ["Business objective", "Decision use case", "Baseline KPI"],
      output: ["KPI tree", "Success criteria", "Scope boundary"],
      doneDefinition: ["Business objective, KPI và decision use case được xác nhận."],
    }),
  ], {
    purpose: "Chốt lý do tồn tại của CTI trước khi đi vào dữ liệu và mô hình.",
    keyMessage: "Business Case trả lời: CTI tạo giá trị gì và được dùng trong quyết định nào.",
    flow: ["Pain point", "Opportunity", "Decision use case", "KPI", "Scope"],
    questionsToAnswer: ["CTI hỗ trợ quyết định nào?", "KPI kinh doanh nào bị ảnh hưởng?", "Không làm CTI thì rủi ro gì?"],
  }),
  section(3, "business-problem", "Business Problem", "Translate business need into scoring problem", "Business", ["BA/DA"], ["DS", "DE"], [
    block("problem-framing", "Scoring problem framing", ["BA/DA", "DS"], ["DE"], {
      what: "Định nghĩa bài toán scoring từ góc nhìn business.",
      why: "Đảm bảo target, policy và score interpretation cùng nói một ngôn ngữ.",
      how: "Mapping stakeholder need → scoring objective → decision policy → risk constraint.",
      input: ["Use case", "Policy rule", "Customer segment"],
      output: ["Problem statement", "Target expectation", "Constraint list"],
    }),
  ], {
    keyMessage: "Một scoring system tốt bắt đầu từ problem statement đủ hẹp và đủ đo được.",
    flow: ["Business need", "Decision", "Score meaning", "Constraint", "Acceptance"],
  }),
  section(4, "business-ontology", "Business Ontology & Domain", "Shared language for customer, trust signal and decision context", "Ontology", ["BA/DA", "DE"], ["DS"], [
    block("domain-objects", "Domain objects", ["BA/DA", "DE"], ["DS"], {
      what: "Danh sách entity, event, attribute và relationship trong domain CTI.",
      why: "Ontology giúp tránh mỗi role hiểu 'trust', 'risk', 'customer' theo cách khác nhau.",
      how: "Xây domain map, data dictionary và semantic contract.",
      input: ["Customer profile", "Transaction events", "Behavior signals"],
      output: ["Domain object map", "Business glossary", "Data contract"],
      doneDefinition: ["Domain objects, business events và outcome được mapping."],
    }),
  ], {
    keyMessage: "Ontology là lớp ngôn ngữ chung trước khi nói đến feature hay model.",
    dependencies: ["Source system catalog", "Business glossary", "Data owners"],
  }),
  section(5, "risk-ontology", "Risk Ontology", "Define outcome, label, risk factor and explainability vocabulary", "Ontology", ["DS"], ["BA/DA", "DE"], [
    block("risk-vocabulary", "Risk vocabulary", ["DS"], ["BA/DA", "DE"], {
      what: "Ngôn ngữ rủi ro cho target, label, proxy, factor và reason code.",
      why: "Nếu risk ontology mơ hồ, model validation và explainability sẽ khó thống nhất.",
      how: "Mapping outcome → label window → feature group → reason code.",
      input: ["Outcome definition", "Policy rule", "Historical event"],
      output: ["Label config", "Risk factor taxonomy", "Reason code draft"],
    }),
  ], {
    keyMessage: "Risk Ontology biến domain language thành ngôn ngữ model có thể kiểm định.",
  }),
  section(6, "raci", "Role Map / RACI Overview", "Who owns, contributes, approves and reviews each lifecycle stage", "Governance", ["BA/DA"], ["DS", "DE", "Dev", "System/Security"], [
    block("raci-overview", "Lifecycle RACI", ["BA/DA"], ["DS", "DE", "Dev", "System/Security"], {
      what: "Ma trận trách nhiệm theo lifecycle.",
      why: "Template cần biết ai bổ sung nội dung nào mà không biến menu chính thành role menu.",
      how: "Role filter highlight ownership nhưng giữ nguyên thứ tự lifecycle.",
      input: ["Role list", "Section ownership"],
      output: ["RACI matrix", "Needs input list"],
    }),
  ], {
    keyMessage: "Role là overlay để hoàn thiện nội dung, lifecycle vẫn là trục kể chính.",
  }),
  section(7, "end-to-end", "A-Score End-to-End Overview", "One-page architecture story from request to decision feedback", "Design Time", ["Dev", "DE"], ["DS", "System/Security"], [
    block("e2e-flow", "End-to-end flow", ["Dev", "DE"], ["DS", "System/Security"], {
      what: "Tổng quan request → data/feature → model → decision → feedback.",
      why: "Slide này là bản đồ để người nghe định vị các phần sau.",
      how: "Dùng architecture blocks và dependencies để nối các lane.",
      input: ["Caller request", "Feature sources", "Model artifact"],
      output: ["Score response", "Decision log", "Feedback event"],
    }),
  ], {
    keyMessage: "End-to-end overview là bản đồ tổng trước khi zoom vào từng lane.",
    flow: ["Request", "Feature", "Model", "Decision", "Feedback"],
  }),
  section(8, "design-time", "Design Time Lane", "Feature dictionary, contract, registry and validation rules", "Design Time", ["DE", "Dev"], ["DS", "System/Security"], [
    block("design-contract", "Feature and API contracts", ["DE", "Dev"], ["DS", "System/Security"], {
      what: "Các contract thiết kế trước khi train/run.",
      why: "Contract rõ giúp giảm lỗi runtime và mismatch giữa training-serving.",
      how: "Version feature dictionary, API schema, validation rule, security boundary.",
      input: ["Domain object", "Feature candidate", "API consumer"],
      output: ["Feature dictionary", "API contract", "Validation rule"],
      doneDefinition: ["Feature dictionary, registry, lineage và validation rule hoàn chỉnh."],
    }),
  ], {
    keyMessage: "Design Time quyết định runtime có kiểm soát được hay không.",
  }),
  section(9, "train-time", "Train Time Lane", "Dataset, experiment, artifact and validation report", "Train Time", ["DS", "DE"], ["BA/DA", "Dev"], [
    block("training-pipeline", "Training pipeline", ["DS", "DE"], ["BA/DA", "Dev"], {
      what: "Pipeline tạo training dataset, train model và lưu artifact.",
      why: "Model phải reproducible, versioned và có validation evidence.",
      how: "Version dataset, label config, experiment, artifact, validation report.",
      input: ["Feature snapshot", "Label config", "Experiment config"],
      output: ["Model artifact", "Validation report", "Score mapping"],
      doneDefinition: ["Outcome, label config, training dataset, model artifact và validation report được version."],
    }),
  ], {
    keyMessage: "Train Time tạo bằng chứng để model được phép đi vào runtime.",
  }),
  section(10, "score-framework", "Unified Score Framework", "Score scale, tiering, calibration and interpretation", "Train Time", ["DS"], ["BA/DA", "Dev"], [
    block("score-framework-block", "Score scale and tiering", ["DS"], ["BA/DA", "Dev"], {
      what: "Khung thống nhất cho score, grade, tier, reason code.",
      why: "Một score chỉ hữu ích khi business hiểu và dùng đúng.",
      how: "Define score scale, threshold, band, calibration and reason code.",
      input: ["Raw model output", "Policy threshold", "Calibration sample"],
      output: ["Unified score", "Grade", "Reason codes"],
    }),
  ], {
    keyMessage: "Unified framework biến model output thành chỉ số có thể dùng trong quyết định.",
  }),
  section(11, "runtime", "Runtime Lane", "API, feature serving, model serving and audit response", "Runtime", ["Dev"], ["DE", "DS", "System/Security"], [
    block("runtime-serving", "Online serving", ["Dev"], ["DE", "DS", "System/Security"], {
      what: "Runtime path từ API request đến score response.",
      why: "Đây là nơi reliability, latency, security và audit cùng xuất hiện.",
      how: "API validation, feature retrieval, model serving, logging, fallback.",
      input: ["Request payload", "Feature vector", "Model artifact"],
      output: ["Score response", "Audit log", "Replay package"],
      doneDefinition: ["API, feature serving, model serving, decision response và audit log được kiểm thử."],
    }),
  ], {
    keyMessage: "Runtime không chỉ chạy model, mà phải trả score có thể tin, kiểm tra và replay.",
    flow: ["Request", "Validate", "Feature", "Inference", "Response", "Log"],
  }),
  section(12, "decision-engine", "Decision Engine", "Policy orchestration and decision traceability", "Runtime", ["Dev", "BA/DA"], ["DS", "System/Security"], [
    block("decision-policy", "Decision policy", ["BA/DA", "Dev"], ["DS", "System/Security"], {
      what: "Policy layer dùng CTI score để đưa ra action.",
      why: "Score cần được chuyển thành quyết định có trace và control.",
      how: "Policy rule, threshold, manual review, override log.",
      input: ["Score", "Grade", "Policy rule"],
      output: ["System decision", "Reason code", "Override trail"],
    }),
  ], {
    keyMessage: "Decision Engine là điểm score trở thành hành động có kiểm soát.",
  }),
  section(13, "monitoring-feedback", "Monitoring & Feedback Lane", "Feature, prediction, decision and business KPI monitoring", "Monitoring", ["DE", "Dev"], ["DS", "BA/DA", "System/Security"], [
    block("monitoring-stack", "Monitoring stack", ["DE", "Dev"], ["DS", "BA/DA", "System/Security"], {
      what: "Monitoring cho dữ liệu, model, runtime, decision và KPI.",
      why: "Không monitor thì không biết khi nào score mất tin cậy.",
      how: "Threshold, dashboard, alert, owner, feedback loop.",
      input: ["Feature log", "Prediction log", "Decision outcome"],
      output: ["Dashboard", "Alert", "Feedback dataset"],
      doneDefinition: ["Feature, prediction, decision và business KPI monitoring có threshold và owner."],
    }),
  ], {
    keyMessage: "Monitoring đóng vòng feedback giữa scoring quality và business outcome.",
  }),
  section(14, "governance", "Governance Layer", "Approval gates, auditability, access control and model accountability", "Governance", ["System/Security", "BA/DA"], ["DS", "DE", "Dev"], [
    block("governance-controls", "Governance controls", ["System/Security", "BA/DA"], ["DS", "DE", "Dev"], {
      what: "Các control bảo vệ lifecycle scoring.",
      why: "CTI ảnh hưởng decision nên cần approval, audit, access và accountability.",
      how: "Approval gates, audit trail, RBAC, encryption, model review cadence.",
      input: ["Artifact", "Policy", "Access request"],
      output: ["Approval evidence", "Audit trail", "Access matrix"],
    }),
  ], {
    keyMessage: "Governance là lớp kiểm soát xuyên suốt, không phải slide cuối để trang trí.",
  }),
  section(15, "deployment", "Deployment Strategy", "Release package, shadow/canary, rollback and approval gate", "Deployment", ["Dev", "System/Security"], ["DS", "DE"], [
    block("release-plan", "Release plan", ["Dev", "System/Security"], ["DS", "DE"], {
      what: "Cách đưa model/service vào production.",
      why: "Deployment cần kiểm soát blast radius và có rollback rõ ràng.",
      how: "Shadow, canary, champion/challenger, kill switch, rollback package.",
      input: ["Approved artifact", "Release checklist", "Infra config"],
      output: ["Release package", "Canary report", "Rollback plan"],
      doneDefinition: ["Release package, approval gate, rollback plan và access control hoàn chỉnh."],
    }),
  ], {
    keyMessage: "Deployment Strategy làm rõ cách đi live mà vẫn kiểm soát rủi ro.",
  }),
  section(16, "retirement", "Retirement Strategy", "Stop serving safely while preserving replay and audit", "Retirement", ["DS", "System/Security"], ["BA/DA", "Dev", "DE"], [
    block("retire-plan", "Retirement plan", ["DS", "System/Security"], ["BA/DA", "Dev", "DE"], {
      what: "Điều kiện dừng model/service cũ.",
      why: "Retirement sai có thể làm mất khả năng audit hoặc replay.",
      how: "Stop serving, archive artifact, preserve dataset and replay metadata.",
      input: ["Replacement model", "Retirement criteria", "Audit requirement"],
      output: ["Retired version", "Archive package", "Communication plan"],
      doneDefinition: ["Model cũ stop serving nhưng artifact vẫn replay/audit được."],
    }),
  ], {
    keyMessage: "Retirement là một phần của lifecycle, không phải dọn dẹp sau cùng.",
  }),
  section(17, "summary", "Final Summary", "What the architecture enables and what each role completes next", "Governance", ["BA/DA"], ["DS", "DE", "Dev", "System/Security"], [
    block("summary-next-step", "Next completion plan", ["BA/DA"], ["DS", "DE", "Dev", "System/Security"], {
      what: "Tổng kết narrative và phần còn trống cho từng role.",
      why: "Kết thúc bằng action rõ để team hoàn thiện template.",
      how: "Review TODO, assign owners, lock next milestone.",
      input: ["Open TODO", "Review feedback", "Decision from meeting"],
      output: ["Action list", "Owner", "Target completion date"],
    }),
  ], {
    keyMessage: "Final Summary chốt lại lifecycle và biến câu hỏi của người nghe thành TODO có owner.",
    flow: ["Recap", "Open decisions", "Owner", "Next milestone"],
  }),
];
