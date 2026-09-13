/* SkillSight pitch deck, built on the shared kit so it matches the
   five-questions deck and the Portfolio 2014-26 system. */

const K = require("./deckkit.js");
const {
  newDeck, useDeck, txt, rule, block, footer, bar,
  NAVY, NAVY_2, INK, MIST, LINE, PAPER, GREY, PALE, STEEL, EDGE, SOFT2, TINT,
  DISPLAY, DISPLAY_L, BODY, W, H, ML, COL
} = K;

const OUT = process.argv[2];
const pres = newDeck("SkillSight");
useDeck(pres);
const P = () => K.pres;

function kicker(s, text, y, color) {
  txt(s, text.toUpperCase(), { x: ML, y, w: 8, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: color || GREY, charSpacing: 3 });
}

function title(s, lines, y, o = {}) {
  txt(s, lines, { x: ML, y, w: o.w || 14, h: o.h || 2.0, fontFace: DISPLAY, fontSize: o.size || 44, color: o.color || NAVY, lineSpacingMultiple: 1.06 });
}

/* ---------- 1. cover ---------- */
let s = pres.addSlide();
block(s, 0, 0, W, H, NAVY);
block(s, 0, 8.9, W, 2.35, NAVY_2);
txt(s, "SkillSight", { x: ML, y: 2.4, w: 9.2, h: 2.3, fontFace: DISPLAY, fontSize: 116, color: PAPER, lineSpacingMultiple: 0.9 });
rule(s, 4.9, { color: EDGE, width: 2, w: 6.4 });
txt(s, "WORKFORCE SKILLS INTELLIGENCE", { x: ML, y: 5.15, w: 13, h: 0.6, fontFace: BODY, fontSize: 20, bold: true, color: PAPER, charSpacing: 6 });
txt(s, "What skills Schwan's people have, where those skills are missing,\nand where one person leaving stops the work.",
  { x: ML, y: 6.05, w: 12, h: 1.4, fontFace: BODY, fontSize: 21, color: PALE, lineSpacingMultiple: 1.35 });
txt(s, "20", { x: 15.6, y: 2.35, w: 3.0, h: 1.9, fontFace: DISPLAY_L, fontSize: 96, color: NAVY_2, align: "right" });
txt(s, "SKILLS TRACKED", { x: 15.6, y: 4.25, w: 3.0, h: 0.4, fontFace: BODY, fontSize: 13, color: EDGE, align: "right", charSpacing: 2 });
txt(s, "06", { x: 15.6, y: 5.1, w: 3.0, h: 1.9, fontFace: DISPLAY_L, fontSize: 96, color: NAVY_2, align: "right" });
txt(s, "HELD BY THREE OR FEWER", { x: 15.6, y: 7.0, w: 3.0, h: 0.4, fontFace: BODY, fontSize: 13, color: EDGE, align: "right", charSpacing: 2 });
txt(s, "SOUTHWEST MN HACKS 2026  ·  SCHWAN'S PROMPT 01", { x: ML, y: 9.45, w: 12, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: STEEL, charSpacing: 3 });
txt(s, "Talent Readiness and Skills Intelligence  ·  Ajay Angdembe, solo  ·  github.com/Aj-Networks/schwan_s",
  { x: ML, y: 9.9, w: 15, h: 0.5, fontFace: BODY, fontSize: 17, color: PAPER });
s.addNotes("SkillSight. What skills Schwan's has, where they are missing, and where one person leaving stops the work.");

/* ---------- 2. the problem ---------- */
s = pres.addSlide();
kicker(s, "The problem", 1.0);
title(s, "Skills data sits in different places,\nso a simple question has no answer.", 1.5, { w: 15 });
txt(s, "“If the person who knows the ammonia system leaves,\nwho else can do it?”",
  { x: ML, y: 4.2, w: 13, h: 1.8, fontFace: DISPLAY, fontSize: 34, italic: true, color: NAVY_2, lineSpacingMultiple: 1.2 });
txt(s, "Today that answer takes phone calls to three plants. It should take one click.",
  { x: ML, y: 6.2, w: 13, h: 0.6, fontFace: BODY, fontSize: 19, color: GREY });

