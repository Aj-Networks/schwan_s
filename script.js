/* SkillSight - workbench app logic.
   Left column selects a view (overview, plant network, or one skill).
   Right pane answers the five challenge questions for whatever is selected. */

const D = SKILLSIGHT_DATA;

/* ---------- shared helpers ---------- */

// Five-step ramp instead of a rainbow, so two skills that are close in
// coverage do not read as wildly different colors.
const RAMP = ["#b03a2c", "#c86f3a", "#c9a53c", "#6f9e5a", "#3c8a6b"];

function ramp(pct) {
  if (pct < 25) return RAMP[0];
  if (pct < 40) return RAMP[1];
  if (pct < 60) return RAMP[2];
  if (pct < 80) return RAMP[3];
  return RAMP[4];
}

function flatSkills() {
  const out = [];
  D.segments.forEach(seg => {
    seg.skills.forEach(s => out.push({ segment: seg.name, skill: s.skill, coverage: s.coverage }));
  });
  return out;
}

const ALL = flatSkills().sort((a, b) => a.coverage - b.coverage);
const GAPS = ALL.filter(s => s.coverage < 40);
const AVG = Math.round(ALL.reduce((t, s) => t + s.coverage, 0) / ALL.length);
const THIN = D.successionRisks.filter(r => r.headcount <= 3);

function actionFor(skill) {
  return D.recommendedActions[skill] || null;
}

// Risk entries are named slightly differently from the coverage list
// ("R&D / Food Science - Frozen Dough" vs "R&D / Food Science"), so match on the base name.
function riskFor(skill) {
  const base = skill.split(" - ")[0];
  return D.successionRisks.find(r => r.skill === skill)
      || D.successionRisks.find(r => r.skill.split(" - ")[0] === base);
}

function futureFor(skill) {
  return D.futureSkills.find(f => f.skill === skill);
}

function level(pct) {
  if (pct < 40) return { cls: "hi", text: "Critical gap" };
  if (pct < 60) return { cls: "md", text: "Needs attention" };
  return { cls: "ok", text: "Well covered" };
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

/* ---------- theme toggle ---------- */

const THEME_KEY = "skillsight_theme";

function readTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch (e) { /* storage blocked, fall through to system preference */ }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* not fatal */ }
}

applyTheme(readTheme());

document.getElementById("theme-toggle").addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

/* ---------- development plan tracking (Q5) ---------- */
// Checking "development plan started" survives a reload, so the demo shows
// real state instead of a decorative checkbox.

function planKey(skill) { return "skillsight_plan_" + skill; }

function isPlanStarted(skill) {
  try { return localStorage.getItem(planKey(skill)) === "1"; } catch (e) { return false; }
}

function setPlanStarted(skill, started) {
  try { localStorage.setItem(planKey(skill), started ? "1" : "0"); } catch (e) { /* not fatal */ }
}

function plansStarted() {
  return ALL.filter(s => isPlanStarted(s.skill)).length
       + D.successionRisks.filter(r => !ALL.some(s => s.skill === r.skill) && isPlanStarted(r.skill)).length;
}

/* ---------- state ---------- */

const state = {
  view: "overview",   // "overview" | "plants" | a skill name
  segment: "All",
  query: ""
};

function select(view) {
  state.view = view;
  renderList();
  renderDetail();
  document.querySelector(".detail").scrollTop = 0;
}

/* ---------- left column ---------- */

function visibleRows() {
  const q = state.query.trim().toLowerCase();
  return ALL.filter(r => {
    const segOK = state.segment === "All" || r.segment === state.segment;
    const qOK = !q || r.skill.toLowerCase().includes(q) || r.segment.toLowerCase().includes(q);
    return segOK && qOK;
  });
}

function renderPinned() {
  const items = [
    { id: "overview", icon: "▣", label: "Workforce overview", note: ALL.length + " skills" },
    { id: "plants", icon: "◇", label: "Plants and offices", note: String(D.plants.length) }
  ];
  document.getElementById("pinned").innerHTML = items.map(i =>
    '<div class="pin' + (state.view === i.id ? " on" : "") + '" data-view="' + i.id + '">' +
      '<i>' + i.icon + '</i>' + i.label + '<span>' + i.note + '</span></div>'
  ).join("");
}

function renderChips() {
  const segs = ["All"].concat(D.segments.map(s => s.name));
  document.getElementById("chips").innerHTML = segs.map(s =>
    '<div class="chip' + (state.segment === s ? " on" : "") + '" data-seg="' + esc(s) + '">' +
      esc(s === "All" ? "All groups" : s.replace(" & ", " and ")) + '</div>'
  ).join("");
}

