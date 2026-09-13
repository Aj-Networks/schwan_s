/* SkillSight - app logic.
   One page at a time: Overview, Skills, Succession risk, Future skills, Plants.
   Opening a skill remembers which list it came from, so you can step through
   that list with Previous and Next and land back where you were. */

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
  seg.skills.forEach(s => ALL.push({ segment: seg.name, skill: s.skill, coverage: s.coverage, groupSize: seg.size }));
});
ALL.sort((a, b) => a.coverage - b.coverage);

const GAPS = ALL.filter(s => s.coverage < 40);
const AVG = Math.round(ALL.reduce((t, s) => t + s.coverage, 0) / ALL.length);
const THIN = D.successionRisks.filter(r => r.headcount <= 3);
const HEADCOUNT = D.segments.reduce((t, s) => t + s.size, 0);

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
const thousands = n => n.toLocaleString("en-US");

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

const RISKS_SORTED = D.successionRisks.slice().sort((a, b) => a.headcount - b.headcount);
const FUTURE_SORTED = D.futureSkills.slice()
  .sort((a, b) => (b.targetCoverage - b.currentCoverage) - (a.targetCoverage - a.currentCoverage));

const TOP_GAPS = GAPS.slice(0, 5);

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
// Checking the box survives a reload, so the demo carries real state.

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

// Every clickable row belongs to a list. Opening a skill remembers the list,
// which is what makes Previous, Next and "back to where I was" work.
const LISTS = {
  priority: { label: "Do this first", tab: "overview", anchor: "sec-priority", items: () => PRIORITY.map(p => p.skill) },
  gaps:     { label: "Biggest gaps today", tab: "overview", anchor: "sec-gaps", items: () => TOP_GAPS.map(g => g.skill) },
  skills:   { label: "Skills", tab: "skills", anchor: null, items: () => visibleSkills().map(s => s.skill) },
  risk:     { label: "Succession risk", tab: "risk", anchor: null, items: () => RISKS_SORTED.map(r => r.skill) },
  future:   { label: "Future skills", tab: "future", anchor: null, items: () => FUTURE_SORTED.map(f => f.skill) }
};

const state = { tab: "overview", skill: null, list: null, query: "", scrollTo: null };

function visibleSkills() {
  const q = state.query.trim().toLowerCase();
  return ALL.filter(r => !q || r.skill.toLowerCase().includes(q) || r.segment.toLowerCase().includes(q));
}

/* ---------- address bar ---------- */
// The page you are looking at shows up in the URL (#skills, #skill=Data Analytics),
// so the back button works and a view can be shared or bookmarked.

function readHash() {
  const raw = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  if (!raw) return;
  if (raw.indexOf("skill=") === 0) {
    const parts = raw.slice(6).split("&from=");
    state.skill = parts[0];
    if (parts[1] && LISTS[parts[1]]) state.list = parts[1];
    return;
  }
  if (TABS.some(t => t.id === raw)) { state.tab = raw; state.skill = null; }
}

function writeHash() {
  const want = state.skill
    ? "skill=" + state.skill + (state.list ? "&from=" + state.list : "")
    : state.tab;
  const current = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  if (current !== want) history.replaceState(null, "", "#" + encodeURIComponent(want));
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
  return '<div class="table-wrap"><table>' + (head ? '<thead><tr>' + head + '</tr></thead>' : "") +
    '<tbody>' + body + '</tbody></table></div>';
}

function skillRows(rows, listId) {
  return rows.map(r => {
    const lv = level(r.coverage);
    return '<tr data-skill="' + esc(r.skill) + '" data-list="' + listId + '">' +
      '<td class="name">' + esc(r.skill) + '</td>' +
      '<td class="grp">' + esc(r.segment) + '</td>' +
      '<td>' + coverageCell(r.coverage) + '</td>' +
      '<td class="num"><span class="pill ' + lv[0] + '">' + lv[1] + '</span>' +
        (isPlanStarted(r.skill) ? ' <span class="pill plan">Plan started</span>' : "") + '</td></tr>';
  }).join("");
}

/* ---------- pages ---------- */

function aboutBlock() {
  return '<details class="about"><summary>' + esc(D.demoNotes.headline) + '</summary>' +
    '<ul>' + D.demoNotes.points.map(t => '<li>' + esc(t) + '</li>').join("") + '</ul></details>';
}

