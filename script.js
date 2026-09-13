// Tab switching
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Development-plan tracking (Q5) - persists per browser via localStorage, so
// toggling "in progress" actually sticks across reloads instead of being decorative.
function planKey(skill) {
  return "skillsight_plan_" + skill;
}

function isPlanStarted(skill) {
  try {
    return localStorage.getItem(planKey(skill)) === "1";
  } catch (e) {
    return false;
  }
}

function setPlanStarted(skill, started) {
  try {
    localStorage.setItem(planKey(skill), started ? "1" : "0");
  } catch (e) {
    // storage unavailable (private browsing, etc) - fail silently, checkbox still reflects clicks this session
  }
}

function actionBlockHTML(skill) {
  const action = SKILLSIGHT_DATA.recommendedActions[skill];
  if (!action) return "";
  const checked = isPlanStarted(skill) ? "checked" : "";
  return `
    <div class="action-block">
      <div class="action-method">${action.method}</div>
      <div class="action-detail">${action.detail}</div>
      <label class="action-toggle">
        <input type="checkbox" class="plan-checkbox" data-skill="${skill}" ${checked}>
        Development plan started
      </label>
    </div>
  `;
}

function wireActionToggles(container) {
  container.querySelectorAll(".plan-checkbox").forEach(box => {
    box.addEventListener("change", () => {
      setPlanStarted(box.dataset.skill, box.checked);
    });
  });
}

function coverageColor(pct) {
  // low coverage = red (gap), high coverage = green
  const hue = Math.round((pct / 100) * 120); // 0 = red, 120 = green
  return `hsl(${hue}, 65%, 45%)`;
}

Chart.defaults.font.family = "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
Chart.defaults.color = getComputedStyle(document.body).getPropertyValue("--fg") || "#1a1a1a";
Chart.defaults.animation = { duration: 900, easing: "easeOutQuart" };

const charts = {};

function barChart(canvasId, labels, datasets, xMax) {
  const ctx = document.getElementById(canvasId);
  if (charts[canvasId]) charts[canvasId].destroy();
  charts[canvasId] = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: datasets.length > 1 } },
      scales: {
        x: { beginAtZero: true, max: xMax, grid: { color: "rgba(128,128,128,0.15)" } },
        y: { grid: { display: false } }
      }
    }
  });
}

function allSkillsFlat() {
  const rows = [];
  SKILLSIGHT_DATA.segments.forEach(segment => {
    segment.skills.forEach(s => {
      rows.push({ segment: segment.name, skill: s.skill, coverage: s.coverage });
    });
  });
  return rows;
}

function computeGaps() {
  return allSkillsFlat()
    .filter(s => s.coverage < 40)
    .sort((a, b) => a.coverage - b.coverage);
}

function renderHeatGrid(containerId, filterSegment) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  const rows = allSkillsFlat().filter(r => filterSegment === "all" || r.segment === filterSegment);

  rows.forEach((r, i) => {
    const tile = document.createElement("div");
    tile.className = "heat-tile";
    tile.style.background = coverageColor(r.coverage);
    tile.style.animationDelay = (i * 0.025) + "s";
    tile.innerHTML = `
      <div class="heat-tile-pct">${r.coverage}%</div>
      <div class="heat-tile-skill">${r.skill}</div>
      <div class="heat-tile-segment">${r.segment}</div>
    `;
    container.appendChild(tile);
  });
}

// Quadrant shading for the succession risk matrix - the four background zones
// a security risk register would use, drawn behind the scatter points.
const riskQuadrantPlugin = {
  id: "riskQuadrant",
  beforeDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    if (!chartArea) return;
    const midX = scales.x.getPixelForValue((scales.x.min + scales.x.max) / 2);
    const midY = scales.y.getPixelForValue((scales.y.min + scales.y.max) / 2);
    ctx.save();
    ctx.fillStyle = "rgba(200,60,60,0.10)"; // top-right: high impact, high concentration -> act first
    ctx.fillRect(midX, chartArea.top, chartArea.right - midX, midY - chartArea.top);
    ctx.fillStyle = "rgba(220,170,60,0.08)"; // top-left / bottom-right: watch
    ctx.fillRect(chartArea.left, chartArea.top, midX - chartArea.left, midY - chartArea.top);
    ctx.fillRect(midX, midY, chartArea.right - midX, chartArea.bottom - midY);
    ctx.fillStyle = "rgba(60,160,90,0.08)"; // bottom-left: lower priority
    ctx.fillRect(chartArea.left, midY, midX - chartArea.left, chartArea.bottom - midY);

    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillStyle = "rgba(120,30,30,0.65)";
    ctx.textAlign = "right";
    ctx.fillText("ACT FIRST", chartArea.right - 6, chartArea.top + 14);
    ctx.fillStyle = "rgba(130,100,20,0.6)";
    ctx.textAlign = "left";
    ctx.fillText("WATCH", chartArea.left + 6, chartArea.top + 14);
    ctx.textAlign = "right";
    ctx.fillText("WATCH", chartArea.right - 6, chartArea.bottom - 6);
    ctx.fillStyle = "rgba(30,110,60,0.6)";
    ctx.textAlign = "left";
    ctx.fillText("LOWER PRIORITY", chartArea.left + 6, chartArea.bottom - 6);
    ctx.restore();
  }
};

function riskMatrixColor(concentrationScore, impact) {
  // combined risk: 0 (safe, bottom-left) to 1 (act first, top-right) -> green to red
  const combined = (concentrationScore / 10) * (impact / 5);
  const hue = Math.round((1 - combined) * 120);
  return `hsl(${hue}, 70%, 45%)`;
}

