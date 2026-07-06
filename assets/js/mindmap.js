/* CTI Domain-Object mindmap — loads assets/data/domain_object.graph.json, lazy-mounts properties. */

const GRAPH_URL = "../assets/data/domain_object.graph.json";
const LEAF_COLORS = ["#f472b6", "#38bdf8", "#60a5fa", "#2dd4bf", "#34d399", "#a3e635", "#fb923c", "#f87171", "#c084fc", "#fb7185", "#94a3b8"];

const nodes = [];
const connections = [];

const container = document.getElementById("app-container");
const viewport = document.getElementById("viewport");
const nodesLayer = document.getElementById("nodes-layer");
const svgCanvas = document.getElementById("svg-canvas");
const tooltip = document.getElementById("tooltip");
const toast = document.getElementById("toast");
const loadingEl = document.getElementById("loading");

let zoom = 1.0;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX, startY;
let animRunning = false;
let currentStep = 0;
let toastTimer;
let branchCount = 19;

/** Bán kính vòng domain — tính theo số nhánh + kích thước viewport để tránh chồng lấn. */
function getLayoutMetrics() {
  const count = Math.max(branchCount, nodes.filter((n) => n.level === 1).length, 1);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const minDim = Math.min(vw, vh);
  const compact = count > 14;
  const boxW = compact ? 92 : 115;
  const boxH = compact ? 48 : 60;
  const gap = compact ? 22 : 18;
  const minChord = boxW + gap;
  const sinHalf = Math.sin(Math.PI / count);
  const fromGeometry = minChord / (2 * sinHalf) + boxH * 0.35;
  const fromViewport = minDim * (compact ? 0.44 : 0.38);
  const branchR = Math.max(fromGeometry, fromViewport, 300);
  const radiusX = branchR * 1.14;
  const radiusY = branchR * 1.06;
  const objRadius = Math.min(175, branchR * 0.52);
  const propRadius = Math.min(95, branchR * 0.28);
  return { branchR, radiusX, radiusY, objRadius, propRadius, compact, boxW };
}

function branchPosition(centerX, centerY, angle, metrics) {
  return {
    x: centerX + metrics.radiusX * Math.cos(angle),
    y: centerY + metrics.radiusY * Math.sin(angle),
  };
}

function fitViewForRoot() {
  const m = getLayoutMetrics();
  const needW = (m.radiusX + m.boxW) * 2 + 40;
  const needH = (m.radiusY + 48) * 2 + 80;
  zoom = Math.min(1, (window.innerWidth / needW), (window.innerHeight / needH)) * 0.94;
  panX = 0;
  panY = 0;
  applyTransform();
}

const presentationSteps = [
  { id: "start", label: "Màn hình bắt đầu", action: () => collapseAll() },
  { id: "root", label: "Tỏa 19 Domain CTI", action: () => expandRoot() },
  { id: "party_management", label: "Party Management", action: () => focusOnBranch("party_management") },
  { id: "loan_application", label: "Loan Application", action: () => focusOnBranch("loan_application") },
  { id: "credit_scoring_risk_assessment", label: "Credit Scoring & Risk", action: () => focusOnBranch("credit_scoring_risk_assessment") },
];

function initializeData(graph) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const rootNode = {
    id: graph.root.id,
    label: graph.root.label,
    type: "root",
    desc: graph.root.description,
    parent: null,
    level: 0,
    x: centerX,
    y: centerY,
    targetX: centerX,
    targetY: centerY,
    scale: 1,
    opacity: 1,
    expanded: false,
    el: null,
  };
  nodes.push(rootNode);

  const bCount = graph.domains.length;
  branchCount = bCount;
  graph.domains.forEach((d, bIdx) => {
    const angle = bIdx * (2 * Math.PI / bCount) - Math.PI / 2;
    const bNode = {
      id: d.id,
      label: d.label,
      type: "branch",
      desc: d.description,
      class: d.class,
      parent: rootNode.id,
      level: 1,
      angle,
      x: centerX,
      y: centerY,
      targetX: centerX,
      targetY: centerY,
      scale: 0,
      opacity: 0,
      expanded: false,
      el: null,
    };
    nodes.push(bNode);
    connections.push({ from: rootNode.id, to: d.id, el: null });

    const oCount = d.objects.length;
    d.objects.forEach((o, oIdx) => {
      const arc = Math.min(2.2, 0.35 * oCount + 0.8);
      const spread = oIdx * (arc / (oCount - 1 || 1)) - arc / 2;
      const propertyNames = o.properties || [];
      nodes.push({
        id: o.id,
        label: o.label,
        type: "mid",
        color: LEAF_COLORS[oIdx % LEAF_COLORS.length],
        desc: o.desc,
        parent: bNode.id,
        level: 2,
        spread,
        angle: angle + spread,
        x: centerX,
        y: centerY,
        targetX: centerX,
        targetY: centerY,
        scale: 0,
        opacity: 0,
        expanded: false,
        hasChildren: propertyNames.length > 0,
        propertyNames,
        propertiesMounted: false,
        el: null,
        labelEl: null,
      });
      connections.push({ from: bNode.id, to: o.id, el: null });
    });
  });
}

