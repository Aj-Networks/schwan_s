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

// Where a real deployment would read this skill from. Falls back to the job
// group's usual systems when a skill has no entry of its own.
function provenanceFor(skill, segment) {
  const base = skill.split(" - ")[0];
  return D.dataSources.bySkill[skill] || D.dataSources.bySkill[base]
    || (segment ? { systems: D.dataSources.bySegment[segment] } : null);
}

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

// The risk list names skills with a site suffix ("Pizza Line Configuration - Salina")
// while the skills list uses the base name. Both must save to ONE key, or a plan
// ticked on the risk page stays invisible everywhere else.
const SKILL_NAMES = ALL.map(s => s.skill);

function canonicalSkill(name) {
  const base = name.split(" - ")[0];
  return SKILL_NAMES.indexOf(base) > -1 ? base : name;
}

const planKey = skill => "skillsight_plan_" + canonicalSkill(skill);

function isPlanStarted(skill) {
  try { return localStorage.getItem(planKey(skill)) === "1"; } catch (e) { return false; }
}

function setPlanStarted(skill, started) {
  try { localStorage.setItem(planKey(skill), started ? "1" : "0"); } catch (e) { /* not fatal */ }
}

// Every skill that can carry a plan, in the order the app shows them.
function planCandidates() {
  const names = [];
  const add = n => { const c = canonicalSkill(n); if (names.indexOf(c) === -1) names.push(c); };
  ALL.forEach(s => add(s.skill));
  D.successionRisks.forEach(r => add(r.skill));
  return names;
}

function startedSkills() {
  return planCandidates().filter(isPlanStarted);
}

// The counter in the top bar, updated the moment a box is ticked rather than
// on the next render, so the click has an effect you can see from anywhere.
function updateCounter() {
  const n = startedSkills().length;
  const out = document.getElementById("plans-count");
  const btn = document.getElementById("plans-btn");
  if (!out || !btn) return;
  out.textContent = n;
  btn.classList.toggle("on", n > 0);
  btn.title = n === 0 ? "No plans started yet" : n + (n === 1 ? " plan started" : " plans started");
}

function plansStarted() {
  return startedSkills().length;
}

/* ---------- state ---------- */

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "skills", label: "Skills", count: ALL.length },
  { id: "risk", label: "Succession risk", count: D.successionRisks.length },
  { id: "future", label: "Future skills", count: D.futureSkills.length },
  { id: "people", label: "Employee view", count: D.employees.length },
  { id: "plants", label: "Plants and offices", count: D.plants.length }
];

// Every clickable row belongs to a list. Opening a skill remembers the list,
// which is what makes Previous, Next and "back to where I was" work.
const LISTS = {
  priority: { label: "Do this first", tab: "overview", anchor: "sec-priority", items: () => PRIORITY.map(p => p.skill) },
  gaps:     { label: "Where coverage is lowest", tab: "overview", anchor: "sec-gaps", items: () => TOP_GAPS.map(g => g.skill) },
  skills:   { label: "Skills", tab: "skills", anchor: null, items: () => visibleSkills().map(s => s.skill) },
  risk:     { label: "Succession risk", tab: "risk", anchor: null, items: () => RISKS_SORTED.map(r => r.skill) },
  future:   { label: "Future skills", tab: "future", anchor: null, items: () => FUTURE_SORTED.map(f => f.skill) }
};

const state = { tab: "overview", skill: null, list: null, query: "", scrollTo: null, person: D.employees[0].id };

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
    if (parts[1] && LISTS[parts[1]]) {
      state.list = parts[1];
      // Keep the lit tab and the breadcrumb telling the same story.
      state.tab = LISTS[parts[1]].tab;
    }
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

// Shown on every list, so a started plan is visible without opening anything.
// The name and the badge share one flex line, which keeps the badge hugging the
// name instead of inheriting whatever the surrounding cell does.
function nameLine(text, skill, extra) {
  return '<div class="name-line"><span>' + esc(text) + '</span>' +
    (isPlanStarted(skill) ? '<span class="pill plan">Plan started</span>' : "") +
    (extra || "") + '</div>';
}

function planBadge(skill) {
  return isPlanStarted(skill) ? '<span class="pill plan">Plan started</span>' : "";
}