function pageOverview() {
  const stats = [
    [AVG + "%", "average coverage across " + ALL.length + " skills", ""],
    [GAPS.length, "skills under 40 percent coverage", "warn"],
    [THIN.length, "skills held by three people or fewer", "bad"],
    [plansStarted(), "development plans started", ""]
  ].map(s => '<div class="stat"><div class="v ' + s[2] + '">' + s[0] + '</div><div class="l">' + s[1] + '</div></div>').join("");

  const priority = table("", PRIORITY.map((p, i) =>
    '<tr data-skill="' + esc(p.skill) + '" data-list="priority"><td class="rank">' + (i + 1) + '</td>' +
    '<td class="name">' + esc(p.skill) +
      '<div class="why">' + people(p.risk.headcount) + (p.risk.headcount === 1 ? ' holds it' : ' hold it') + ', impact ' + p.risk.impact + ' of 5. ' + esc(p.risk.location) + '</div></td>' +
    '<td class="num"><span class="pill ' + (p.risk.impact >= 5 || p.risk.headcount <= 2 ? "hi" : "md") + '">' +
      people(p.risk.headcount) + '</span></td></tr>').join(""));

  return '<h1 class="h1">Workforce overview</h1>' +
    '<p class="sub">16 plants and 3 offices. Four job groups, about ' + thousands(HEADCOUNT) + ' people, ' + ALL.length + ' skills tracked.</p>' +
    aboutBlock() +
    '<div class="stats">' + stats + '</div>' +
    '<div class="sec" id="sec-priority"><div class="sec-h"><b>Do this first</b>' +
      '<span>ranked by impact, how few people hold it, and gap size</span></div>' + priority + '</div>' +
    '<div class="sec" id="sec-gaps"><div class="sec-h"><b>Biggest gaps today</b>' +
      '<span>5 worst of ' + GAPS.length + ' under 40 percent. <a data-goto="skills">See all</a></span></div>' +
      table('<th>Skill</th><th>Job group</th><th>Coverage</th><th class="num">Status</th>', skillRows(TOP_GAPS, "gaps")) + '</div>';
}

function pageSkills() {
  const q = state.query.trim();
  const rows = visibleSkills();

  return '<h1 class="h1">Skills</h1>' +
    '<p class="sub">' + (q ? rows.length + ' of ' + ALL.length + ' skills match "' + esc(q) + '".'
                           : 'Every tracked skill, lowest coverage first. Click a row for the plan.') + '</p>' +
    '<div class="sec flush">' +
      (rows.length
        ? table('<th>Skill</th><th>Job group</th><th>Coverage</th><th class="num">Status</th>', skillRows(rows, "skills"))
        : '<p class="empty">No skill matches that search.</p>') +
    '</div>';
}

function pageRisk() {
  const body = RISKS_SORTED.map(r =>
    '<tr data-skill="' + esc(r.skill) + '" data-list="risk">' +
      '<td class="name">' + esc(r.skill) + '<div class="why">' + esc(r.location) + '</div></td>' +
      '<td class="num">' + r.headcount + '</td>' +
      '<td class="num"><span class="pill ' + (r.impact >= 5 ? "hi" : "md") + '">' + r.impact + ' of 5</span></td></tr>').join("");

  return '<h1 class="h1">Succession risk</h1>' +
    '<p class="sub">Skills that sit with a handful of people. If they leave, the work stops until someone else learns it.</p>' +
    '<div class="sec flush">' + table('<th>Skill</th><th class="num">People</th><th class="num">Impact</th>', body) + '</div>';
}