function renderRiskMatrix(canvasId) {
  const risks = SKILLSIGHT_DATA.successionRisks;
  const points = risks.map(r => ({
    x: Math.round((10 / r.headcount) * 10) / 10, // concentration score: fewer holders -> higher score
    y: r.impact,
    skill: r.skill
  }));

  if (charts[canvasId]) charts[canvasId].destroy();
  charts[canvasId] = new Chart(document.getElementById(canvasId), {
    type: "scatter",
    data: {
      datasets: [{
        data: points,
        backgroundColor: points.map(p => riskMatrixColor(p.x, p.y)),
        pointRadius: 9,
        pointHoverRadius: 11
      }]
    },
    plugins: [riskQuadrantPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.raw.skill} - concentration ${ctx.raw.x}, impact ${ctx.raw.y}`
          }
        }
      },
      scales: {
        x: { min: 0, max: 11, title: { display: true, text: "Concentration risk (fewer holders →)" } },
        y: { min: 0, max: 6, title: { display: true, text: "Business impact" } }
      }
    }
  });
}

function renderGaps() {
  const gaps = computeGaps();

  barChart(
    "gaps-chart",
    gaps.map(g => g.skill),
    [{ data: gaps.map(g => g.coverage), backgroundColor: gaps.map(g => coverageColor(g.coverage)) }],
    100
  );

  const container = document.getElementById("gaps-container");
  gaps.forEach(g => {
    const item = document.createElement("div");
    item.className = "detail-item";
    item.innerHTML = `
      <h3>${g.skill}</h3>
      <div class="meta">${g.segment} • ${g.coverage}% coverage</div>
      ${actionBlockHTML(g.skill)}
    `;
    container.appendChild(item);
  });

  wireActionToggles(container);
}

function renderRisks() {
  const risks = SKILLSIGHT_DATA.successionRisks;
  const container = document.getElementById("risk-container");
  risks.forEach(r => {
    const item = document.createElement("div");
    item.className = "detail-item";
    item.innerHTML = `
      <h3>${r.skill}</h3>
      <div class="meta">${r.segment} • ${r.location} • ${r.headcount} people hold this skill</div>
      <div>${r.note}</div>
      ${actionBlockHTML(r.skill)}
    `;
    container.appendChild(item);
  });

  wireActionToggles(container);
}

function renderFuture() {
  const list = [...SKILLSIGHT_DATA.futureSkills].sort(
    (a, b) => (b.targetCoverage - b.currentCoverage) - (a.targetCoverage - a.currentCoverage)
  );

  barChart(
    "future-chart",
    list.map(f => f.skill),
    [
      { label: "Current", data: list.map(f => f.currentCoverage), backgroundColor: "rgba(122,31,43,0.35)" },
      { label: "Needed", data: list.map(f => f.targetCoverage), backgroundColor: "rgba(122,31,43,0.9)" }
    ],
    100
  );

  const container = document.getElementById("future-container");
  list.forEach(f => {
    const shortfall = f.targetCoverage - f.currentCoverage;
    const item = document.createElement("div");
    item.className = "detail-item";
    item.innerHTML = `
      <h3>${f.skill}</h3>
      <div class="meta">${f.segment} • ${f.currentCoverage}% today, needs ${f.targetCoverage}% (${shortfall} pt gap)</div>
      <div>${f.driver}</div>
      ${actionBlockHTML(f.skill)}
    `;
    container.appendChild(item);
  });

  wireActionToggles(container);
}

function renderPlants() {
  const container = document.getElementById("plants-container");
  const list = document.createElement("div");
  list.className = "plant-list";
  SKILLSIGHT_DATA.plants.forEach(p => {
    const row = document.createElement("div");
    row.className = "plant-row";
    row.textContent = p;
    list.appendChild(row);
  });
  container.appendChild(list);
}

function countUp(el, target, suffix) {
  const duration = 700;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function renderStatGrid() {
  const container = document.getElementById("stat-grid");
  const rows = allSkillsFlat();
  const avgCoverage = Math.round(rows.reduce((sum, r) => sum + r.coverage, 0) / rows.length);
  const stats = [
    { value: avgCoverage, suffix: "%", label: "Avg Coverage" },
    { value: computeGaps().length, suffix: "", label: "Capability Gaps" },
    { value: SKILLSIGHT_DATA.successionRisks.length, suffix: "", label: "Succession Risks" },
    { value: SKILLSIGHT_DATA.futureSkills.length, suffix: "", label: "Future Needs" },
    { value: SKILLSIGHT_DATA.plants.length, suffix: "", label: "Locations" }
  ];

  stats.forEach((s, i) => {
    const item = document.createElement("div");
    item.className = "stat-item";
    item.style.animationDelay = (i * 0.06) + "s";
    item.innerHTML = `<div class="stat-value">0${s.suffix}</div><div class="stat-label">${s.label}</div>`;
    container.appendChild(item);
    setTimeout(() => countUp(item.querySelector(".stat-value"), s.value, s.suffix), i * 60);
  });
}

function populateSegmentFilter() {
  const select = document.getElementById("segment-filter");
  SKILLSIGHT_DATA.segments.forEach(segment => {
    const opt = document.createElement("option");
    opt.value = segment.name;
    opt.textContent = segment.name;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => renderHeatGrid("heatmap-grid", select.value));
}

renderStatGrid();
renderHeatGrid("heatmap-grid", "all");
renderHeatGrid("heatmap-grid-preview", "all");
renderGaps();
renderRisks();
renderRiskMatrix("risk-matrix-chart");
renderFuture();
renderPlants();
populateSegmentFilter();
