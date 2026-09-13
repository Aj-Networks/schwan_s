/* SkillSight - app logic.
   One page at a time: Overview, Skills, Succession risk, Future skills, Plants.
   Clicking any row opens that skill and answers the five challenge questions for it. */

const D = SKILLSIGHT_DATA;

/* ---------- data helpers ---------- */

// Five fixed steps instead of a continuous rainbow, so two skills that are
// close in coverage do not read as wildly different colors.
const RAMP = ["#b03a2c", "#c86f3a", "#c9a53c", "#6f9e5a", "#3c8a6b"];

function ramp(pct) {
  if (pct < 25) return RAMP[0];
  if (pct < 40) return RAMP[1];
  if (pct < 60) return RAMP[2];
  if (pct < 80) return RAMP[3];
  return RAMP[4];
}

const ALL = [];
D.segments.forEach(seg => {
  seg.skills.forEach(s => ALL.push({ segment: seg.name, skill: s.skill, coverage: s.coverage }));
});
ALL.sort((a, b) => a.coverage - b.coverage);

const GAPS = ALL.filter(s => s.coverage < 40);
const AVG = Math.round(ALL.reduce((t, s) => t + s.coverage, 0) / ALL.length);
const THIN = D.successionRisks.filter(r => r.headcount <= 3);

const actionFor = skill => D.recommendedActions[skill] || null;
const alternatesFor = skill => D.alternateActions[skill] || [];
const futureFor = skill => D.futureSkills.find(f => f.skill === skill);

// Risk entries carry a location suffix ("Pizza Line Configuration - Salina"),
// so match on the part before the dash as well as the full name.
function riskFor(skill) {
  const base = skill.split(" - ")[0];
  return D.successionRisks.find(r => r.skill === skill)
      || D.successionRisks.find(r => r.skill.split(" - ")[0] === base);
}

const people = n => n + (n === 1 ? " person" : " people");

function level(pct) {
  if (pct < 40) return ["hi", "Critical gap"];
  if (pct < 60) return ["md", "Needs attention"];
  return ["ok", "Well covered"];
}

// Fix-first score: how badly it hurts, how few people hold it, how big the gap is.
const PRIORITY = D.successionRisks.map(r => {
  const cov = ALL.find(s => s.skill.split(" - ")[0] === r.skill.split(" - ")[0]);
  const gap = cov ? (100 - cov.coverage) / 100 : 0.6;
  return { skill: r.skill, risk: r, score: (r.impact / 5) * (3 / r.headcount) * (0.4 + gap) };
}).sort((a, b) => b.score - a.score);

/* ---------- theme ---------- */

const THEME_KEY = "skillsight_theme";

function readTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch (e) { /* storage blocked, use the system setting */ }
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

/* ---------- development plans (challenge question 5) ---------- */
// Checking the box survives a reload, so the demo carries real state
// instead of a decorative checkbox.

const planKey = skill => "skillsight_plan_" + skill;

function isPlanStarted(skill) {
  try { return localStorage.getItem(planKey(skill)) === "1"; } catch (e) { return false; }
}

function setPlanStarted(skill, started) {
  try { localStorage.setItem(planKey(skill), started ? "1" : "0"); } catch (e) { /* not fatal */ }
}

function plansStarted() {
  const names = {};
  ALL.forEach(s => { names[s.skill] = 1; });
  D.successionRisks.forEach(r => { names[r.skill] = 1; });
  return Object.keys(names).filter(isPlanStarted).length;
}

/* ---------- state ---------- */

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "skills", label: "Skills", count: ALL.length },
  { id: "risk", label: "Succession risk", count: D.successionRisks.length },
  { id: "future", label: "Future skills", count: D.futureSkills.length },
  { id: "plants", label: "Plants and offices", count: D.plants.length }
];

const state = { tab: "overview", skill: null, query: "" };

/* ---------- address bar ---------- */
// The page you are looking at shows up in the URL (#skills, #skill=Data Analytics),
// so the back button works and a view can be shared or bookmarked.