function mountNodeDOM(node) {
  const div = document.createElement("div");
  const compact = node.level === 1 && getLayoutMetrics().compact;
  div.className = `node node-${node.type} ${node.class || ""}${compact ? " compact" : ""}`;

  if (node.level === 2 || node.level === 3) {
    div.style.borderColor = node.color;
    div.style.backgroundColor = "#ffffff";
  }

  div.innerHTML = node.level < 2 ? `<div>${node.label}</div>` : "";

  if (node.level === 2 || node.level === 3) {
    const labelSpan = document.createElement("div");
    labelSpan.className = "leaf-label";
    labelSpan.textContent = node.label;
    const isRight = Math.cos(node.angle) >= 0;
    labelSpan.className += isRight ? " align-right" : " align-left";
    nodesLayer.appendChild(labelSpan);
    node.labelEl = labelSpan;
  }

  div.addEventListener("click", (e) => {
    e.stopPropagation();
    handleNodeClick(node);
  });
  div.addEventListener("mouseenter", (e) => showTooltip(node, e));
  div.addEventListener("mouseleave", hideTooltip);

  nodesLayer.appendChild(div);
  node.el = div;
}

function mountConnection(conn) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("class", "conn-line");
  svgCanvas.appendChild(path);
  conn.el = path;
}

function createDOM() {
  nodesLayer.innerHTML = "";
  svgCanvas.innerHTML = "";

  connections.forEach((conn) => {
    conn.el = null;
    mountConnection(conn);
  });

  nodes.filter((n) => n.level < 3).forEach((node) => mountNodeDOM(node));
}

function mountPropertyNodes(oNode) {
  if (oNode.propertiesMounted || !oNode.propertyNames.length) return;

  const pCount = oNode.propertyNames.length;
  const pArc = Math.min(1.4, 0.22 * pCount + 0.5);
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const branch = nodes.find((n) => n.id === oNode.parent);
  const objDir = branch ? branch.angle + (oNode.spread ?? 0) : oNode.angle;

  oNode.propertyNames.forEach((name, pIdx) => {
    const pAngle = objDir - pArc / 2 + pIdx * (pArc / (pCount - 1 || 1));
    const pNode = {
      id: `${oNode.id}_p${pIdx}`,
      label: name,
      type: "leaf",
      color: LEAF_COLORS[pIdx % LEAF_COLORS.length],
      desc: `Property · ${oNode.label}`,
      parent: oNode.id,
      level: 3,
      angle: pAngle,
      x: centerX,
      y: centerY,
      targetX: centerX,
      targetY: centerY,
      scale: 0,
      opacity: 0,
      el: null,
      labelEl: null,
    };
    nodes.push(pNode);
    const conn = { from: oNode.id, to: pNode.id, el: null };
    connections.push(conn);
    mountConnection(conn);
    mountNodeDOM(pNode);
  });

  oNode.propertiesMounted = true;
}

function unmountPropertyNodes(oNode) {
  if (!oNode.propertiesMounted) return;

  const propIds = new Set(
    nodes.filter((n) => n.parent === oNode.id && n.level === 3).map((n) => n.id)
  );

  propIds.forEach((id) => {
    const n = nodes.find((x) => x.id === id);
    if (n?.el) n.el.remove();
    if (n?.labelEl) n.labelEl.remove();
  });

  connections.filter((c) => propIds.has(c.to)).forEach((c) => c.el?.remove());

  for (let i = nodes.length - 1; i >= 0; i--) {
    if (propIds.has(nodes[i].id)) nodes.splice(i, 1);
  }
  for (let i = connections.length - 1; i >= 0; i--) {
    if (propIds.has(connections[i].to)) connections.splice(i, 1);
  }

  oNode.propertiesMounted = false;
}

function unmountAllProperties() {
  nodes.filter((n) => n.level === 2).forEach((o) => {
    o.expanded = false;
    unmountPropertyNodes(o);
  });
}

