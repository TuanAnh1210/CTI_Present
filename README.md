# Customer Trust Index · A-Score Architecture Presentation

Website này là **interactive presentation template** cho dự án **A-Score Credit Scoring Architecture / Customer Trust Index**.

Mục tiêu của template:

- Dùng như một bài thuyết trình dạng slide/architecture portal.
- Đi theo lifecycle chính, không chia menu chính theo role.
- Cho phép BA/DA, DS, DE, Dev, System/Security cùng bổ sung nội dung.
- Team chỉ cần sửa dữ liệu trong `src/data/`, hạn chế sửa component.

## 1. Cách chạy

Yêu cầu máy có Node.js và npm.

### Cài thư viện

```bash
npm install
```

### Chạy local dev server

```bash
npm run dev
```

Mặc định Vite sẽ mở ở một port như:

```text
http://127.0.0.1:5173/
```

Nếu muốn chạy đúng port đang dùng trong demo:

```bash
npm run dev -- --port 8137
```

Sau đó mở:

```text
http://127.0.0.1:8137/
```

### Build production

```bash
npm run build
```

Output build nằm trong thư mục:

```text
dist/
```

### Preview bản build

```bash
npm run preview
```

## 2. Phím tắt khi thuyết trình

- `ArrowRight`: sang section tiếp theo
- `ArrowLeft`: quay lại section trước
- `Home`: về section đầu tiên
- `End`: tới section cuối
- `/`: mở Quick Jump để tìm nhanh section/block/role/status/lane/keyword

Các nút dưới màn hình:

- Previous / Next: chuyển section
- Search: mở Quick Jump
- Presenter: bật/tắt presenter mode

Presenter mode hiển thị:

- Speaker notes
- Key message
- Preview section tiếp theo

## 3. Giải thích các khối trên giao diện

Web được thiết kế như một bài thuyết trình tương tác. Mỗi màn hình chính là một **section/slide** trong lifecycle.

### 3.1 Sidebar lifecycle

Vị trí: bên trái màn hình desktop.

Mục đích:

- Là menu chính của bài thuyết trình.
- Luôn đi theo lifecycle, không đi theo role.
- Cho phép nhảy nhanh tới một section bất kỳ.

Hiển thị:

- Số thứ tự section.
- Tên section.
- Màu chấm nhỏ theo lifecycle lane.

Ví dụ:

```text
01 Cover
02 Business Case
03 Business Problem
...
17 Final Summary
```

Khi sửa nội dung:

- Sidebar lấy dữ liệu từ `sections` trong `src/data/sections.ts`.
- Muốn đổi tên menu thì đổi `title`.
- Muốn đổi thứ tự thì đổi `order`.

### 3.2 Top lifecycle progress

Vị trí: thanh ngang trên cùng của vùng trình chiếu.

Mục đích:

- Cho người nghe biết đang ở đâu trong toàn bộ lifecycle.
- Mỗi vạch là một section.
- Màu vạch lấy theo lane: Business, Ontology, Runtime, Governance, v.v.

Khi click vào một vạch:

- Web nhảy tới section tương ứng.

Khi sửa nội dung:

- Không cần sửa component.
- Progress tự sinh theo mảng `sections`.

### 3.3 Role overlay / Role filter

Vị trí: trong Sidebar.

Mục đích:

- Giúp từng role biết phần nào cần bổ sung.
- Không thay đổi thứ tự trình bày.
- Chỉ highlight hoặc làm mờ block không liên quan.

Các role:

- BA/DA
- DS
- DE
- Dev
- System/Security

Ví dụ:

- Chọn `DS`: các block do DS owner/contributor sẽ nổi bật.
- Các block không liên quan DS sẽ mờ đi.

Khi sửa nội dung:

- Role filter dựa vào `ownerRoles` và `contributorRoles`.
- Sửa ở `src/data/sections.ts`.

### 3.4 Quick Jump modal

Mở bằng:

```text
/
```

Mục đích:

- Tìm nhanh khi người nghe hỏi.
- Search được theo section title, block title, role, keyword, status, lifecycle lane.

Ví dụ có thể search:

```text
runtime
Dev
Need Input
Governance
artifact
```

Khi chọn một kết quả:

- Web nhảy tới section tương ứng.

### 3.5 Presenter controls

Vị trí: cụm nút nổi phía dưới màn hình.

Gồm:

- Previous
- Search
- Presenter mode
- Next

Mục đích:

- Điều khiển presentation mà không cần dùng sidebar.
- Hữu ích khi đang chiếu full screen hoặc đứng trình bày.

### 3.6 Section header

Đây là phần đầu của mỗi slide/section.

Hiển thị:

- Lifecycle lane
- Status badge
- Số thứ tự section
- Title
- Subtitle
- Role ownership

Ví dụ:

```text
Runtime · Need Input · 11 / 17
Runtime Lane
API, feature serving, model serving and audit response
```

Các trường tương ứng trong `src/data/sections.ts`:

```ts
title
subtitle
lane
status
ownerRoles
contributorRoles
```

### 3.7 Purpose block

Mục đích:

- Giải thích section này tồn tại để làm gì.
- Giúp presenter mở đầu slide ngắn gọn.

Nguồn dữ liệu:

```ts
purpose
```

Ví dụ:

```ts
purpose: "Chốt lý do tồn tại của CTI trước khi đi vào dữ liệu và mô hình."
```

### 3.8 Key message block

Mục đích:

- Một câu chốt chính của slide.
- Người thuyết trình nên nói rõ câu này.
- Giúp tránh biến slide thành báo cáo dài.

Nguồn dữ liệu:

```ts
keyMessage
```

Ví dụ:

```ts
keyMessage: "Runtime không chỉ chạy model, mà phải trả score có thể tin, kiểm tra và replay."
```

### 3.9 Lifecycle flow block

Mục đích:

- Hiển thị flow ngắn trong section.
- Dùng để dẫn mắt người nghe qua logic chính.

Nguồn dữ liệu:

```ts
flow: ["Request", "Validate", "Feature", "Inference", "Response", "Log"]
```

Nên viết flow ngắn, mỗi bước 1-3 từ.

Không nên viết:

```ts
flow: ["Bước này dùng để validate toàn bộ request trước khi gọi feature store"]
```

Nên viết:

```ts
flow: ["Request", "Validate", "Feature Store", "Inference"]
```

### 3.10 Governance notes bar

Mục đích:

- Ghi các lưu ý kiểm soát/governance của section.
- Nhắc presenter rằng mỗi phần kiến trúc phải có control, không chỉ có flow.

Nguồn dữ liệu:

```ts
governanceNotes
```

Ví dụ:

```ts
governanceNotes: [
  "Artifact phải có approval trước production.",
  "Runtime log phải replay được."
]
```

### 3.11 Architecture block/card

Đây là khối quan trọng nhất trong mỗi section.

Mỗi card đại diện cho một thành phần kiến trúc hoặc một ý chính cần team hoàn thiện.

Một card gồm:

- Title
- What
- Why
- How
- Input
- Output
- Dependencies
- TODO
- Owner roles

Nguồn dữ liệu:

```ts
blocks
```

Ví dụ:

```ts
block("runtime-serving", "Online serving", ["Dev"], ["DE", "DS"], {
  what: "Runtime path từ API request đến score response.",
  why: "Đây là nơi reliability, latency, security và audit cùng xuất hiện.",
  how: "API validation, feature retrieval, model serving, logging, fallback.",
  input: ["Request payload", "Feature vector", "Model artifact"],
  output: ["Score response", "Audit log", "Replay package"],
})
```

Ý nghĩa từng field trong card:

- `what`: block này là gì.
- `why`: tại sao block này quan trọng.
- `how`: triển khai hoặc kiểm soát thế nào.
- `input`: đầu vào cần có.
- `output`: đầu ra tạo ra.
- `dependencies`: phụ thuộc vào hệ thống/data nào.
- `governance`: cần kiểm soát gì.
- `doneDefinition`: khi nào xem là xong.
- `ownerRoles`: role chịu trách nhiệm chính.
- `contributorRoles`: role phối hợp.
- `todos`: phần cần từng role bổ sung.

### 3.12 TODO / Needs input panel

Vị trí: cột bên phải trong mỗi section.

Mục đích:

- Cho biết section/block này còn cần role nào bổ sung.
- Khi chọn role filter, panel chỉ tập trung vào TODO của role đó.

Nguồn dữ liệu:

```ts
todos
```

Ví dụ:

```ts
todos: {
  DS: ["[DS TODO] Bổ sung feature logic và calibration method."],
  Dev: ["[Dev TODO] Bổ sung API contract và error handling."]
}
```

### 3.13 Questions to answer panel

Mục đích:

- Danh sách câu hỏi section cần trả lời.
- Dùng khi team review nội dung: nếu chưa trả lời được thì section chưa đủ.

Nguồn dữ liệu:

```ts
questionsToAnswer
```

Ví dụ:

```ts
questionsToAnswer: [
  "CTI hỗ trợ quyết định nào?",
  "KPI kinh doanh nào bị ảnh hưởng?",
  "Không làm CTI thì rủi ro gì?"
]
```

### 3.14 Definition of Done panel

Mục đích:

- Tiêu chí hoàn thành section.
- Giúp team biết khi nào một phần đủ để trình bày.

Nguồn dữ liệu:

```ts
doneDefinition
```

Ví dụ:

```ts
doneDefinition: [
  "Business objective, KPI và decision use case được xác nhận.",
  "Owner xác nhận nội dung chính."
]
```

### 3.15 Dependencies panel

Mục đích:

- Liệt kê dependency của section.
- Có thể là source system, artifact, policy, service, approval hoặc team khác.

Nguồn dữ liệu:

```ts
dependencies
```

Ví dụ:

```ts
dependencies: ["Feature Store", "Model Registry", "Policy Engine"]
```

### 3.16 Speaker Notes

Chỉ hiện khi bật Presenter mode.

Mục đích:

- Ghi chú riêng cho người thuyết trình.
- Không nên viết quá dài.
- Nên viết như cue card: mở đầu thế nào, nhấn ý nào, nếu bị hỏi thì mở appendix nào.

Nguồn dữ liệu:

```ts
speakerNotes
```

### 3.17 Next section preview

Chỉ hiện khi bật Presenter mode.

Mục đích:

- Cho presenter biết slide tiếp theo là gì.
- Giúp chuyển ý mượt hơn.

Không cần sửa riêng vì tự lấy từ section tiếp theo.

### 3.18 RACI Matrix

Chỉ hiển thị ở section:

```text
Role Map / RACI Overview
```

Mục đích:

- Cho biết role nào Responsible, Accountable, Consulted, Informed theo lifecycle.

Nguồn dữ liệu:

```text
src/data/raci.ts
```

Hiện tại RACI sinh tự động từ `ownerRoles` và `contributorRoles`.

### 3.19 Appendix quick links

Hiển thị ở slide `Final Summary`.

Mục đích:

- Mở nhanh các trang sơ đồ chi tiết khi người nghe hỏi sâu.

Nguồn dữ liệu:

```text
src/data/sampleContent.ts
```

Ví dụ:

```ts
{ label: "Workflow control", href: "/pages/kiem_soat_workflow.html" }
```

Các trang appendix cũ cũng có nút:

```text
← Bài thuyết trình
```

để quay lại presentation.

## 4. Cấu trúc thư mục chính

```text
CTI_Present/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tailwind.config.ts
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ styles.css
│  ├─ components/
│  ├─ data/
│  └─ lib/
├─ pages/
├─ assets/
└─ workflow/
```

Trong đó:

- `src/components/`: UI components.
- `src/data/`: nơi team sửa nội dung.
- `src/lib/`: helper cấu hình màu/icon theo lifecycle lane.
- `pages/`: các trang appendix cũ như workflow, failsafe, circuit breaker.
- `assets/`: CSS/JS/data cũ cho các trang appendix.
- `workflow/`: file drawio dùng cho workflow page.

## 5. Quy tắc chỉnh sửa nội dung

Team nên sửa trong các file này:

- `src/data/sections.ts`: nội dung chính của bài thuyết trình.
- `src/data/roles.ts`: danh sách role, thành viên, mô tả trách nhiệm.
- `src/data/sampleContent.ts`: link appendix.
- `src/data/glossary.ts`: glossary.

Không nên sửa component nếu chỉ muốn đổi nội dung slide.

## 6. Các file data

### `src/data/roles.ts`

Quản lý role và thành viên.

Ví dụ:

```ts
{
  role: "Dev",
  label: "Application Development",
  memberNames: ["Nguyễn Tuấn Anh", "Hoàng Mai Duy"],
  responsibility: "API, runtime integration, logging, error handling, CI/CD.",
  color: "bg-blue-600 text-white",
  Icon: Code2,
}
```

Khi cần sửa tên thành viên hoặc trách nhiệm role, sửa ở đây.

Role hiện hỗ trợ:

- `BA/DA`
- `DS`
- `DE`
- `Dev`
- `System/Security`

### `src/data/sections.ts`

Đây là file quan trọng nhất. Mỗi lifecycle section là một slide chính.

Mỗi `Section` có:

- `id`: mã định danh, viết thường, không dấu, không khoảng trắng.
- `order`: thứ tự xuất hiện.
- `title`: tiêu đề section.
- `subtitle`: mô tả ngắn.
- `lane`: nhóm lifecycle.
- `status`: trạng thái nội dung.
- `ownerRoles`: role chịu trách nhiệm chính.
- `contributorRoles`: role phối hợp.
- `purpose`: mục đích section.
- `keyMessage`: thông điệp chính để presenter chốt.
- `flow`: các bước flow ngắn.
- `blocks`: các architecture block/card.
- `questionsToAnswer`: câu hỏi cần trả lời.
- `doneDefinition`: điều kiện hoàn thành.
- `speakerNotes`: ghi chú cho người thuyết trình.
- `dependencies`: dependency của section.
- `governanceNotes`: lưu ý governance.

Lane hợp lệ:

```ts
"Business"
"Ontology"
"Design Time"
"Train Time"
"Runtime"
"Monitoring"
"Governance"
"Deployment"
"Retirement"
```

Status hợp lệ:

```ts
"Draft"
"Need Input"
"In Review"
"Final"
```

### `src/data/raci.ts`

RACI đang được sinh tự động từ `sections`.

Logic hiện tại:

- Role đầu tiên trong `ownerRoles` = `A`
- Các role còn lại trong `ownerRoles` = `R`
- Role trong `contributorRoles` = `C`

Nếu muốn custom RACI thủ công, có thể sửa file này sau.

### `src/data/sampleContent.ts`

Chứa các link appendix hiển thị ở slide `Final Summary`.

Ví dụ:

```ts
{ label: "Workflow control", href: "/pages/kiem_soat_workflow.html" }
```

### `src/data/glossary.ts`

Chứa glossary. Hiện chưa render thành panel riêng, nhưng đã chuẩn bị data để mở rộng sau.

## 7. Cách thêm section mới

Mở `src/data/sections.ts`.

Thêm một phần tử mới vào mảng `sections`.

Ví dụ:

```ts
section(
  18,
  "model-risk-review",
  "Model Risk Review",
  "Independent review before production approval",
  "Governance",
  ["DS"],
  ["BA/DA", "DE", "Dev", "System/Security"],
  [
    block("risk-review-checklist", "Risk review checklist", ["DS"], ["System/Security"], {
      what: "Checklist review rủi ro model trước khi go-live.",
      why: "Đảm bảo model có validation evidence và approval rõ.",
      how: "Review validation report, drift threshold, override policy và audit evidence.",
      input: ["Validation report", "Model artifact", "Approval request"],
      output: ["Risk review note", "Approval decision"],
      doneDefinition: ["Reviewer xác nhận model đủ điều kiện triển khai."],
    }),
  ],
  {
    keyMessage: "Model chỉ được deploy khi review rủi ro đã hoàn tất.",
    flow: ["Evidence", "Review", "Approval", "Release gate"],
  },
)
```

Lưu ý:

- `order` không được trùng.
- `id` không được trùng.
- `lane` phải thuộc danh sách lane hợp lệ.
- Role phải đúng tên role hợp lệ.

## 8. Cách sửa section có sẵn

Mở `src/data/sections.ts`, tìm theo `id` hoặc `title`.

Ví dụ muốn sửa `Runtime Lane`, tìm:

```ts
section(11, "runtime", "Runtime Lane", ...)
```

Các phần thường cần sửa:

```ts
purpose: "..."
keyMessage: "..."
flow: ["Request", "Validate", "Feature", "Inference", "Response", "Log"]
questionsToAnswer: ["...", "..."]
doneDefinition: ["...", "..."]
speakerNotes: "..."
dependencies: ["...", "..."]
governanceNotes: ["...", "..."]
```

## 9. Cách xóa section

Mở `src/data/sections.ts`, xóa toàn bộ block `section(...)` tương ứng.

Sau khi xóa:

1. Kiểm tra lại `order` của các section còn lại.
2. Chạy:

```bash
npm run build
```

Nếu build pass là ổn.

## 10. Cách thêm architecture block/card trong section

Mỗi section có mảng `blocks`.

Ví dụ thêm block mới vào section `Runtime Lane`:

```ts
block("runtime-fallback", "Fallback strategy", ["Dev"], ["DS", "System/Security"], {
  what: "Chiến lược fallback khi feature/model service lỗi.",
  why: "Giúp hệ thống không ra quyết định sai khi dependency không tin cậy.",
  how: "Circuit breaker, timeout, retry, fallback policy, manual review.",
  input: ["Runtime error", "Dependency status", "Policy config"],
  output: ["Fallback outcome", "Audit log", "Alert"],
  dependencies: ["Feature Store", "Model Serving", "Policy Engine"],
  governance: ["Fallback phải có owner và threshold rõ."],
  doneDefinition: ["Fallback được test với lỗi dependency chính."],
})
```

## 11. Cách sửa TODO theo role

Trong mỗi `block(...)`, có thể thêm hoặc ghi đè `todos`.

Ví dụ:

```ts
todos: {
  "BA/DA": [
    "[BA/DA TODO] Bổ sung business KPI và policy rule.",
  ],
  DS: [
    "[DS TODO] Bổ sung feature logic và calibration method.",
  ],
  DE: [
    "[DE TODO] Bổ sung source system, SLA và lineage.",
  ],
  Dev: [
    "[Dev TODO] Bổ sung API contract và error handling.",
  ],
  "System/Security": [
    "[System/Security TODO] Bổ sung IAM, audit và encryption.",
  ],
}
```

Nếu không khai báo `todos`, hệ thống dùng TODO mặc định trong `defaultTodos`.

## 12. Cách đổi owner/contributor

Trong section:

```ts
ownerRoles: ["Dev"]
contributorRoles: ["DE", "DS", "System/Security"]
```

Trong block:

```ts
block("id", "Title", ["Dev"], ["DE", "DS"], { ... })
```

Role filter sẽ dựa vào `ownerRoles` và `contributorRoles` để highlight nội dung liên quan.

## 13. Các component trong web

### Layout/navigation