function renderList() {
  renderPinned();
  renderChips();

  const rows = visibleRows();
  document.getElementById("skill-count").textContent = "(" + rows.length + ")";

  document.getElementById("rows").innerHTML = rows.length
    ? rows.map(r =>
        '<div class="row' + (state.view === r.skill ? " on" : "") + '" data-skill="' + esc(r.skill) + '">' +
          '<div><div class="row-n">' + esc(r.skill) + '</div><div class="row-s">' + esc(r.segment) + '</div></div>' +
          '<div class="mini"><i style="width:' + r.coverage + '%;background:' + ramp(r.coverage) + '"></i></div>' +
          '<div class="pct">' + r.coverage + '</div>' +
        '</div>').join("")
    : '<div class="empty-rows">No skill matches that search.</div>';
}

/* ---------- detail pane: overview ---------- */

function barRow(name, sub, pct, target) {
  const back = target ? '<i class="target" style="width:' + target + '%"></i>' : "";
  return '<div class="bar" data-skill="' + esc(name) + '">' +
    '<div class="n">' + esc(name) + (sub ? '<small>' + esc(sub) + '</small>' : "") + '</div>' +
    '<div class="t">' + back + '<i style="width:' + pct + '%;background:' + ramp(pct) + '"></i></div>' +
    '<div class="p">' + pct + '%</div></div>';
}

function renderOverview() {
  const started = plansStarted();

  const cards = [
    { l: "Average coverage", v: AVG + "%", s: "across " + ALL.length + " tracked skills", c: "" },
    { l: "Skills under 40%", v: GAPS.length, s: "most of the group cannot do this work", c: "warn" },
    { l: "Held by 3 or fewer", v: THIN.length, s: "one person leaving stops the work", c: "bad" },
    { l: "Plans started", v: started, s: "saved in this browser", c: "" }
  ];

  const gapsHTML = GAPS.map(g => barRow(g.skill, g.segment, g.coverage)).join("");

  const riskHTML = D.successionRisks
    .slice()
    .sort((a, b) => (b.impact / b.headcount) - (a.impact / a.headcount))
    .map(r =>
      '<div class="risk-row" data-skill="' + esc(r.skill) + '">' +
        '<div><div class="risk-n">' + esc(r.skill) + '</div><div class="risk-m">' + esc(r.location) + '</div></div>' +
        '<div class="tag ' + (r.impact >= 5 || r.headcount <= 2 ? "hi" : "md") + '">' + r.headcount + ' people</div>' +
      '</div>').join("");

  const futureHTML = D.futureSkills
    .slice()
    .sort((a, b) => (b.targetCoverage - b.currentCoverage) - (a.targetCoverage - a.currentCoverage))
    .map(f =>
      barRow(f.skill, "needs " + f.targetCoverage + "%, " + (f.targetCoverage - f.currentCoverage) + " points to close", f.currentCoverage, f.targetCoverage) +
      '<div class="driver">' + esc(f.driver) + '</div>').join("");

  return '<div class="detail-inner">' +
    '<div class="d-top"><div><h1>Workforce overview</h1>' +
      '<p>16 plants and 3 offices. Four job groups. ' + ALL.length + ' skills tracked.</p></div></div>' +

    '<div class="cards">' + cards.map(c =>
      '<div class="card"><div class="l">' + c.l + '</div><div class="v ' + c.c + '">' + c.v + '</div><div class="s">' + c.s + '</div></div>'
    ).join("") + '</div>' +

    '<div class="panel"><div class="panel-h"><b>Biggest gaps today</b><span>Skills under 40 percent coverage</span></div>' +
      '<div class="panel-b">' + gapsHTML + '</div></div>' +

    '<div class="panel"><div class="panel-h"><b>Skills only a few people know</b><span>Click one to see the plan</span></div>' +
      '<div class="panel-b">' + riskHTML + '</div></div>' +

    '<div class="panel"><div class="panel-h"><b>What the next two years need</b><span>Now vs needed</span></div>' +
      '<div class="panel-b">' + futureHTML + '</div></div>' +
  '</div>';
}

/* ---------- detail pane: plant network ---------- */

function renderPlants() {
  const cells = D.plants.map(p => {
    const open = p.indexOf("(");
    const name = open > -1 ? p.slice(0, open).trim() : p;
    const kind = open > -1 ? p.slice(open + 1).replace(")", "") : "";
    return '<div class="plant">' + esc(name) + '<span>' + esc(kind) + '</span></div>';
  }).join("");

  return '<div class="detail-inner">' +
    '<div class="d-top"><div><h1>Plants and offices</h1>' +
      '<p>Every site the skills data covers. Sioux Falls is still being built.</p></div></div>' +
    '<div class="cards">' +
      '<div class="card"><div class="l">Production sites</div><div class="v">16</div><div class="s">pizza, desserts, packaging</div></div>' +
      '<div class="card"><div class="l">Corporate offices</div><div class="v">3</div><div class="s">Marshall, Hopkins, La Palma</div></div>' +
      '<div class="card"><div class="l">Job groups</div><div class="v">' + D.segments.length + '</div><div class="s">each needs its own skill list</div></div>' +
    '</div>' +
    '<div class="panel"><div class="panel-h"><b>Network</b><span>' + D.plants.length + ' locations</span></div>' +
      '<div class="panel-b"><div class="plantgrid">' + cells + '</div></div></div>' +
  '</div>';
}