function updatePositions() {
  let moving = false;
  const ease = 0.15;

  const stepNode = (node) => {
    const dx = node.targetX - node.x;
    const dy = node.targetY - node.y;
    if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
      node.x += dx * ease;
      node.y += dy * ease;
      moving = true;
    } else {
      node.x = node.targetX;
      node.y = node.targetY;
    }
    if (node.el) {
      node.el.style.transform = `translate(${node.x}px, ${node.y}px) scale(${node.scale})`;
      node.el.style.opacity = node.opacity;
    }
    if (node.labelEl) {
      const isRight = node.labelEl.classList.contains("align-right");
      labelSpanTransform(node, isRight ? 14 : -14, isRight);
    }
  };

  nodes.filter((n) => n.level <= 1).forEach(stepNode);

  const root = nodes.find((n) => n.id === "root");
  if (root?.expanded) {
    const metrics = getLayoutMetrics();
    nodes.filter((n) => n.level === 1 && n.expanded).forEach((bNode) => {
      nodes.filter((n) => n.parent === bNode.id && n.level === 2 && n.opacity > 0).forEach((oNode) => {
        const dir = bNode.angle + (oNode.spread ?? 0);
        oNode.targetX = bNode.x + metrics.objRadius * Math.cos(dir);
        oNode.targetY = bNode.y + metrics.objRadius * Math.sin(dir);
      });
    });
  }

  nodes.filter((n) => n.level === 2).forEach(stepNode);

  nodes.filter((n) => n.level === 2 && n.expanded && n.propertiesMounted).forEach((oNode) => {
    const metrics = getLayoutMetrics();
    nodes.filter((n) => n.parent === oNode.id && n.level === 3).forEach((pNode) => {
      pNode.targetX = oNode.x + metrics.propRadius * Math.cos(pNode.angle);
      pNode.targetY = oNode.y + metrics.propRadius * Math.sin(pNode.angle);
    });
  });

  nodes.filter((n) => n.level === 3).forEach(stepNode);

  connections.forEach((conn) => {
    const fromNode = nodes.find((n) => n.id === conn.from);
    const toNode = nodes.find((n) => n.id === conn.to);

    if (fromNode && toNode && conn.el) {
      drawConnection(conn, fromNode, toNode);
    }
  });

  if (moving) requestAnimationFrame(updatePositions);
  else animRunning = false;
}

function labelSpanTransform(node, labelOffset, isRight) {
  node.labelEl.style.transform = `translate(${node.x + labelOffset}px, ${node.y}px) ${isRight ? "" : "translateX(-100%)"}`;
  node.labelEl.style.opacity = node.opacity > 0.8 ? "1" : "0";
}

function getNodeEdgeRadius(node) {
  if (node.level === 0) return 32;
  if (node.level === 1) return node.el?.classList.contains("compact") ? 24 : 30;
  if (node.level === 2) return 10;
  return 8;
}

function connectionEndpoints(fromNode, toNode) {
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 1) {
    return { sx: fromNode.x, sy: fromNode.y, ex: toNode.x, ey: toNode.y };
  }
  const ux = dx / dist;
  const uy = dy / dist;
  const fR = getNodeEdgeRadius(fromNode);
  const tR = getNodeEdgeRadius(toNode);
  return {
    sx: fromNode.x + ux * fR,
    sy: fromNode.y + uy * fR,
    ex: toNode.x - ux * tR,
    ey: toNode.y - uy * tR,
  };
}

function objectTargetPos(bNode, oNode, metrics, visible) {
  if (!visible) return { x: bNode.targetX, y: bNode.targetY };
  const dir = bNode.angle + (oNode.spread ?? 0);
  return {
    x: bNode.targetX + metrics.objRadius * Math.cos(dir),
    y: bNode.targetY + metrics.objRadius * Math.sin(dir),
  };
}

function drawConnection(conn, fromNode, toNode) {
  const { sx, sy, ex, ey } = connectionEndpoints(fromNode, toNode);

  if (fromNode.id === "root") {
    const dist = Math.hypot(ex - sx, ey - sy);
    const controlDist = dist * 0.45;
    const cp1x = sx + controlDist * Math.cos(toNode.angle);
    cp1y = sy + controlDist * Math.sin(toNode.angle);
    const cp2x = ex - controlDist * Math.cos(toNode.angle) * 0.15;
    const cp2y = ey - controlDist * Math.sin(toNode.angle) * 0.15;
    conn.el.setAttribute("d", `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${ex} ${ey}`);
  } else {
    conn.el.setAttribute("d", `M ${sx} ${sy} L ${ex} ${ey}`);
  }
  conn.el.setAttribute("opacity", Math.min(fromNode.opacity, toNode.opacity));

  if (fromNode.el?.classList.contains("faded") || toNode.el?.classList.contains("faded")) {
    conn.el.classList.add("line-faded");
    conn.el.setAttribute("stroke-width", 1);
  } else {
    conn.el.classList.remove("line-faded");
    conn.el.setAttribute("stroke-width", 2);
  }
}