[["12+", "US facilities"], ["4", "job groups"], ["2027", "Sioux Falls opens"], ["0", "single view of skills"]]
  .forEach((f, i) => {
    const x = ML + i * 4.3;
    txt(s, f[0], { x, y: 7.6, w: 4.0, h: 1.1, fontFace: DISPLAY, fontSize: 54, color: i === 3 ? NAVY : INK });
    txt(s, f[1], { x, y: 8.8, w: 4.0, h: 0.5, fontFace: BODY, fontSize: 15, color: GREY });
  });
rule(s, 7.45);
footer(s, "The whole app", "Facility count and job groups from Schwan's careers site.");
s.addNotes("More than a dozen US plants, four job groups, a new plant in 2027. No single place that shows what people can do.");

/* ---------- 3. what it does ---------- */
s = pres.addSlide();
block(s, 0, 0, 7.0, H, MIST);
kicker(s, "What it does", 1.0);
title(s, "Six pages.\nOne question each.", 1.5, { w: 5.2, size: 40 });
txt(s, "The five questions in the challenge, in the order the challenge asks them, plus the view built for the employee rather than the manager.",
  { x: ML, y: 4.4, w: 4.3, h: 2.4, fontFace: BODY, fontSize: 17, color: GREY, lineSpacingMultiple: 1.35 });

[
  ["Overview", "A ranked order of work, plus where coverage is lowest"],
  ["Skills", "Every skill and how well each one is covered"],
  ["Future skills", "What the next two years need, and the shortfall"],
  ["Succession risk", "Skills held by three people or fewer, and what it costs"],
  ["Employee view", "The same data seen by the person, not the manager"],
  ["Plants and offices", "Every site the data covers"]
].forEach((r, i) => {
  const y = 1.35 + i * 1.42;
  txt(s, "0" + (i + 1), { x: 8.1, y: y - 0.12, w: 1.2, h: 0.85, fontFace: DISPLAY_L, fontSize: 42, color: TINT });
  txt(s, r[0], { x: 9.5, y: y - 0.02, w: 3.6, h: 0.5, fontFace: DISPLAY, fontSize: 22, color: NAVY });
  txt(s, r[1], { x: 13.2, y: y + 0.06, w: 5.4, h: 0.6, fontFace: BODY, fontSize: 15, color: GREY });
  if (i < 5) rule(s, y + 0.98, { x: 8.1, w: 10.5 });
});
s.addNotes("One question per page, in the order the prompt asks. No dashboard wall.");

/* ---------- 4. where the gaps are ---------- */
s = pres.addSlide();
kicker(s, "Question 1 and 4", 1.0);
title(s, "Seven skills sit under 40 percent.", 1.5, { w: 15, h: 1.2 });
txt(s, "Coverage is the share of a job group that holds the skill. Under 40 percent means most of the group cannot do that work.",
  { x: ML, y: 3.15, w: 13.5, h: 0.6, fontFace: BODY, fontSize: 18, color: GREY });

[
  ["Salina line setup", 12], ["R&D, food science", 18], ["Legal and compliance", 20],
  ["Refrigeration and ammonia", 22], ["Menu and culinary consulting", 29],
  ["PLC and automation", 34], ["Lean and Six Sigma", 38]
].forEach((g, i) => {
  const y = 4.15 + i * 0.82;
  txt(s, g[0], { x: ML, y, w: 4.6, h: 0.45, fontFace: DISPLAY, fontSize: 19, color: INK });
  bar(s, ML + 5.0, y + 0.1, 9.6, g[1], i === 0 ? NAVY : NAVY_2);
  txt(s, g[1] + "%", { x: ML + 14.9, y: y + 0.02, w: 1.2, h: 0.45, fontFace: "Consolas", fontSize: 16, color: INK });
  if (i < 6) rule(s, y + 0.64);
});
footer(s, "Overview and Skills tabs", "Demo coverage figures, stated as demo data on screen.");
s.addNotes("Seven skills under forty percent. The worst is the Salina line setup at twelve.");