/* ---------- detail pane: one skill ---------- */

function renderSkill(name) {
  const row = ALL.find(r => r.skill === name);
  const risk = riskFor(name);

  // A risk entry can name a skill that is not in the coverage list on its own
  // (for example the Salina line configuration). Fall back to the risk record.
  const skill = row ? row.skill : (risk ? risk.skill : name);
  const segment = row ? row.segment : (risk ? risk.segment : "");
  const coverage = row ? row.coverage : null;
  const future = futureFor(skill);
  const plan = actionFor(skill);
  const lv = coverage === null ? { cls: "hi", text: "Tracked as a risk" } : level(coverage);
  const holders = risk ? risk.headcount : Math.max(4, Math.round((coverage || 0) / 8));

  const cards =
    '<div class="cards">' +
      '<div class="card"><div class="l">Coverage</div><div class="v">' + (coverage === null ? "-" : coverage + "%") + '</div>' +
        '<div class="s">' + (coverage === null ? "not scored across the group" : "of people in this job group") + '</div></div>' +
      '<div class="card"><div class="l">People who hold it</div><div class="v ' + (holders <= 3 ? "bad" : "") + '">' + holders + '</div>' +
        '<div class="s">' + (risk ? "named in the risk list" : "estimated from coverage") + '</div></div>' +
      '<div class="card"><div class="l">Needed by 2027</div><div class="v">' + (future ? future.targetCoverage + "%" : "-") + '</div>' +
        '<div class="s">' + (future ? (future.targetCoverage - future.currentCoverage) + " points to close" : "no target set") + '</div></div>' +
    '</div>';

  const riskPanel = risk
    ? '<div class="panel"><div class="panel-h"><b>Why this is a risk</b><span>' + esc(risk.location) + '</span></div>' +
        '<div class="panel-b"><div class="prose">' + esc(risk.note) + '</div></div></div>'
    : "";

  const futurePanel = future
    ? '<div class="panel"><div class="panel-h"><b>Why it will be needed</b><span>' +
        future.currentCoverage + '% now, ' + future.targetCoverage + '% needed</span></div>' +
        '<div class="panel-b"><div class="prose">' + esc(future.driver) + '</div></div></div>'
    : "";

  const planPanel = '<div class="panel"><div class="panel-h"><b>How to close it</b><span>First step</span></div>' +
    '<div class="panel-b">' +
      (plan
        ? '<div class="plan"><div class="plan-m">' + esc(plan.method) + '</div><div class="plan-d">' + esc(plan.detail) + '</div></div>' +
          '<label class="check"><input type="checkbox" id="plan-box"' + (isPlanStarted(skill) ? " checked" : "") + '> Development plan started</label>'
        : '<div class="prose">No plan set for this skill yet.</div>') +
    '</div></div>';

  const peoplePanel = '<div class="panel"><div class="panel-h"><b>Who holds it today</b><span>names hidden in the demo</span></div>' +
    '<div class="panel-b"><div class="people">' +
      Array.from({ length: Math.min(holders, 8) }, (_, i) =>
        '<div class="person"><i>' + String.fromCharCode(65 + (i * 7) % 26) + String.fromCharCode(66 + (i * 3) % 26) + '</i>Employee ' + (1001 + i * 37) + '</div>'
      ).join("") +
      (holders > 8 ? '<div class="person"><i>+</i>' + (holders - 8) + ' more</div>' : "") +
    '</div></div></div>';

  return '<div class="detail-inner">' +
    '<div class="d-top"><div><h1>' + esc(skill) + '</h1><p>' + esc(segment) + '</p></div>' +
      '<div class="badge ' + lv.cls + '">' + lv.text + '</div></div>' +
    cards + riskPanel + futurePanel + planPanel + peoplePanel +
  '</div>';
}

/* ---------- render + events ---------- */

function renderDetail() {
  const pane = document.getElementById("detail");
  if (state.view === "overview") pane.innerHTML = renderOverview();
  else if (state.view === "plants") pane.innerHTML = renderPlants();
  else pane.innerHTML = renderSkill(state.view);

  const box = document.getElementById("plan-box");
  if (box) {
    box.addEventListener("change", () => {
      setPlanStarted(state.view, box.checked);
    });
  }
}

document.querySelector(".listcol").addEventListener("click", e => {
  const pin = e.target.closest(".pin");
  if (pin) return select(pin.dataset.view);

  const chip = e.target.closest(".chip");
  if (chip) {
    state.segment = chip.dataset.seg;
    renderList();
    return;
  }

  const row = e.target.closest(".row");
  if (row) select(row.dataset.skill);
});

// Bars and risk rows on the overview jump straight to that skill.
document.getElementById("detail").addEventListener("click", e => {
  const hit = e.target.closest("[data-skill]");
  if (hit) select(hit.dataset.skill);
});

document.getElementById("search").addEventListener("input", e => {
  state.query = e.target.value;
  renderList();
});

renderList();
renderDetail();