function pageFuture() {
  const body = FUTURE_SORTED.map(f =>
    '<tr data-skill="' + esc(f.skill) + '" data-list="future">' +
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

/* Previous and Next step through the list the skill was opened from, so
   checking a second skill never means hunting for the section again. */
function navStrip() {
  const list = LISTS[state.list];
  if (!list) return '<div class="crumb"><a data-back="1">Back</a></div>';

  const items = list.items();
  const i = items.indexOf(state.skill);
  const prev = i > 0 ? items[i - 1] : null;
  const next = i > -1 && i < items.length - 1 ? items[i + 1] : null;

  return '<div class="navstrip">' +
    '<a class="back" data-back="1">' + esc(list.label) + '</a>' +
    (i > -1 ? '<span class="pos">' + (i + 1) + ' of ' + items.length + '</span>' : "") +
    '<span class="steps">' +
      (prev ? '<a data-skill="' + esc(prev) + '" data-list="' + state.list + '" title="' + esc(prev) + '">Previous</a>'
            : '<span class="off">Previous</span>') +
      (next ? '<a data-skill="' + esc(next) + '" data-list="' + state.list + '" title="' + esc(next) + '">Next</a>'
            : '<span class="off">Next</span>') +
    '</span></div>';
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
  const lv = coverage === null ? ["hi", "Tracked as a risk"] : level(coverage);
  const haveIt = row ? Math.round(row.groupSize * row.coverage / 100) : null;

  const stats =
    '<div class="stats" style="margin:22px 0 4px">' +
      '<div class="stat"><div class="v">' + (coverage === null ? "-" : coverage + "%") + '</div>' +
        '<div class="l">' + (haveIt === null ? "not scored across the group"
          : "of this job group, about " + thousands(haveIt) + " of " + thousands(row.groupSize) + " people") + '</div></div>' +
      (risk ? '<div class="stat"><div class="v bad">' + risk.headcount + '</div>' +
        '<div class="l">' + (risk.headcount === 1 ? "holds" : "hold") + ' it at ' + esc(risk.location.split(" (")[0]) + '</div></div>' : "") +
      (future ? '<div class="stat"><div class="v">' + future.targetCoverage + '%</div>' +
        '<div class="l">needed by 2027, ' + (future.targetCoverage - future.currentCoverage) + ' points short</div></div>' : "") +
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
    ? '<details class="alts"><summary>Other ways to close it</summary>' +
      alts.map(a => '<div class="alt"><b>' + esc(a.method) + '</b><span>' + esc(a.detail) + '</span></div>').join("") +
      '</details>'
    : "";

  const planSec = plan
    ? '<div class="sec"><div class="sec-h"><b>How to close it</b><span>first step</span></div>' +
      '<div class="plan"><span class="plan-m">' + esc(plan.method) + '</span><p class="prose">' + esc(plan.detail) + '</p></div>' +
      altSec +
      '<label class="check"><input type="checkbox" id="plan-box"' + (isPlanStarted(skill) ? " checked" : "") + '>' +
        ' Development plan started</label></div>'
    : "";

  return navStrip() +
    '<div class="skill-head"><div><h1 class="h1">' + esc(skill) + '</h1><p class="sub">' + esc(segment) + '</p></div>' +
      '<span class="pill ' + lv[0] + '">' + lv[1] + '</span></div>' +
    stats + riskSec + futureSec + planSec;
}

/* ---------- render ---------- */

function renderTabs() {
  document.getElementById("tabs").innerHTML = TABS.map(t =>
    '<div class="tab' + (!state.skill && state.tab === t.id ? " on" : "") + '" data-tab="' + t.id + '">' + t.label +
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
  if (box) box.addEventListener("change", () => setPlanStarted(state.skill, box.checked));

  writeHash();

  // Coming back from a skill lands on the section it was opened from,
  // not at the top of the page.
  const anchor = state.scrollTo && document.getElementById(state.scrollTo);
  state.scrollTo = null;
  if (anchor) anchor.scrollIntoView({ block: "start" });
  else window.scrollTo(0, 0);
}

function openSkill(name, listId) {
  state.skill = name;
  if (listId) state.list = listId;
  render();
}

function goBack() {
  const list = LISTS[state.list];
  state.skill = null;
  if (list) {
    state.tab = list.tab;
    state.scrollTo = list.anchor;
  }
  render();
}

document.getElementById("tabs").addEventListener("click", e => {
  const tab = e.target.closest("[data-tab]");
  if (!tab) return;
  state.tab = tab.dataset.tab;
  state.skill = null;
  state.list = null;
  render();
});

document.getElementById("page").addEventListener("click", e => {
  if (e.target.closest("[data-back]")) return goBack();

  const jump = e.target.closest("[data-goto]");
  if (jump) {
    state.tab = jump.dataset.goto;
    state.skill = null;
    state.list = null;
    return render();
  }

  const row = e.target.closest("[data-skill]");
  if (row) openSkill(row.dataset.skill, row.dataset.list);
});

// Left and right arrows step through the same list while a skill is open.
document.addEventListener("keydown", e => {
  if (!state.skill || !LISTS[state.list]) return;
  if (e.target.tagName === "INPUT") return;
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

  const items = LISTS[state.list].items();
  const i = items.indexOf(state.skill);
  if (i === -1) return;
  const next = e.key === "ArrowRight" ? items[i + 1] : items[i - 1];
  if (next) { e.preventDefault(); openSkill(next); }
});

document.getElementById("search").addEventListener("input", e => {
  state.query = e.target.value;
  state.skill = null;
  state.list = null;
  state.tab = "skills";
  render();
});

readHash();
render();