function readHash() {
  const raw = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  if (!raw) return;
  if (raw.indexOf("skill=") === 0) {
    state.skill = raw.slice(6);
    return;
  }
  if (TABS.some(t => t.id === raw)) {
    state.tab = raw;
    state.skill = null;
  }
}

function writeHash() {
  const want = state.skill ? "skill=" + state.skill : state.tab;
  const current = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  if (current !== want) {
    history.replaceState(null, "", "#" + encodeURIComponent(want));
  }
}

window.addEventListener("hashchange", () => { readHash(); render(); });

/* ---------- small builders ---------- */

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function coverageCell(pct) {
  return '<div class="trend"><div class="track"><i style="width:' + pct + '%;background:' + ramp(pct) + '"></i></div>' +
    '<span>' + pct + '%</span></div>';
}

function table(head, body) {
  return '<div class="table-wrap"><table><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div>';
}

function skillRows(rows) {
  return rows.map(r => {
    const lv = level(r.coverage);
    const started = isPlanStarted(r.skill);
    return '<tr data-skill="' + esc(r.skill) + '">' +
      '<td class="name">' + esc(r.skill) + '</td>' +
      '<td class="grp">' + esc(r.segment) + '</td>' +
      '<td>' + coverageCell(r.coverage) + '</td>' +
      '<td class="num"><span class="pill ' + lv[0] + '">' + lv[1] + '</span>' +
        (started ? ' <span class="pill plan">Plan started</span>' : "") + '</td></tr>';
  }).join("");
}

/* ---------- pages ---------- */

function pageOverview() {
  const stats = [
    [AVG + "%", "average coverage across " + ALL.length + " skills", ""],
    [GAPS.length, "skills under 40 percent coverage", "warn"],
    [THIN.length, "skills held by three people or fewer", "bad"],
    [plansStarted(), "development plans started", ""]
  ].map(s => '<div class="stat"><div class="v ' + s[2] + '">' + s[0] + '</div><div class="l">' + s[1] + '</div></div>').join("");

  const priority = table("", PRIORITY.map((p, i) =>
    '<tr data-skill="' + esc(p.skill) + '"><td class="rank">' + (i + 1) + '</td>' +
    '<td class="name">' + esc(p.skill) +
      '<div class="why">' + people(p.risk.headcount) + ' hold it, impact ' + p.risk.impact + ' of 5. ' + esc(p.risk.location) + '</div></td>' +
    '<td class="num"><span class="pill ' + (p.risk.impact >= 5 || p.risk.headcount <= 2 ? "hi" : "md") + '">' +
      people(p.risk.headcount) + '</span></td></tr>').join(""));

  return '<h1 class="h1">Workforce overview</h1>' +
    '<p class="sub">16 plants and 3 offices. Four job groups. ' + ALL.length + ' skills tracked.</p>' +
    '<div class="stats">' + stats + '</div>' +
    '<div class="sec"><div class="sec-h"><b>Do this first</b><span>ranked by impact, how few people hold it, and gap size</span></div>' + priority + '</div>' +
    '<div class="sec"><div class="sec-h"><b>Biggest gaps today</b><span>under 40 percent coverage</span></div>' +
      table('<th>Skill</th><th>Job group</th><th>Coverage</th><th class="num">Status</th>', skillRows(GAPS)) + '</div>' +
    '<p class="foot">Demo numbers. Plants, offices, and job groups are real.</p>';
}

function pageSkills() {
  const q = state.query.trim().toLowerCase();
  const rows = ALL.filter(r => !q || r.skill.toLowerCase().includes(q) || r.segment.toLowerCase().includes(q));

  return '<h1 class="h1">Skills</h1>' +
    '<p class="sub">' + (q ? rows.length + ' of ' + ALL.length + ' skills match "' + esc(state.query) + '".'
                           : 'Every tracked skill, lowest coverage first. Click a row for the plan.') + '</p>' +
    '<div class="sec flush">' +
      (rows.length
        ? table('<th>Skill</th><th>Job group</th><th>Coverage</th><th class="num">Status</th>', skillRows(rows))
        : '<p class="empty">No skill matches that search.</p>') +
    '</div>';
}