function coverageCell(pct) {
  return '<div class="trend"><div class="track"><i style="width:' + pct + '%;background:' + ramp(pct) + '"></i></div>' +
    '<span>' + pct + '%</span></div>';
}

function table(head, body) {
  return '<div class="table-wrap"><table>' + (head ? '<thead><tr>' + head + '</tr></thead>' : "") +
    '<tbody>' + body + '</tbody></table></div>';
}

// showStatus is off inside a status group: repeating "Critical gap" on every
// row of the Critical gap folder is noise.
function skillRows(rows, listId, showStatus) {
  return rows.map(r => {
    const lv = level(r.coverage);
    const started = isPlanStarted(r.skill) ? '<span class="pill plan">Plan started</span>' : "";
    return '<tr data-skill="' + esc(r.skill) + '" data-list="' + listId + '">' +
      '<td class="name">' + nameLine(r.skill, r.skill) + '</td>' +
      '<td class="grp">' + esc(r.segment) + '</td>' +
      '<td>' + coverageCell(r.coverage) + '</td>' +
      '<td class="num">' + (showStatus ? '<span class="pill ' + lv[0] + '">' + lv[1] + '</span>' : "") + '</td></tr>';
  }).join("");
}

/* ---------- pages ---------- */

function aboutBlock() {
  return '<details class="about"><summary>' + esc(D.demoNotes.headline) + '</summary>' +
    '<ul>' + D.demoNotes.points.map(t => '<li>' + esc(t) + '</li>').join("") +
    D.demoNotes.sources.map(src =>
      '<li>' + esc(src.fact) + ' <a href="' + esc(src.url) + '" target="_blank" rel="noopener">' +
      esc(src.source) + '</a></li>').join("") +
    '</ul></details>';
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
    '<td class="name">' + nameLine(p.skill, p.skill) +
      '<div class="why">' + people(p.risk.headcount) + (p.risk.headcount === 1 ? ' holds it' : ' hold it') + ', impact ' + p.risk.impact + ' of 5. ' + esc(p.risk.location) + '</div></td>' +
    '<td class="num"><span class="pill ' + (p.risk.impact >= 5 || p.risk.headcount <= 2 ? "hi" : "md") + '">' +
      people(p.risk.headcount) + '</span></td></tr>').join(""));

  return '<h1 class="h1">Workforce overview</h1>' +
    '<p class="sub">' + D.plants.length + ' sites across the US. Four job groups, an assumed ' + thousands(HEADCOUNT) + ' people, ' + ALL.length + ' skills tracked.</p>' +
    aboutBlock() +
    '<div class="stats">' + stats + '</div>' +
    '<div class="sec" id="sec-priority"><div class="sec-h"><b>Do this first</b>' +
      '<span>ranked by impact, how few people hold it, and gap size' +
      '<em class="q">Answers: where are our greatest capability gaps and succession risks</em></span></div>' + priority + '</div>' +
    '<div class="sec" id="sec-gaps"><div class="sec-h"><b>Where coverage is lowest</b>' +
      '<span>5 worst of ' + GAPS.length + ' under 40 percent. <a data-goto="skills">See all</a>' +
      '<em class="q">Answers: what skills exist across our workforce today</em></span></div>' +
      table('<th>Skill</th><th>Job group</th><th>Coverage</th><th class="num">Plan</th>', skillRows(TOP_GAPS, "gaps")) + '</div>';
}

function pageSkills() {
  const q = state.query.trim();
  const rows = visibleSkills();
  const head = '<th>Skill</th><th>Job group</th><th>Coverage</th><th class="num">Status</th>';
  const headPlain = '<th>Skill</th><th>Job group</th><th>Coverage</th><th class="num">Plan</th>';

  // A search wants one flat answer, not folders to open.
  if (q) {
    return '<h1 class="h1">Skills</h1>' +
      '<p class="sub">' + rows.length + ' of ' + ALL.length + ' skills match "' + esc(q) + '".</p>' +
      '<div class="sec flush">' +
        (rows.length ? table(head, skillRows(rows, "skills", true)) : '<p class="empty">No skill matches that search.</p>') +
      '</div>';
  }

  // Grouped by status, worst first, and only the critical group is open.
  // Twenty rows at once tells you nothing about where to look.
  const bands = [
    { cls: "hi", label: "Critical gap", note: "under 40 percent", open: true, rows: rows.filter(r => r.coverage < 40) },
    { cls: "md", label: "Needs attention", note: "40 to 59 percent", open: false, rows: rows.filter(r => r.coverage >= 40 && r.coverage < 60) },
    { cls: "ok", label: "Well covered", note: "60 percent and up", open: false, rows: rows.filter(r => r.coverage >= 60) }
  ];

  return '<h1 class="h1">Skills</h1>' +
    '<p class="sub">All ' + ALL.length + ' tracked skills, grouped by how well they are covered.</p>' +
    '<div class="sec flush">' + bands.map(b =>
      '<details class="group"' + (b.open ? " open" : "") + '>' +
        '<summary><span class="pill ' + b.cls + '">' + b.label + '</span>' +
          '<em>' + b.rows.length + ' skills, ' + b.note + '</em></summary>' +
        '<div class="group-b">' + table(headPlain, skillRows(b.rows, "skills")) + '</div>' +
      '</details>').join("") + '</div>';
}