/* ---------- 5. skills only a few know ---------- */
s = pres.addSlide();
block(s, 0, 0, W, H, NAVY);
block(s, 11.6, -0.4, 9, 12, NAVY_2);
kicker(s, "Question 3", 1.0, STEEL);
title(s, "Six skills are held by\nthree people or fewer.", 1.5, { w: 9.4, size: 40, color: PAPER });
txt(s, "One of them is held by a single person, at the Marshall R&D centre. If that person leaves, frozen dough formulation leaves with them.",
  { x: ML, y: 4.5, w: 9.2, h: 1.8, fontFace: BODY, fontSize: 19, color: PALE, lineSpacingMultiple: 1.4 });
txt(s, "A skill known by one person is not a statistic.\nIt is a production risk with a name on it.",
  { x: ML, y: 6.8, w: 9.2, h: 1.6, fontFace: DISPLAY, fontSize: 24, color: PAPER, lineSpacingMultiple: 1.3 });

[
  ["R&D, frozen dough", "1", "Marshall, MN R&D centre"],
  ["Ammonia refrigeration", "2", "Marshall, MN ice cream"],
  ["Food labeling rules", "2", "Hopkins, MN corporate"],
  ["Salina line setup", "2", "Salina, KS pizza"],
  ["PLC automation", "3", "Salina, KS pizza"],
  ["Culinary consulting", "3", "Field, national"]
].forEach((r, i) => {
  const y = 1.15 + i * 1.44;
  txt(s, r[1], { x: 12.1, y: y - 0.12, w: 1.0, h: 1.0, fontFace: DISPLAY, fontSize: 46, color: PAPER });
  txt(s, r[0], { x: 13.2, y: y + 0.02, w: 5.0, h: 0.45, fontFace: DISPLAY, fontSize: 19, color: PAPER });
  txt(s, r[2], { x: 13.2, y: y + 0.5, w: 5.2, h: 0.4, fontFace: BODY, fontSize: 14, color: PALE });
  if (i < 5) rule(s, y + 1.08, { x: 12.1, w: 6.3, color: EDGE });
});
footer(s, "Succession risk tab", "Demo headcounts. The ammonia roster exists by law: OSHA 1910.119.", true);
s.addNotes("Six skills held by three people or fewer. One by a single person.");

/* ---------- 6. the part that matters ---------- */
s = pres.addSlide();
kicker(s, "The part that matters", 1.0);
title(s, "Most dashboards show numbers and stop.\nThis one puts them in an order of work.", 1.5, { w: 15.4, size: 40 });

[
  ["How much it hurts", "impact if the knowledge is lost"],
  ["How few hold it", "one person, or a handful"],
  ["How big the gap is", "distance from where it needs to be"]
].forEach((c, i) => {
  const x = ML + i * 5.8;
  block(s, x, 4.3, 5.2, 1.5, MIST);
  txt(s, c[0], { x: x + 0.3, y: 4.5, w: 4.6, h: 0.5, fontFace: DISPLAY, fontSize: 20, color: NAVY });
  txt(s, c[1], { x: x + 0.3, y: 5.0, w: 4.6, h: 0.5, fontFace: BODY, fontSize: 15, color: GREY });
});

[
  ["01", "R&D, frozen dough", "One person holds it. Pair the expert with two mentees."],
  ["02", "Food labeling", "Two people. Run a cross-border labeling workshop."],
  ["03", "Ammonia refrigeration", "Two people, both near retirement. Sponsor certification now."],
  ["04", "Salina line setup", "Two people, nothing written down. Write it down, then mentor backups."]
].forEach((o, i) => {
  const y = 6.35 + i * 0.85;
  txt(s, o[0], { x: ML, y: y - 0.06, w: 1.0, h: 0.6, fontFace: DISPLAY_L, fontSize: 30, color: i === 0 ? NAVY : TINT });
  txt(s, o[1], { x: ML + 1.2, y: y + 0.04, w: 4.2, h: 0.45, fontFace: DISPLAY, fontSize: 19, color: INK });
  txt(s, o[2], { x: ML + 5.6, y: y + 0.06, w: 11.6, h: 0.45, fontFace: BODY, fontSize: 16, color: GREY });
  if (i < 3) rule(s, y + 0.66);
});
footer(s, "Overview tab, Do this first", "score = impact × scarcity × gap size, shown on screen.");
s.addNotes("Ranking is the difference. A manager gets a list, not a puzzle.");