function pageRisk() {
  const body = D.successionRisks.slice().sort((a, b) => a.headcount - b.headcount).map(r =>
    '<tr data-skill="' + esc(r.skill) + '">' +
      '<td class="name">' + esc(r.skill) + '<div class="why">' + esc(r.note) + '</div></td>' +
      '<td class="grp">' + esc(r.location) + '</td>' +
      '<td class="num">' + r.headcount + '</td>' +
      '<td class="num"><span class="pill ' + (r.impact >= 5 ? "hi" : "md") + '">' + r.impact + ' of 5</span></td></tr>').join("");

  return '<h1 class="h1">Succession risk</h1>' +
    '<p class="sub">Skills that sit with a handful of people. If they leave, the work stops until someone else learns it.</p>' +
    '<div class="sec flush">' + table('<th>Skill</th><th>Where</th><th class="num">People</th><th class="num">Impact</th>', body) + '</div>';
}

function pageFuture() {
  const body = D.futureSkills.slice()
    .sort((a, b) => (b.targetCoverage - b.currentCoverage) - (a.targetCoverage - a.currentCoverage))
    .map(f =>
      '<tr data-skill="' + esc(f.skill) + '">' +
        '<td class="name">' + esc(f.skill) + '<div class="why">' + esc(f.driver) + '</div></td>' +
        '<td>' + coverageCell(f.currentCoverage) + '</td>' +
        '<td class="num">' + f.targetCoverage + '%</td>' +
        '<td class="num"><span class="pill md">+' + (f.targetCoverage - f.currentCoverage) + ' pts</span></td></tr>').join("");

  return '<h1 class="h1">Future skills</h1>' +
    '<p class="sub">What the next two years need, and how far short the workforce is today.</p>' +
    '<div class="sec flush">' + table('<th>Skill</th><th>Today</th><th class="num">Needed</th><th class="num">Gap</th>', body) + '</div>';
}

function pagePlants() {
  const cells = D.plants.map(p => {
    const open = p.indexOf("(");
    const name = open > -1 ? p.slice(0, open).trim() : p;
    const kind = open > -1 ? p.slice(open + 1).replace(")", "") : "";
    return '<div>' + esc(name) + '<span>' + esc(kind) + '</span></div>';
  }).join("");

  return '<h1 class="h1">Plants and offices</h1>' +
    '<p class="sub">Every site the skills data covers. Sioux Falls is still being built.</p>' +
    '<div class="sec"><div class="sec-h"><b>Network</b><span>' + D.plants.length + ' locations</span></div>' +
      '<div class="grid2">' + cells + '</div></div>';
}