function pageRisk() {
  const body = RISKS_SORTED.map(r =>
    '<tr data-skill="' + esc(r.skill) + '" data-list="risk">' +
      '<td class="name">' + nameLine(r.skill, r.skill) +
        '<div class="why">' + esc(r.location) + '</div></td>' +
      '<td class="num">' + r.headcount + '</td>' +
      '<td class="num"><span class="pill ' + (r.impact >= 5 ? "hi" : "md") + '">' + r.impact + ' of 5</span></td></tr>').join("");

  return '<h1 class="h1">Succession risk</h1>' +
    '<p class="sub">Skills that sit with a handful of people. If they leave, the work stops until someone else learns it.</p>' +
    '<p class="q standalone">Answers: which critical skills are concentrated in only a few individuals</p>' +
    '<div class="sec flush">' + table('<th>Skill</th><th class="num">People</th><th class="num">Impact</th>', body) + '</div>';
}

function pageFuture() {
  const body = FUTURE_SORTED.map(f =>
    '<tr data-skill="' + esc(f.skill) + '" data-list="future">' +
      '<td class="name">' + nameLine(f.skill, f.skill) +
        '<div class="why">' + esc(f.driver) + '</div></td>' +
      '<td>' + coverageCell(f.currentCoverage) + '</td>' +
      '<td class="num">' + f.targetCoverage + '%</td>' +
      '<td class="num"><span class="pill md">+' + (f.targetCoverage - f.currentCoverage) + ' pts</span></td></tr>').join("");

  return '<h1 class="h1">Future skills</h1>' +
    '<p class="sub">What the next two years need, and how far short the workforce is today.</p>' +
    '<p class="q standalone">Answers: what skills will be needed to support future business and technology strategies</p>' +
    '<div class="sec flush">' + table('<th>Skill</th><th>Today</th><th class="num">Needed</th><th class="num">Gap</th>', body) + '</div>';
}

function personPlans(e) {
  const skills = e.learning.concat(e.has.filter(sk => riskFor(sk)).map(sk => (riskFor(sk) || {}).skill));
  const unique = skills.filter((sk, i) => sk && skills.indexOf(sk) === i);
  return { total: unique.length, done: unique.filter(isPlanStarted).length };
}