function startAnimation() {
  if (!animRunning) {
    animRunning = true;
    requestAnimationFrame(updatePositions);
  }
}

function recomputeLayout() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const root = nodes.find((n) => n.id === "root");
  const metrics = getLayoutMetrics();

  root.targetX = centerX;
  root.targetY = centerY;

  nodes.filter((n) => n.level === 1).forEach((bNode) => {
    const pos = branchPosition(centerX, centerY, bNode.angle, metrics);
    bNode.targetX = root.expanded ? pos.x : centerX;
    bNode.targetY = root.expanded ? pos.y : centerY;
    bNode.scale = root.expanded ? 1 : 0;
    bNode.opacity = root.expanded ? 1 : 0;

    nodes.filter((n) => n.parent === bNode.id && n.level === 2).forEach((oNode) => {
      const isObjVisible = root.expanded && bNode.expanded;
      const pos = objectTargetPos(bNode, oNode, metrics, isObjVisible);
      oNode.targetX = pos.x;
      oNode.targetY = pos.y;
      oNode.scale = isObjVisible ? 1 : 0;
      oNode.opacity = isObjVisible ? 1 : 0;

      nodes.filter((n) => n.parent === oNode.id && n.level === 3).forEach((pNode) => {
        const isPropVisible = isObjVisible && oNode.expanded;
        pNode.targetX = isPropVisible ? oNode.targetX + metrics.propRadius * Math.cos(pNode.angle) : oNode.targetX;
        pNode.targetY = isPropVisible ? oNode.targetY + metrics.propRadius * Math.sin(pNode.angle) : oNode.targetY;
        pNode.scale = isPropVisible ? 1 : 0;
        pNode.opacity = isPropVisible ? 1 : 0;
      });
    });
  });

  applyFocusFading();
  startAnimation();
}

function applyFocusFading() {
  const activeBranch = nodes.find((n) => n.level === 1 && n.expanded);
  const activeObject = nodes.find((n) => n.level === 2 && n.expanded);

  if (activeObject) {
    nodes.forEach((n) => {
      if (!n.el) return;
      if (n.id === "root" || n.level === 1) n.el.classList.add("faded");
      else if (n.level === 2) n.el.classList.toggle("faded", n.id !== activeObject.id);
      else if (n.level === 3) n.el.classList.toggle("faded", n.parent !== activeObject.id);
    });
  } else if (activeBranch) {
    nodes.forEach((n) => {
      if (!n.el) return;
      if (n.id === "root") n.el.classList.add("faded");
      else if (n.level === 1) n.el.classList.toggle("faded", n.id !== activeBranch.id);
      else if (n.level === 2) n.el.classList.toggle("faded", n.parent !== activeBranch.id);
      else if (n.level === 3) n.el.classList.add("faded");
    });
  } else {
    nodes.forEach((n) => n.el?.classList.remove("faded"));
  }
}

function handleNodeClick(node) {
  if (node.id === "root") {
    if (node.expanded) {
      unmountAllProperties();
      nodes.forEach((n) => { n.expanded = false; });
      currentStep = 0;
      zoom = 1;
      panX = 0;
      panY = 0;
      applyTransform();
    } else {
      node.expanded = true;
      currentStep = 1;
      fitViewForRoot();
    }
  } else if (node.level === 1) {
    if (node.expanded) {
      nodes.filter((n) => n.parent === node.id && n.level === 2).forEach(unmountPropertyNodes);
      node.expanded = false;
      currentStep = 1;
      zoom = 1;
      panX = 0;
      panY = 0;
      applyTransform();
    } else {
      unmountAllProperties();
      nodes.filter((n) => n.level === 1).forEach((b) => { b.expanded = false; });
      node.expanded = true;
      const stepIdx = presentationSteps.findIndex((s) => s.id === node.id);
      if (stepIdx !== -1) currentStep = stepIdx;
      focusOnBranch(node.id);
      return;
    }
  } else if (node.level === 2) {
    if (node.hasChildren) {
      if (node.expanded) {
        node.expanded = false;
        unmountPropertyNodes(node);
      } else {
        nodes.filter((n) => n.level === 2 && n.parent === node.parent).forEach((o) => {
          if (o.id !== node.id) {
            o.expanded = false;
            unmountPropertyNodes(o);
          }
        });
        mountPropertyNodes(node);
        node.expanded = true;
      }
      recomputeLayout();
      return;
    }
    showToast(`${node.label}: ${node.desc || ""}`);
  } else {
    showToast(`${node.label}: ${node.desc || ""}`);
  }
  recomputeLayout();
}

