/* A-Score presentation board — shared nav + helpers */
const PAGES = [
  { href: "kiem_soat_workflow.html", label: "Workflow flow" },
  { href: "kich_ban_go_live.html", label: "Kịch bản go-live" },
  { href: "circuit_breaker.html", label: "Circuit breaker" },
  { href: "failsafe.html", label: "Failsafe" },
  { href: "tin_hieu_van_hanh.html", label: "Tín hiệu vận hành" }
];

function renderNav() {
  const path = location.pathname.split("/").pop() || "kiem_soat_workflow.html";
  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.setAttribute("aria-label", "Trình bày A-Score");
  PAGES.forEach(p => {
    const a = document.createElement("a");
    a.href = p.href;
    a.textContent = p.label;
    if (p.href === path || (path === "" && p.href === "kiem_soat_workflow.html")) a.classList.add("active");
    nav.appendChild(a);
  });
  const header = document.querySelector(".site-header");
  if (header && !header.querySelector(".site-nav")) header.prepend(nav);
}

function badgeSeverity(sev) {
  const map = { Low: "low", Medium: "med", High: "high", Critical: "critical", Crit: "critical" };
  const k = map[sev] || "med";
  const labels = { low: "Low", med: "Medium", high: "High", critical: "Critical" };
  return `<span class="badge badge-sev-${k}">${labels[k]}</span>`;
}

function badgeAlert(id) {
  if (!id) return "";
  return `<span class="badge badge-alert">${id}</span>`;
}

function badgeLv(lv) {
  if (lv == null) return "";
  return `<span class="badge badge-lv">Lv.${lv}</span>`;
}

function ownerChip(name) {
  return `<span class="owner">${name}</span>`;
}

function statusClass(on) {
  return on === "ON" || on === true ? "status-on" : "status-off";
}

document.addEventListener("DOMContentLoaded", renderNav);