function pagePeople() {
  const person = D.employees.find(e => e.id === state.person) || D.employees[0];

  const picker = '<div class="picker">' + D.employees.map(e => {
    const t = personPlans(e);
    return '<div class="who' + (e.id === person.id ? " on" : "") + '" data-person="' + esc(e.id) + '">' +
      '<b>' + esc(e.name) + (t.done ? '<i class="tick">' + t.done + '</i>' : "") + '</b>' +
      '<span>' + esc(e.role) + '</span></div>';
  }).join("") + '</div>';

  // Where this person is one of very few holders. This is the line that makes
  // knowledge concentration personal instead of a number on a manager's screen.
  const rare = person.has.map(skill => riskFor(skill)).filter(Boolean);

  const held = person.has.map(skill => {
    const row = ALL.find(r => r.skill === skill);
    const cov = row ? row.coverage : null;
    const thin = riskFor(skill);
    return '<tr data-skill="' + esc(skill) + '" data-list="skills"><td class="name">' + nameLine(skill, skill) + '</td>' +
      '<td>' + (cov === null ? "" : coverageCell(cov)) + '</td>' +
      '<td class="num">' + (thin ? '<span class="pill hi">1 of ' + thin.headcount + ' here</span>' : "") + '</td></tr>';
  }).join("");

  const plan = person.learning.map(skill => {
    const a = actionFor(skill);
    const fut = futureFor(skill);
    const row = ALL.find(r => r.skill === skill);
    if (!a) return "";
    return '<div class="planrow">' +
      '<div class="planrow-h"><b data-skill="' + esc(skill) + '" data-list="skills">' + esc(skill) + '</b>' +
        '<span class="pill plan">' + esc(a.method) + '</span>' + planBadge(skill) + '</div>' +
      '<p class="prose">' + esc(a.detail) + '</p>' +
      '<div class="why">' + (fut ? "Needed at " + fut.targetCoverage + " percent by 2027. " + esc(fut.driver)
        : row ? "Only " + row.coverage + " percent of this job group can do it today." : "") + '</div>' +
      '<label class="check' + (isPlanStarted(skill) ? " done" : "") + '">' +
        '<input type="checkbox" class="emp-plan" data-plan="' + esc(skill) + '"' +
        (isPlanStarted(skill) ? " checked" : "") + '> Development plan started</label>' +
    '</div>';
  }).join("");

  return '<h1 class="h1">Employee view</h1>' +
    '<p class="sub">The same data seen by the person, not the manager. Sample profiles.</p>' +
    '<p class="q standalone">Answers: how can employees close skill gaps through training, mentoring, certifications, job rotations, or project experiences</p>' +
    picker +
    '<div class="skill-head" style="margin-top:22px"><div>' +
      '<h2 class="h1">' + esc(person.name) + '</h2>' +
      '<p class="sub">' + esc(person.role) + ' at ' + esc(person.site) + '. ' + person.years + ' years.</p></div>' +
      '<span class="pill ' + (rare.length ? "hi" : "ok") + '">' +
        (rare.length ? "Knowledge to pass on" : "No concentration risk") + '</span></div>' +
    (rare.length
      ? '<div class="sec"><div class="sec-h"><b>You are one of the few</b><span>' + esc(person.note) + '</span></div>' +
        rare.map(r => {
          const pass = actionFor(r.skill) || actionFor(r.skill.split(" - ")[0]);
          return '<div class="planrow"><div class="planrow-h"><b data-skill="' + esc(r.skill) + '" data-list="risk">' +
            esc(r.skill) + '</b><span class="pill hi">1 of ' + r.headcount + '</span>' + planBadge(r.skill) + '</div>' +
            '<p class="prose">You are one of ' + people(r.headcount) + ' at ' +
              esc(r.location.split(" (")[0]) + ' who can do this. ' + esc(r.note) + '</p>' +
            (pass ? '<div class="why">Your step to pass it on: ' + esc(pass.method.toLowerCase()) + '. ' + esc(pass.detail) + '</div>' +
              '<label class="check' + (isPlanStarted(r.skill) ? " done" : "") + '">' +
              '<input type="checkbox" class="emp-plan" data-plan="' + esc(r.skill) + '"' +
              (isPlanStarted(r.skill) ? " checked" : "") + '> Knowledge transfer started</label>' : "") +
          '</div>';
        }).join("") + '</div>'
      : '') +
    '<div class="sec"><div class="sec-h"><b>Skills you have</b><span>click one for the full picture</span></div>' +
      table('<th>Skill</th><th>Coverage in your job group</th><th class="num">Rarity</th>', held) + '</div>' +
    '<div class="sec"><div class="sec-h"><b>Your development plan</b><span>' + person.learning.length +
      (person.learning.length === 1 ? ' skill' : ' skills') + ' in progress</span></div>' + plan + '</div>';
}