/* ---------- 7. what the next two years need ---------- */
s = pres.addSlide();
block(s, 0, 0, W, H, MIST);
kicker(s, "Question 2", 1.0);
title(s, "Five skills carry a 2027 target.", 1.5, { w: 15, h: 1.2 });
txt(s, "Each one is tied to something the company is already doing, not to technology in general.",
  { x: ML, y: 3.15, w: 13.5, h: 0.6, fontFace: BODY, fontSize: 18, color: GREY });
txt(s, "Dark bar is coverage today. Light bar is what 2027 needs.",
  { x: ML + 5.0, y: 3.9, w: 8, h: 0.4, fontFace: BODY, fontSize: 14, color: GREY });

[
  ["Legal and compliance", 20, 55, "CJ CheilJedang integration"],
  ["PLC and automation", 34, 65, "Sioux Falls plant opens 2027"],
  ["Data analytics", 41, 70, "Demand forecasting rollout"],
  ["Refrigeration and ammonia", 22, 50, "Frozen capacity expansion"],
  ["Menu and culinary consulting", 29, 55, "K-12 and healthcare accounts"]
].forEach((f, i) => {
  const y = 4.6 + i * 1.05;
  txt(s, f[0], { x: ML, y, w: 4.6, h: 0.45, fontFace: DISPLAY, fontSize: 19, color: INK });
  bar(s, ML + 5.0, y + 0.1, 5.6, f[2], TINT, { track: PAPER });
  bar(s, ML + 5.0, y + 0.1, 5.6, f[1], NAVY, { noTrack: true });
  txt(s, f[1] + " to " + f[2], { x: ML + 10.9, y: y + 0.02, w: 1.8, h: 0.45, fontFace: "Consolas", fontSize: 15, color: INK });
  txt(s, "+" + (f[2] - f[1]), { x: ML + 12.7, y: y + 0.01, w: 0.9, h: 0.45, fontFace: DISPLAY, fontSize: 19, color: NAVY });
  txt(s, f[3], { x: ML + 13.8, y: y + 0.04, w: 3.4, h: 0.5, fontFace: BODY, fontSize: 14, color: GREY });
  if (i < 4) rule(s, y + 0.84, { color: SOFT2 });
});
footer(s, "Future skills tab", "Demo targets. Drivers sourced: company release, CJ CheilJedang.");
s.addNotes("Sioux Falls opens in 2027 and needs automation techs. We are at 34 percent and need 65.");

/* ---------- 8. how it is built ---------- */
s = pres.addSlide();
kicker(s, "How it is built", 1.0);
title(s, "Four files. No framework,\nno build step, no dependencies.", 1.5, { w: 14, size: 40 });

[
  ["Runs with no internet", "Nothing loads from a CDN, so a bad venue network cannot break the demo."],
  ["Every line is mine", "No framework to hide behind. Ask me about any part of it."],
  ["Real state, not a mock-up", "Ticking a development plan is saved and survives a reload."],
  ["Checked by a script", "verify.js renders every page and asserts 42 list and plan combinations."]
].forEach((b, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = ML + col * 8.7, y = 4.3 + row * 2.3;
  txt(s, b[0], { x, y, w: 7.4, h: 0.5, fontFace: DISPLAY, fontSize: 22, color: NAVY });
  txt(s, b[1], { x, y: y + 0.6, w: 7.4, h: 1.2, fontFace: BODY, fontSize: 17, color: GREY, lineSpacingMultiple: 1.35 });
  if (col === 0) s.addShape("line", { x: x + 8.0, y: y - 0.1, w: 0, h: 1.8, line: { color: LINE, width: 1 } });
});
rule(s, 9.3);
txt(s, "index.html      style.css      script.js      data.js      verify.js",
  { x: ML, y: 9.5, w: 15, h: 0.45, fontFace: "Consolas", fontSize: 16, color: NAVY });
footer(s, "The repository", "Plain HTML, CSS and JavaScript. Nothing else.");
s.addNotes("Plain HTML, CSS and JavaScript. Open index.html and it runs.");