function showTooltip(node, event) {
  tooltip.innerHTML = `<strong>${node.label}</strong><br>${node.desc || "Chi tiết."}`;
  tooltip.style.opacity = "1";
  updateTooltipPos(event);
}

function updateTooltipPos(event) {
  const tW = tooltip.offsetWidth;
  const tH = tooltip.offsetHeight;
  let left = event.clientX + 20;
  let top = event.clientY + 20;
  if (left + tW > window.innerWidth) left = event.clientX - tW - 20;
  if (top + tH > window.innerHeight) top = event.clientY - tH - 20;
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function hideTooltip() {
  tooltip.style.opacity = "0";
}

function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.style.opacity = "1";
  toastTimer = setTimeout(() => { toast.style.opacity = "0"; }, 4500);
}

function applyTransform() {
  viewport.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
}

function collapseAll() {
  unmountAllProperties();
  nodes.forEach((n) => { n.expanded = false; });
  zoom = 1;
  panX = 0;
  panY = 0;
  applyTransform();
  recomputeLayout();
}

function expandRoot() {
  unmountAllProperties();
  nodes.forEach((n) => { n.expanded = false; });
  nodes.find((n) => n.id === "root").expanded = true;
  fitViewForRoot();
  recomputeLayout();
}

function focusOnBranch(branchId) {
  nodes.find((n) => n.id === "root").expanded = true;
  nodes.filter((n) => n.level === 1).forEach((b) => { b.expanded = b.id === branchId; });
  unmountAllProperties();

  const bNode = nodes.find((n) => n.id === branchId);
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const metrics = getLayoutMetrics();
  const pos = branchPosition(centerX, centerY, bNode.angle, metrics);

  zoom = 1.2;
  panX = centerX - pos.x * zoom;
  panY = centerY - pos.y * zoom;
  applyTransform();
  recomputeLayout();
}

function handleNext() {
  currentStep = (currentStep + 1) % presentationSteps.length;
  presentationSteps[currentStep].action();
  showToast("Thuyết trình: " + presentationSteps[currentStep].label);
}

function handlePrev() {
  currentStep = (currentStep - 1 + presentationSteps.length) % presentationSteps.length;
  presentationSteps[currentStep].action();
  showToast("Thuyết trình: " + presentationSteps[currentStep].label);
}

function bindUI() {
  container.addEventListener("mousemove", (e) => {
    if (tooltip.style.opacity === "1") updateTooltipPos(e);
  });

  container.addEventListener("mousedown", (e) => {
    if (e.target.closest(".node") || e.target.closest(".toolbar")) return;
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    applyTransform();
  });

  window.addEventListener("mouseup", () => { isDragging = false; });

  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomFactor = 0.06;
    zoom = e.deltaY < 0 ? Math.min(2.5, zoom + zoomFactor) : Math.max(0.4, zoom - zoomFactor);
    applyTransform();
  }, { passive: false });

  document.getElementById("btn-reset").addEventListener("click", () => {
    currentStep = 0;
    collapseAll();
    showToast("Đã thu nhỏ toàn bộ sơ đồ.");
  });
  document.getElementById("btn-next").addEventListener("click", handleNext);
  document.getElementById("btn-prev").addEventListener("click", handlePrev);

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); handleNext(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); handlePrev(); }
  });

  window.addEventListener("resize", () => recomputeLayout());
}

async function boot() {
  bindUI();
  try {
    const res = await fetch(GRAPH_URL);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const graph = await res.json();
    initializeData(graph);
    createDOM();
    recomputeLayout();
    loadingEl.classList.add("hidden");
    showToast(`CTI: ${graph.meta.domains} domain · ${graph.meta.objects} object · ${graph.meta.properties} property`);
  } catch (err) {
    loadingEl.textContent = `Không tải được ${GRAPH_URL}. Chạy HTTP server trong ghi_chu_noi_bo/. (${err.message})`;
  }
}

boot();