function pagePlans() {
  const started = startedSkills();

  if (!started.length) {
    return '<h1 class="h1">Plans you have started</h1>' +
      '<p class="sub">Nothing started yet. Open any skill and tick "Development plan started".</p>' +
      '<p class="empty">Ticked plans collect here, so twelve clicks later you can still see what you committed to.</p>';
  }

  const rows = started.map(skill => {
    const row = ALL.find(r => r.skill === skill);
    const risk = riskFor(skill);
    const a = actionFor(skill) || actionFor(skill.split(" - ")[0]);
    const who = D.employees.filter(e => e.learning.indexOf(skill) > -1 || e.has.indexOf(skill) > -1);
    return '<tr><td class="name" data-skill="' + esc(skill) + '" data-list="skills">' + nameLine(skill, skill) +
        '<div class="why">' + (a ? esc(a.method) + ". " : "") +
          (risk ? people(risk.headcount) + ' hold it at ' + esc(risk.location.split(" (")[0]) + '. ' : "") +
          (row ? row.coverage + ' percent coverage today.' : "") + '</div></td>' +
      '<td class="grp">' + (who.length ? who.map(e => esc(e.name)).join(", ") : "Manager plan") + '</td>' +
      '<td class="num"><button class="mini-btn" data-unplan="' + esc(skill) + '">Mark not started</button></td></tr>';
  }).join("");

  return '<h1 class="h1">Plans you have started</h1>' +
    '<p class="sub">' + started.length + (started.length === 1 ? ' plan' : ' plans') +
      ' in progress. Saved in this browser, and the same list the Overview counts.</p>' +
    '<div class="sec flush">' +
      table('<th>Skill</th><th>Owner</th><th class="num">Undo</th>', rows) + '</div>';
}

