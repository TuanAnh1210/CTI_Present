/* Kịch bản go-live — map runbook 10 bước (Ch.6) + ma trận Phụ lục C + failsafe Ch.7 */
const SCENARIOS = [
  {
    id: "artifact",
    title: "Sai version artifact prod",
    type: "ARTIFACT_CFG",
    severity: "Critical",
    owner: "ML Platform",
    alert: "ALT-AR-01",
    failsafe: 6,
    steps: [
      { t: "T+0", phase: "Nền", what: "Deploy artifact v9.2 lên prod lúc 9:00 — auto-decision đang bật, traffic bình thường.", signal: "", actor: "—", state: { auto: "ON", severity: "—", scoring: "normal" } },
      { t: "T+1′", phase: "1. Phát hiện", what: "Prometheus: <code>artifact_load_fail_total</code> tăng; checksum mismatch trên pod mới. Alert <code>ALT-AR-01</code> kích hoạt.", signal: "ALT-AR-01", actor: "On-call ML Platform", state: { auto: "ON", severity: "High", scoring: "degraded" } },
      { t: "T+2′", phase: "2–3. Triage + phân loại", what: "Xác nhận version active trên prod khác registry approved. Gán severity <b>Critical</b>, issue type ARTIFACT_CFG.", signal: "ALT-AR-01", actor: "ML Platform + Backend", state: { auto: "ON", severity: "Critical", scoring: "unreliable" } },
      { t: "T+3′", phase: "4–5. Khoanh vùng + chuyển luồng", what: "Bật <b>kill switch Lv.6</b> — tắt auto-decision toàn bộ; scoring path chặn nếu artifact không tin cậy. Mọi case chuyển thủ công.", signal: "kill_switch_active", actor: "ML Platform (R) + Governance (A)", state: { auto: "OFF", severity: "Critical", scoring: "manual" } },
      { t: "T+8′", phase: "6–7. Điều tra + sửa", what: "Rollback artifact về N-1 trong registry; redeploy pod. Ghi audit: version trước/sau, người thực hiện.", signal: "", actor: "ML Platform", state: { auto: "OFF", severity: "High", scoring: "manual" } },
      { t: "T+15′", phase: "8. Xác thực", what: "Replay sample 50 ca — kết quả khớp shadow baseline. <code>checksum_ok=true</code>, <code>artifact_load_ok</code> về 0.", signal: "", actor: "Backend + Risk", state: { auto: "OFF", severity: "Medium", scoring: "validated" } },
      { t: "T+20′", phase: "9. Khôi phục", what: "Tắt kill switch sau sign-off Governance + Risk + Tech Lead. Bật lại auto-decision theo segment.", signal: "", actor: "Governance", state: { auto: "ON", severity: "Low", scoring: "normal" } },
      { t: "Sau", phase: "10. Đóng", what: "Post-mortem: nguyên nhân deploy sai tag; cập nhật checklist release; lưu replay package làm bằng chứng.", signal: "", actor: "Ops", state: { auto: "ON", severity: "—", scoring: "normal" } }
    ]
  },
  {
    id: "5xx",
    title: "Spike 5xx sau deploy",
    type: "RUNTIME_STAB",
    severity: "High",
    owner: "Backend",
    alert: "ALT-RT-01",
    failsafe: 5,
    steps: [
      { t: "T+0", phase: "Nền", what: "Release Prediction Service v2.4 lúc 14:00. Canary 10% → full traffic 14:30.", signal: "", actor: "—", state: { auto: "ON", severity: "—", scoring: "normal" } },
      { t: "T+2′", phase: "1. Phát hiện", what: "<code>api_success_rate</code> tụt dưới 99,5% trong 1h. Alert <code>ALT-RT-01</code> — spike HTTP 5xx.", signal: "ALT-RT-01", actor: "On-call Backend", state: { auto: "ON", severity: "High", scoring: "fail" } },
      { t: "T+4′", phase: "2–3. Triage + phân loại", what: "5xx tập trung pod v2.4; không liên quan data/artifact. Severity <b>High</b>, RUNTIME_STABILITY.", signal: "ALT-RT-01", actor: "Backend", state: { auto: "ON", severity: "High", scoring: "fail" } },
      { t: "T+6′", phase: "4–5. Khoanh vùng", what: "Tắt auto-decision phòng score không tin cậy trong lúc rollback. Chuẩn bị rollback deploy <b>Lv.5</b>.", signal: "", actor: "Backend + Decision Engine", state: { auto: "OFF", severity: "High", scoring: "manual" } },
      { t: "T+10′", phase: "6–7. Rollback deploy", what: "Rollback service về v2.3 (N-1). Traffic chuyển về bản ổn định.", signal: "", actor: "Backend", state: { auto: "OFF", severity: "Medium", scoring: "recovering" } },
      { t: "T+18′", phase: "8. Xác thực", what: "<code>api_success_rate</code> > 99,9%; P95 latency về SLA. Smoke test scoring OK.", signal: "", actor: "Backend + QA", state: { auto: "OFF", severity: "Low", scoring: "validated" } },
      { t: "T+25′", phase: "9. Khôi phục", what: "Bật lại auto-decision sau xác nhận metric ổn 15 phút.", signal: "", actor: "Backend", state: { auto: "ON", severity: "Low", scoring: "normal" } },
      { t: "Sau", phase: "10. Đóng", what: "Post-mortem release; fix bug v2.4 trước khi deploy lại.", signal: "", actor: "Backend", state: { auto: "ON", severity: "—", scoring: "normal" } }
    ]
  },
  {
    id: "missing",
    title: "Critical missing tăng vọt",
    type: "DATA_PIPELINE",
    severity: "High",
    owner: "Data Platform",
    alert: "ALT-DQ-01",
    failsafe: 4,
    steps: [
      { t: "T+0", phase: "Nền", what: "Pipeline batch đêm chạy lệch — một số feature critical null trên Feature Store.", signal: "", actor: "—", state: { auto: "ON", severity: "—", scoring: "normal" } },
      { t: "T+5′", phase: "1. Phát hiện", what: "<code>critical_missing_rate</code> vượt baseline. Alert <code>ALT-DQ-01</code>.", signal: "ALT-DQ-01", actor: "Data Platform", state: { auto: "ON", severity: "High", scoring: "degraded" } },
      { t: "T+8′", phase: "2–3. Triage + phân loại", what: "Ảnh hưởng ~15% request FULL tier. DATA_PIPELINE · High. Không rollback artifact — lỗi nguồn dữ liệu.", signal: "ALT-DQ-01", actor: "Data Platform + DS", state: { auto: "ON", severity: "High", scoring: "unreliable" } },
      { t: "T+10′", phase: "4–5. Chặn auto", what: "Bật policy <b>chặn auto-decision Lv.4</b> — case thiếu critical → NS/thủ công, không auto-approve.", signal: "", actor: "Data Platform + Decision Engine", state: { auto: "OFF", severity: "High", scoring: "manual" } },
      { t: "T+25′", phase: "6–7. Sửa pipeline", what: "DE chạy lại job batch; backfill feature critical. Theo dõi <code>critical_missing_rate</code>.", signal: "", actor: "Data Platform (DE)", state: { auto: "OFF", severity: "Medium", scoring: "manual" } },
      { t: "T+45′", phase: "8. Xác thực", what: "Missing rate về baseline; sample online/offline match OK.", signal: "", actor: "Data Platform + DS", state: { auto: "OFF", severity: "Low", scoring: "validated" } },
      { t: "T+50′", phase: "9. Khôi phục", what: "Gỡ chặn auto-decision; giám sát thêm 2h.", signal: "", actor: "Decision Engine", state: { auto: "ON", severity: "Low", scoring: "normal" } },
      { t: "Sau", phase: "10. Đóng", what: "Root cause: upstream feed trễ; thêm alert freshness sớm hơn.", signal: "", actor: "Data Platform", state: { auto: "ON", severity: "—", scoring: "normal" } }
    ]
  },
  {
    id: "logfail",
    title: "Ghi inference log fail",
    type: "LOGGING",
    severity: "Critical",
    owner: "Backend",
    alert: "ALT-LG-01",
    failsafe: 4,
    steps: [
      { t: "T+0", phase: "Nền", what: "Kafka cluster partial outage — consumer lag tăng nhưng API vẫn trả 200.", signal: "", actor: "—", state: { auto: "ON", severity: "—", scoring: "normal" } },
      { t: "T+3′", phase: "1. Phát hiện", what: "<code>inference_log_ok</code> < 99,9%. Alert <code>ALT-LG-01</code> Critical — mất audit trail.", signal: "ALT-LG-01", actor: "Backend + DA", state: { auto: "ON", severity: "Critical", scoring: "no-audit" } },
      { t: "T+5′", phase: "2–3. Phân loại", what: "Scoring vẫn chạy nhưng không có log/replay → không đủ tin cậy cho auto-decision. LOGGING · Critical.", signal: "ALT-LG-01", actor: "Backend", state: { auto: "ON", severity: "Critical", scoring: "no-audit" } },
      { t: "T+7′", phase: "4–5. Tắt auto + review kill", what: "<b>Lv.4</b> tắt auto-decision ngay (policy: thiếu log bắt buộc). Incident commander review có cần <b>Lv.6 kill switch</b> không.", signal: "ALT-LG-01", actor: "Backend + Governance", state: { auto: "OFF", severity: "Critical", scoring: "manual" } },
      { t: "T+20′", phase: "6–7. Sửa Kafka", what: "Khôi phục broker; replay buffer local → Kafka; xác nhận consumer bắt kịp.", signal: "", actor: "Backend + DE", state: { auto: "OFF", severity: "High", scoring: "manual" } },
      { t: "T+35′", phase: "8. Xác thực", what: "<code>inference_log_ok</code> ≥ 99,9% liên tục 15 phút; replay package ghi OK.", signal: "", actor: "Backend", state: { auto: "OFF", severity: "Medium", scoring: "validated" } },
      { t: "T+40′", phase: "9. Khôi phục", what: "Bật auto-decision sau sign-off — điều kiện log/replay đủ Ch.5.", signal: "", actor: "Governance + Risk", state: { auto: "ON", severity: "Low", scoring: "normal" } },
      { t: "Sau", phase: "10. Đóng", what: "Post-mortem: SLA Kafka; drill DRILL-03 (ALT-LG-01 → Lv.4–6).", signal: "", actor: "Ops", state: { auto: "ON", severity: "—", scoring: "normal" } }
    ]
  }
];