- `AppLayout.tsx`: layout chính gồm sidebar, top progress và vùng slide.
- `Sidebar.tsx`: menu lifecycle bên trái, role overlay, quick jump button, presenter mode button.
- `TopProgress.tsx`: thanh progress lifecycle ở đầu màn hình.
- `PresenterControls.tsx`: cụm nút nổi Previous / Search / Presenter / Next.
- `NextPrevControls.tsx`: nút previous/next cuối section.

### Section rendering

- `SectionView.tsx`: render một section/slide đầy đủ.
- `FlowDiagram.tsx`: render flow ngắn trong section.
- `LifecycleMiniMap.tsx`: minimap lifecycle.
- `ArchitectureBlockCard.tsx`: render từng architecture block/card.
- `GovernanceBar.tsx`: render governance notes.
- `SpeakerNotes.tsx`: render speaker notes khi bật presenter mode.

### Role/status

- `RoleFilter.tsx`: bộ lọc role overlay.
- `RoleBadge.tsx`: badge role.
- `TodoByRolePanel.tsx`: panel TODO theo role.
- `StatusBadge.tsx`: badge trạng thái Draft/Need Input/In Review/Final.
- `RaciMatrix.tsx`: bảng RACI ở section Role Map / RACI Overview.

### Search/modal

- `QuickJumpModal.tsx`: modal search mở bằng phím `/`.

## 14. Cách đổi màu/icon lifecycle

Mở:

```text
src/lib/lane.ts
```

Mỗi lane có:

```ts
{
  accent: "#00833E",
  bg: "bg-green-50",
  text: "text-green-800",
  Icon: Boxes,
}
```

Muốn đổi màu Runtime, sửa key `Runtime`.

## 15. Cách thêm appendix link

Mở:

```text
src/data/sampleContent.ts
```

Thêm:

```ts
{ label: "Tên trang", href: "/pages/ten_file.html" }
```

Các trang appendix cũ nằm trong:

```text
pages/
```

## 16. Quy trình đề xuất cho từng role

### BA/DA

Nên bổ sung:

- Business Case
- Business Problem
- KPI
- Decision use case
- Policy rule
- Acceptance criteria
- Dashboard/monitoring business KPI

File chính cần sửa:

```text
src/data/sections.ts
```

Tìm các section lane `Business` và các TODO `[BA/DA TODO]`.

### DS

Nên bổ sung:

- Target definition
- Label logic
- Feature logic
- Model approach
- Validation metric
- Calibration method
- Score band / reason code
- Drift threshold

Tìm các TODO `[DS TODO]`.

### DE

Nên bổ sung:

- Data source
- Feature pipeline
- Batch/online parity
- Lineage
- Data quality rule
- SLA
- Storage dependency

Tìm các TODO `[DE TODO]`.

### Dev

Nên bổ sung:

- API contract
- Runtime flow
- Error handling
- Idempotency
- Logging/replay
- Integration
- CI/CD
- Rollback

Tìm các TODO `[Dev TODO]`.

### System/Security

Nên bổ sung:

- IAM
- Network/security boundary
- Secrets
- Encryption
- Audit
- Deployment approval
- Compliance evidence
- Incident control

Tìm các TODO `[System/Security TODO]`.

## 17. Kiểm tra trước khi gửi lại

Sau khi sửa data, chạy:

```bash
npm run build
```

Nếu build pass, chạy local:

```bash
npm run dev -- --port 8137
```

Kiểm tra nhanh:

- Sidebar đúng thứ tự lifecycle.
- Quick Jump `/` tìm được section vừa sửa.
- Role filter highlight đúng block.
- Presenter mode có speaker notes.
- Appendix link vẫn mở được.

## 18. Lưu ý

- Không sửa `node_modules/`.
- Không sửa `dist/` thủ công.
- Không đưa nội dung dài như báo cáo vào một section; mỗi section nên giống một slide.
- Nếu nội dung quá dài, tách thành nhiều architecture block/card.
- Menu chính luôn đi theo lifecycle, không chuyển thành menu theo role.
- Role chỉ dùng để filter/highlight ownership và TODO.