function pagePlants() {
  // Same idea as the skills page: folders, not an eighteen row wall.
  const kindOf = p => /Corporate/.test(p) ? "offices"
    : /Pizza/.test(p) ? "pizza"
    : /Packaging/.test(p) ? "packaging"
    : "desserts";

  const bands = [
    { id: "pizza", label: "Pizza and appetizer plants", open: true },
    { id: "desserts", label: "Frozen dessert plants", open: false },
    { id: "packaging", label: "Packaging", open: false },
    { id: "offices", label: "Corporate offices", open: false }
  ];

  const cell = p => {
    const open = p.indexOf("(");
    const name = open > -1 ? p.slice(0, open).trim() : p;
    const kind = open > -1 ? p.slice(open + 1).replace(")", "") : "";
    return '<div>' + esc(name) + '<span>' + esc(kind) + '</span></div>';
  };

  return '<h1 class="h1">Plants and offices</h1>' +
    '<p class="sub">Compiled from public reporting, not a list the company publishes. Sioux Falls opens in 2027.</p>' +
    '<div class="sec flush">' + bands.map(b => {
      const list = D.plants.filter(p => kindOf(p) === b.id);
      return '<details class="group"' + (b.open ? " open" : "") + '>' +
        '<summary><span class="pill plan">' + b.label + '</span><em>' + list.length +
          (list.length === 1 ? " site" : " sites") + '</em></summary>' +
        '<div class="group-b"><div class="grid2">' + list.map(cell).join("") + '</div></div>' +
      '</details>';
    }).join("") + '</div>';
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
    ? '<div class="sec"><div class="sec-h"><b>How to close it</b><span>first step' +
        '<em class="q">Answers: how employees close skill gaps</em></span></div>' +
      '<div class="plan"><span class="plan-m">' + esc(plan.method) + '</span><p class="prose">' + esc(plan.detail) + '</p></div>' +
      altSec +
      '<label class="check' + (isPlanStarted(skill) ? " done" : "") + '">' +
        '<input type="checkbox" id="plan-box"' + (isPlanStarted(skill) ? " checked" : "") + '>' +
        ' Development plan started</label></div>'
    // No plan is a decision, not an oversight, so the page says which decision.
    : '<div class="sec"><div class="sec-h"><b>No plan set</b><span>and none needed yet</span></div>' +
      '<p class="prose">Plans are written where there is something to act on: coverage under 40 percent, a skill held by three people or fewer, or a 2027 target. ' +
      esc(skill) + ' is none of those' + (coverage !== null ? ', at ' + coverage + ' percent coverage' : "") +
      '. It is watched, not worked on.</p></div>';

  const src = provenanceFor(skill, segment);
  const srcSec = src
    ? '<div class="sec"><div class="sec-h"><b>Where this comes from</b>' +
        '<span>in a real deployment, not this demo</span></div>' +
      '<p class="prose">' + esc(src.systems) + '</p>' +
      (src.note ? '<p class="prose src-note">' + esc(src.note) +
        (src.url ? ' <a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + esc(src.source) + '</a>' : "") +
        '</p>' : "") +
    '</div>'
    : "";

  return navStrip() +
    '<div class="skill-head"><div><h1 class="h1">' + esc(skill) +
      (isPlanStarted(skill) ? '<i class="tick big" title="Plan started">&#10003;</i>' : "") +
      '</h1><p class="sub">' + esc(segment) + '</p></div>' +
      '<span class="pill ' + lv[0] + '">' + lv[1] + '</span></div>' +
    stats + riskSec + futureSec + planSec + srcSec;
}

/* ---------- render ---------- */

// How many started plans sit behind each tab, so you can see it from the top
// without opening the tab, let alone every row inside it.
function tabStarted(id) {
  if (id === "people") {
    return D.employees.filter(e => personPlans(e).done > 0).length;
  }
  const list = LISTS[id === "overview" ? "priority" : id];
  if (!list) return 0;
  return list.items().filter(isPlanStarted).length;
}

function renderTabs() {
  document.getElementById("tabs").innerHTML = TABS.map(t => {
    const done = tabStarted(t.id);
    return '<div class="tab' + (state.tab === t.id ? " on" : "") + '" data-tab="' + t.id + '">' + t.label +
      (t.count ? '<em>' + t.count + '</em>' : "") +
      (done ? '<i class="tick" title="' + done + ' started here">' + done + '</i>' : "") + '</div>';
  }).join("");
}

// Ticking a box should visibly do something on the spot, not only on the next render.
function markSaved(input) {
  const label = input.closest(".check");
  if (!label) return;
  label.classList.toggle("done", input.checked);
  let note = label.querySelector(".saved");
  if (!note) {
    note = document.createElement("span");
    note.className = "saved";
    label.appendChild(note);
  }
  note.textContent = input.checked ? "Saved" : "Cleared";
  note.classList.remove("flash");
  void note.offsetWidth;
  note.classList.add("flash");
}

// Adds or removes the green tick next to the skill title without a full redraw,
// so ticking the box does not throw you back to the top of the page.
function markTitle(on) {
  const title = document.querySelector(".skill-head .h1");
  if (!title) return;
  const existing = title.querySelector(".tick");
  if (on && !existing) {
    const t = document.createElement("i");
    t.className = "tick big";
    t.title = "Plan started";
    t.innerHTML = "&#10003;";
    title.appendChild(t);
  } else if (!on && existing) {
    existing.remove();
  }
}

function render() {
  renderTabs();

  const page = document.getElementById("page");
  if (state.skill) page.innerHTML = pageSkill(state.skill);
  else if (state.tab === "overview") page.innerHTML = pageOverview();
  else if (state.tab === "skills") page.innerHTML = pageSkills();
  else if (state.tab === "risk") page.innerHTML = pageRisk();
  else if (state.tab === "future") page.innerHTML = pageFuture();
  else if (state.tab === "people") page.innerHTML = pagePeople();
  else if (state.tab === "plans") page.innerHTML = pagePlans();
  else page.innerHTML = pagePlants();

  const box = document.getElementById("plan-box");
  if (box) box.addEventListener("change", () => {
    setPlanStarted(state.skill, box.checked);
    markSaved(box);
    updateCounter();
    markTitle(box.checked);
  });

  // Employee checkboxes write the same keys as the manager's, so a plan
  // started on one screen shows as started on the other.
  page.querySelectorAll(".emp-plan").forEach(cb =>
    cb.addEventListener("change", () => {
      setPlanStarted(cb.dataset.plan, cb.checked);
      markSaved(cb);
      updateCounter();
    }));

  updateCounter();
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

  const who = e.target.closest("[data-person]");
  if (who) { state.person = who.dataset.person; return render(); }

  const jump = e.target.closest("[data-goto]");
  if (jump) {
    state.tab = jump.dataset.goto;
    state.skill = null;
    state.list = null;
    return render();
  }

  // A checkbox and its label are controls, not links. Without this, ticking a
  // plan box was read as "open that skill" and the page changed under you.
  if (e.target.closest("label, input")) return;

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

document.getElementById("plans-btn").addEventListener("click", () => {
  state.tab = "plans";
  state.skill = null;
  state.list = null;
  render();
});

document.getElementById("page").addEventListener("click", e => {
  const undo = e.target.closest("[data-unplan]");
  if (!undo) return;
  setPlanStarted(undo.dataset.unplan, false);
  render();
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