function pageSkill(name) {
  const row = ALL.find(r => r.skill === name);
  const risk = riskFor(name);
  const skill = row ? row.skill : (risk ? risk.skill : name);
  const segment = row ? row.segment : (risk ? risk.segment : "");
  const coverage = row ? row.coverage : null;
  const future = futureFor(skill);
  const plan = actionFor(skill) || (risk ? actionFor(risk.skill) : null);
  const alts = alternatesFor(skill);
  const holders = risk ? risk.headcount : Math.max(4, Math.round((coverage || 0) / 8));
  const lv = coverage === null ? ["hi", "Tracked as a risk"] : level(coverage);
  const backTab = TABS.find(t => t.id === state.tab) || TABS[0];

  const stats =
    '<div class="stats" style="margin:24px 0 4px">' +
      '<div class="stat"><div class="v">' + (coverage === null ? "-" : coverage + "%") + '</div>' +
        '<div class="l">of this job group has the skill</div></div>' +
      '<div class="stat"><div class="v ' + (holders <= 3 ? "bad" : "") + '">' + holders + '</div>' +
        '<div class="l">' + (holders === 1 ? "person holds it today" : "people hold it today") + '</div></div>' +
      '<div class="stat"><div class="v">' + (future ? future.targetCoverage + "%" : "-") + '</div>' +
        '<div class="l">' + (future ? "needed by 2027, " + (future.targetCoverage - future.currentCoverage) + " points short"
                                    : "no future target set") + '</div></div>' +
    '</div>';

  const riskSec = risk
    ? '<div class="sec"><div class="sec-h"><b>Why this is a risk</b><span>' + esc(risk.location) + '</span></div>' +
      '<p class="prose">' + esc(risk.note) + '</p></div>'
    : "";

  const futureSec = future
    ? '<div class="sec"><div class="sec-h"><b>Why it will be needed</b><span>' +
      future.currentCoverage + '% now, ' + future.targetCoverage + '% needed</span></div>' +
      '<p class="prose">' + esc(future.driver) + '</p></div>'
    : "";

  const altSec = alts.length
    ? '<div class="alts">' + alts.map(a =>
        '<div class="alt"><b>' + esc(a.method) + '</b><span>' + esc(a.detail) + '</span></div>').join("") + '</div>'
    : "";

  const planSec = plan
    ? '<div class="sec"><div class="sec-h"><b>How to close it</b><span>' +
        (alts.length ? "first step, then the backups" : "first step") + '</span></div>' +
      '<div class="plan"><span class="plan-m">' + esc(plan.method) + '</span><p class="prose">' + esc(plan.detail) + '</p></div>' +
      altSec +
      '<label class="check"><input type="checkbox" id="plan-box"' + (isPlanStarted(skill) ? " checked" : "") + '>' +
        ' Development plan started</label></div>'
    : "";

  const people = '<div class="sec"><div class="sec-h"><b>Who holds it today</b><span>names hidden in the demo</span></div>' +
    '<div class="people">' +
      Array.from({ length: Math.min(holders, 8) }, (_, i) =>
        '<div class="person"><i>' + String.fromCharCode(65 + (i * 7) % 26) + String.fromCharCode(66 + (i * 3) % 26) +
        '</i>Employee ' + (1001 + i * 37) + '</div>').join("") +
      (holders > 8 ? '<div class="person"><i>+</i>' + (holders - 8) + ' more</div>' : "") +
    '</div></div>';

  return '<div class="crumb"><a data-back="1">' + backTab.label + '</a> / ' + esc(skill) + '</div>' +
    '<div class="skill-head"><div><h1 class="h1">' + esc(skill) + '</h1><p class="sub">' + esc(segment) + '</p></div>' +
      '<span class="pill ' + lv[0] + '">' + lv[1] + '</span></div>' +
    stats + riskSec + futureSec + planSec + people;
}

/* ---------- render ---------- */

function renderTabs() {
  document.getElementById("tabs").innerHTML = TABS.map(t =>
    '<div class="tab' + (state.tab === t.id ? " on" : "") + '" data-tab="' + t.id + '">' + t.label +
    (t.count ? '<em>' + t.count + '</em>' : "") + '</div>').join("");
}

function render() {
  renderTabs();

  const page = document.getElementById("page");
  if (state.skill) page.innerHTML = pageSkill(state.skill);
  else if (state.tab === "overview") page.innerHTML = pageOverview();
  else if (state.tab === "skills") page.innerHTML = pageSkills();
  else if (state.tab === "risk") page.innerHTML = pageRisk();
  else if (state.tab === "future") page.innerHTML = pageFuture();
  else page.innerHTML = pagePlants();

  const box = document.getElementById("plan-box");
  if (box) {
    box.addEventListener("change", () => setPlanStarted(state.skill, box.checked));
  }

  writeHash();
  window.scrollTo(0, 0);
}

document.getElementById("tabs").addEventListener("click", e => {
  const tab = e.target.closest("[data-tab]");
  if (!tab) return;
  state.tab = tab.dataset.tab;
  state.skill = null;
  render();
});

document.getElementById("page").addEventListener("click", e => {
  if (e.target.closest("[data-back]")) { state.skill = null; return render(); }
  const row = e.target.closest("[data-skill]");
  if (row) { state.skill = row.dataset.skill; render(); }
});

// Typing anywhere in the search box jumps to the Skills table and filters it.
document.getElementById("search").addEventListener("input", e => {
  state.query = e.target.value;
  state.skill = null;
  state.tab = "skills";
  render();
});

readHash();
render();