/* ---------- 9. close ---------- */
s = pres.addSlide();
block(s, 0, 0, W, H, NAVY);
block(s, 10.9, -0.4, 10, 12, NAVY_2);
txt(s, "What is next", { x: ML, y: 2.6, w: 8.8, h: 1.0, fontFace: DISPLAY, fontSize: 48, color: PAPER });
rule(s, 3.9, { w: 5.2, color: EDGE, width: 2 });
[
  "Connect to the HR system so the numbers are live.",
  "Match people to plans automatically, not one written step per skill.",
  "A badge tap at a plant that pulls up that person's skills and training."
].forEach((t, i) => {
  txt(s, t, { x: ML, y: 4.4 + i * 1.1, w: 8.6, h: 0.9, fontFace: BODY, fontSize: 19, color: PALE, lineSpacingMultiple: 1.3 });
});
txt(s, "github.com/Aj-Networks/schwan_s", { x: ML, y: 8.4, w: 8.8, h: 0.5, fontFace: BODY, fontSize: 19, color: PAPER });
txt(s, "Demo numbers. Plants, offices, job groups and the regulations are real and sourced.",
  { x: ML, y: 9.0, w: 8.8, h: 0.5, fontFace: BODY, fontSize: 14, color: STEEL });

txt(s, "SkillSight", { x: 12.0, y: 3.0, w: 6.6, h: 1.4, fontFace: DISPLAY, fontSize: 56, color: PAPER });
txt(s, "Shows what skills Schwan's people have, where those skills are missing, and where a critical one is known by too few.",
  { x: 12.0, y: 4.6, w: 6.4, h: 2.2, fontFace: BODY, fontSize: 18, color: PALE, lineSpacingMultiple: 1.4 });
rule(s, 7.1, { x: 12.0, w: 6.4, color: EDGE });
txt(s, "Ajay Angdembe  ·  solo entry", { x: 12.0, y: 7.35, w: 6.4, h: 0.5, fontFace: BODY, fontSize: 17, color: PAPER });
s.addNotes("Thank you. Questions.");


/* ---------- 10: questions to expect ---------- */
s = pres.addSlide();
block(s, 0, 0, W, H, MIST);
txt(s, "QUESTIONS TO EXPECT", { x: ML, y: 1.0, w: 8, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: GREY, charSpacing: 3 });
txt(s, "Ask me any of these.", { x: ML, y: 1.45, w: 14, h: 1.9, fontFace: DISPLAY, fontSize: 42, color: NAVY, lineSpacingMultiple: 1.06 });

[
  ["Are these real numbers?", "Coverage and headcounts are demo data. The job groups, sites, drivers and regulations are sourced in FACTS.md."],
  ["Workday already does this. Why build it?", "Those systems hold the data. This one ranks it and attaches a first step. It is a lens, not a replacement."],
  ["Did you use AI to build it?", "Yes, and the rules allow it. The architecture calls are mine and I can explain any line in the four files."],
  ["How is the order decided?", "Impact, how few people hold it, and how big the gap is, multiplied. The formula is on screen, not hidden."],
  ["What about privacy?", "Skills and training records only. No performance data. Employees see their own record, and the demo shows no real people."],
  ["What is still missing?", "Real data, plans matched to people automatically, and a team view for the manager who would open it weekly."]
].forEach((q, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = ML + col * 8.7, y = 3.9 + row * 2.0;
  txt(s, q[0], { x, y, w: 7.5, h: 0.65, fontFace: DISPLAY, fontSize: 20, color: NAVY, lineSpacingMultiple: 1.12 });
  txt(s, q[1], { x, y: y + 0.7, w: 7.5, h: 0.95, fontFace: BODY, fontSize: 16, color: GREY, lineSpacingMultiple: 1.3 });
  if (col === 0) s.addShape("line", { x: x + 8.0, y: y - 0.15, w: 0, h: 1.7, line: { color: SOFT2, width: 1 } });
  if (row < 2) rule(s, y + 1.78, { x, w: 7.5, color: SOFT2 });
});
footer(s, "Q&A.html in the repository has the full sheet", "FACTS.md lists every claim, its source, and what was cut");
s.addNotes("Six questions judges ask most. The seventh answer is: I do not know, and I would rather find out than guess.");

pres.writeFile({ fileName: OUT }).then(() => console.log("written", OUT));
