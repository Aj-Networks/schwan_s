/* SkillSight: the five questions.
   Same system as the Portfolio 2014-26 deck: 20 x 11.25 canvas, navy field,
   full-bleed blocks, oversized numerals, hairline rules, emphasis by scale. */

const pptxgen = require("pptxgenjs");

const NAVY = "232E54", NAVY_2 = "324070", INK = "18212F";
const MIST = "EEF2F5", LINE = "D9D9D9", PAPER = "FFFFFF", GREY = "6E7788";
const PALE = "B9C2D4", STEEL = "8E98AE", EDGE = "44528A", SOFT2 = "DCE3EA", TINT = "C3CCDA";

const DISPLAY = "Bahnschrift SemiBold";
const DISPLAY_L = "Bahnschrift Light";
const BODY = "Calibri";

const W = 20, H = 11.25, ML = 1.4, COL = W - 2.8;
const OUT = process.argv[2];

const pres = new pptxgen();
pres.defineLayout({ name: "PORTFOLIO", width: W, height: H });
pres.layout = "PORTFOLIO";
pres.author = "Ajay Angdembe";
pres.title = "SkillSight: the five questions";

const txt = (s, t, o) => s.addText(t, Object.assign({ isTextBox: true, margin: 0 }, o));

function rule(s, y, o = {}) {
  s.addShape(pres.ShapeType.line, {
    x: o.x === undefined ? ML : o.x, y, w: o.w === undefined ? COL : o.w, h: 0,
    line: { color: o.color || LINE, width: o.width || 1 }
  });
}

function block(s, x, y, w, h, color) {
  s.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color }, line: { color, width: 0 } });
}

function footer(s, where, from, onNavy) {
  const label = onNavy ? STEEL : GREY;
  const value = onNavy ? PAPER : INK;
  rule(s, 10.05, { color: onNavy ? NAVY_2 : LINE });
  txt(s, [
    { text: "IN THE APP   ", options: { bold: true, color: label, charSpacing: 2 } },
    { text: where, options: { color: value } }
  ], { x: ML, y: 10.25, w: 8.9, h: 0.45, fontFace: BODY, fontSize: 14 });
  txt(s, [
    { text: "NUMBERS FROM   ", options: { bold: true, color: label, charSpacing: 2 } },
    { text: from, options: { color: value } }
  ], { x: ML + 8.9, y: 10.25, w: 8.3, h: 0.45, fontFace: BODY, fontSize: 14 });
}

function question(s, n, lines, o = {}) {
  txt(s, n, {
    x: ML - 0.12, y: 0.62, w: 2.5, h: 2.4,
    fontFace: DISPLAY, fontSize: 140, color: o.numColor || MIST, lineSpacingMultiple: 0.82
  });
  txt(s, lines, {
    x: ML + 2.9, y: 0.95, w: o.w || (COL - 2.9), h: o.h || 1.6,
    fontFace: DISPLAY, fontSize: o.size || 30, color: o.color || NAVY, lineSpacingMultiple: 1.08
  });
}

function answer(s, lines, y, o = {}) {
  txt(s, lines, {
    x: ML, y, w: o.w || COL, h: o.h || 1.7,
    fontFace: DISPLAY, fontSize: o.size || 38, color: o.color || INK, lineSpacingMultiple: 1.06
  });
}

function bar(s, x, y, w, pct, color, o = {}) {
  const h = o.h || 0.26;
  if (!o.noTrack) {
    const t = o.track || MIST;
    s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.5, fill: { color: t }, line: { color: t, width: 0 } });
  }
  const fill = Math.max(w * pct / 100, 0.12);
  s.addShape(pres.ShapeType.roundRect, { x, y, w: fill, h, rectRadius: 0.5, fill: { color }, line: { color, width: 0 } });
}

/* ---------- 1. cover ---------- */
let s = pres.addSlide();
block(s, 0, 0, W, H, NAVY);
block(s, -0.5, 7.4, 9.2, 4.4, NAVY_2);
txt(s, "SkillSight", { x: ML, y: 2.5, w: 9.2, h: 2.2, fontFace: DISPLAY, fontSize: 116, color: PAPER, lineSpacingMultiple: 0.9 });
rule(s, 4.95, { color: EDGE, width: 2, w: 6.4 });
txt(s, "THE FIVE QUESTIONS, ANSWERED IN ORDER", { x: ML, y: 5.2, w: 13, h: 0.6, fontFace: BODY, fontSize: 20, bold: true, color: PAPER, charSpacing: 6 });
txt(s, "What skills Schwan's has, what it will need, who holds the rare ones,\nwhat to fix first, and how one person closes a gap.",
  { x: ML, y: 6.1, w: 11.5, h: 1.4, fontFace: BODY, fontSize: 21, color: PALE, lineSpacingMultiple: 1.35 });
txt(s, "01", { x: 16.4, y: 2.4, w: 2.2, h: 1.8, fontFace: DISPLAY_L, fontSize: 92, color: NAVY_2, align: "right" });
rule(s, 4.1, { x: 17.55, w: 1.05, color: EDGE, width: 2 });
txt(s, "05", { x: 16.4, y: 4.3, w: 2.2, h: 1.8, fontFace: DISPLAY_L, fontSize: 92, color: NAVY_2, align: "right" });
txt(s, "SOUTHWEST MN HACKS 2026", { x: ML, y: 9.5, w: 9, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: STEEL, charSpacing: 3 });
txt(s, "Schwan's Prompt 01  ·  Talent Readiness and Skills Intelligence  ·  Ajay Angdembe, solo",
  { x: ML, y: 9.95, w: 14, h: 0.5, fontFace: BODY, fontSize: 17, color: PAPER });
s.addNotes("Five questions, five answers, in the order the prompt asks them. The app's tabs run in the same order.");

/* ---------- 2. contents ---------- */
s = pres.addSlide();
block(s, 0, 0, 7.2, H, MIST);
txt(s, "CONTENTS", { x: ML, y: 1.0, w: 5, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: GREY, charSpacing: 3 });
txt(s, "Five questions,\nfive answers.", { x: ML, y: 1.6, w: 5.4, h: 2.6, fontFace: DISPLAY, fontSize: 44, color: NAVY, lineSpacingMultiple: 1.05 });
txt(s, "Each answer names the tab it lives on, and whether its numbers are demo data or a sourced fact.",
  { x: ML, y: 4.6, w: 4.4, h: 2, fontFace: BODY, fontSize: 17, color: GREY, lineSpacingMultiple: 1.35 });

[
  ["01", "What skills exist today", "Skills"],
  ["02", "What will be needed next", "Future skills"],
  ["03", "Who holds the rare ones", "Succession risk"],
  ["04", "What to fix first", "Overview"],
  ["05", "How a person closes a gap", "Employee view"]
].forEach((r, i) => {
  const y = 1.55 + i * 1.62;
  txt(s, r[0], { x: 8.3, y: y - 0.22, w: 1.5, h: 1.1, fontFace: DISPLAY_L, fontSize: 58, color: NAVY_2 });
  txt(s, r[1], { x: 10.0, y: y - 0.02, w: 5.9, h: 0.7, fontFace: DISPLAY, fontSize: 26, color: NAVY });
  txt(s, r[2] + " tab", { x: 16.1, y: y + 0.14, w: 2.6, h: 0.5, fontFace: BODY, fontSize: 15, color: GREY, align: "right" });
  if (i < 4) rule(s, y + 1.16, { x: 8.3, w: 10.4 });
});
s.addNotes("The tabs in the app run in this order, so nothing has to be hunted for.");

/* ---------- 3. Q1 ---------- */
s = pres.addSlide();
question(s, "01", "What skills and competencies exist\nacross our workforce today?");
answer(s, "20 skills tracked across four job groups.\nAverage coverage 50 percent.", 3.0, { w: 15 });
txt(s, "Coverage is the share of a job group that holds the skill. The Skills tab sorts them into three bands and opens only the critical one, because twenty rows at once tells you nothing.",
  { x: ML, y: 4.95, w: 13.6, h: 0.9, fontFace: BODY, fontSize: 18, color: GREY, lineSpacingMultiple: 1.3 });

[
  ["7", "Critical gap", "under 40 percent", "Worst: Salina line setup, 12 percent", 18],
  ["6", "Needs attention", "40 to 59 percent", "Analytics, supply chain, packaging", 49],
  ["7", "Well covered", "60 percent and up", "Food safety 91, route sales 88", 80]
].forEach((b, i) => {
  const y = 6.2 + i * 1.28;
  rule(s, y - 0.26);
  txt(s, b[0], { x: ML, y: y - 0.16, w: 1.1, h: 0.85, fontFace: DISPLAY, fontSize: 42, color: NAVY });
  txt(s, b[1], { x: ML + 1.2, y: y - 0.02, w: 3.3, h: 0.45, fontFace: DISPLAY, fontSize: 21, color: INK });
  txt(s, b[2], { x: ML + 1.2, y: y + 0.42, w: 3.3, h: 0.35, fontFace: BODY, fontSize: 14, color: GREY });
  bar(s, ML + 4.9, y + 0.16, 6.4, b[4], i === 0 ? NAVY : TINT);
  txt(s, b[3], { x: ML + 11.6, y: y + 0.04, w: 5.6, h: 0.5, fontFace: BODY, fontSize: 16, color: GREY });
});
footer(s, "Skills tab", "Demo coverage. Job groups are Schwan's own career areas.");
s.addNotes("Twenty skills. The answer is not the list, it is which band you look at first.");

/* ---------- 4. Q2 ---------- */
s = pres.addSlide();
block(s, 0, 0, W, H, MIST);
question(s, "02", "What skills will be needed to support\nfuture business and technology strategies?", { numColor: SOFT2 });
answer(s, "Five skills carry a 2027 target, each tied\nto something the company is already doing.", 3.0, { w: 15.4, size: 36 });

[
  ["Legal and compliance", 20, 55, "CJ CheilJedang integration"],
  ["PLC and automation", 34, 65, "Sioux Falls plant opens 2027"],
  ["Data analytics", 41, 70, "Demand forecasting rollout"],
  ["Refrigeration and ammonia", 22, 50, "Frozen capacity expansion"],
  ["Menu and culinary consulting", 29, 55, "K-12 and healthcare accounts"]
].forEach((f, i) => {
  const y = 5.2 + i * 0.95;
  txt(s, f[0], { x: ML, y, w: 4.4, h: 0.45, fontFace: DISPLAY, fontSize: 19, color: INK });
  bar(s, ML + 4.8, y + 0.1, 5.0, f[2], TINT, { track: PAPER });
  bar(s, ML + 4.8, y + 0.1, 5.0, f[1], NAVY, { noTrack: true });
  txt(s, f[1] + " to " + f[2], { x: ML + 10.05, y: y + 0.02, w: 1.8, h: 0.45, fontFace: "Consolas", fontSize: 15, color: INK });
  txt(s, "+" + (f[2] - f[1]), { x: ML + 11.85, y: y + 0.01, w: 0.85, h: 0.45, fontFace: DISPLAY, fontSize: 19, color: NAVY });
  txt(s, f[3], { x: ML + 12.9, y: y + 0.04, w: 4.3, h: 0.5, fontFace: BODY, fontSize: 15, color: GREY });
  if (i < 4) rule(s, y + 0.76, { color: SOFT2 });
});
txt(s, "Dark bar is coverage today. Light bar is what 2027 needs.",
  { x: ML + 4.8, y: 4.72, w: 7.5, h: 0.4, fontFace: BODY, fontSize: 14, color: GREY });
footer(s, "Future skills tab", "Demo targets. Drivers sourced: company release, CJ CheilJedang.");
s.addNotes("Every target is attached to a real business driver, not a guess about technology in general.");

/* ---------- 5. Q3 ---------- */
s = pres.addSlide();
block(s, 0, 0, W, H, NAVY);
block(s, 11.6, -0.4, 9, 12, NAVY_2);
question(s, "03", "Which critical skills are\nconcentrated in only a\nfew individuals?", { color: PAPER, numColor: EDGE, w: 7.3, size: 26, h: 2.2 });
answer(s, "Six skills sit with three\npeople or fewer. One sits\nwith a single person.", 3.9, { size: 36, color: PAPER, w: 9.2, h: 3.0 });
txt(s, "A skill known by one person is not a statistic. It is a production risk with a name on it.",
  { x: ML, y: 7.4, w: 9.2, h: 1.6, fontFace: BODY, fontSize: 19, color: PALE, lineSpacingMultiple: 1.35 });

[
  ["R&D, frozen dough", "1", "Marshall, MN R&D centre", "impact 4"],
  ["Ammonia refrigeration", "2", "Marshall, MN ice cream", "impact 5"],
  ["Food labeling rules", "2", "Hopkins, MN corporate", "impact 5"],
  ["Salina line setup", "2", "Salina, KS pizza", "impact 4"],
  ["PLC automation", "3", "Salina, KS pizza", "impact 4"],
  ["Culinary consulting", "3", "Field, national", "impact 3"]
].forEach((r, i) => {
  const y = 1.15 + i * 1.44;
  txt(s, r[1], { x: 12.1, y: y - 0.12, w: 1.0, h: 1.0, fontFace: DISPLAY, fontSize: 46, color: PAPER });
  txt(s, r[0], { x: 13.2, y: y + 0.02, w: 5.0, h: 0.45, fontFace: DISPLAY, fontSize: 19, color: PAPER });
  txt(s, r[2] + "  ·  " + r[3], { x: 13.2, y: y + 0.5, w: 5.2, h: 0.4, fontFace: BODY, fontSize: 14, color: PALE });
  if (i < 5) rule(s, y + 1.08, { x: 12.1, w: 6.3, color: EDGE });
});
footer(s, "Succession risk tab", "Demo headcounts. The ammonia roster exists by law: OSHA 1910.119.", true);
s.addNotes("One person at Marshall knows frozen dough formulation. That is the slide judges remember.");

/* ---------- 6. Q4 ---------- */
s = pres.addSlide();
question(s, "04", "Where are our greatest capability gaps\nand succession risks?");
answer(s, "Seven skills under 40 percent, and one\nranked order of work across both.", 3.0, { w: 15.4 });
txt(s, "Most dashboards stop at the numbers. This one sorts them, so a manager gets a list instead of a puzzle.",
  { x: ML, y: 4.95, w: 13.5, h: 0.6, fontFace: BODY, fontSize: 18, color: GREY });

[
  ["01", "R&D, frozen dough", "1 person holds it"],
  ["02", "Food labeling", "2 people, impact 5"],
  ["03", "Ammonia refrigeration", "2 people, impact 5"],
  ["04", "Salina line setup", "nothing written down"],
  ["05", "PLC automation", "3 people, Sioux Falls needs it"],
  ["06", "Culinary consulting", "3 people, national cover"]
].forEach((o, i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = ML + col * 5.8, y = 6.0 + row * 1.85;
  if (i === 0) block(s, x - 0.35, y - 0.35, 5.3, 1.6, NAVY);
  txt(s, o[0], { x, y: y - 0.2, w: 1.3, h: 0.8, fontFace: DISPLAY_L, fontSize: 42, color: i === 0 ? STEEL : TINT });
  txt(s, o[1], { x: x + 1.3, y: y - 0.12, w: 3.5, h: 0.5, fontFace: DISPLAY, fontSize: 20, color: i === 0 ? PAPER : INK });
  txt(s, o[2], { x: x + 1.3, y: y + 0.4, w: 3.5, h: 0.4, fontFace: BODY, fontSize: 14, color: i === 0 ? PALE : GREY });
});
txt(s, "score  =  impact out of 5   ×   3 ÷ number of holders   ×   size of the coverage gap",
  { x: ML, y: 9.45, w: 15, h: 0.45, fontFace: "Consolas", fontSize: 16, color: NAVY });
footer(s, "Overview tab, Do this first", "Demo inputs. The formula is on screen, not hidden.");
s.addNotes("Frozen dough wins because it is the only skill held by one person and it scores 4 of 5 on impact.");

/* ---------- 7. Q5 ---------- */
s = pres.addSlide();
block(s, 0, 0, W, H, MIST);
block(s, 12.4, -0.4, 8.2, 12, PAPER);
question(s, "05", "How can employees close skill gaps\nthrough training, mentoring,\ncertifications or rotations?", { numColor: SOFT2, w: 7.6, size: 26, h: 2.2 });
answer(s, "Ten first steps, sixteen backups,\nall five methods the prompt names.", 3.6, { size: 34, w: 10.4, h: 2.0 });

[
  ["Training", 8, "Vendor PLC course, labeling workshop"],
  ["Mentoring", 6, "The single expert takes two mentees"],
  ["Project experience", 5, "Two techs join the Sioux Falls team"],
  ["Certification", 4, "RETA ammonia, Green Belt for supervisors"],
  ["Job rotation", 3, "Techs rotate through Salina's lines"]
].forEach((m, i) => {
  const y = 5.9 + i * 0.9;
  txt(s, String(m[1]), { x: ML, y: y - 0.06, w: 0.85, h: 0.65, fontFace: DISPLAY, fontSize: 30, color: NAVY });
  txt(s, m[0], { x: ML + 0.9, y: y + 0.04, w: 3.1, h: 0.45, fontFace: DISPLAY, fontSize: 19, color: INK });
  txt(s, m[2], { x: ML + 4.2, y: y + 0.06, w: 6.2, h: 0.45, fontFace: BODY, fontSize: 15, color: GREY });
  if (i < 4) rule(s, y + 0.7, { w: 10.4, color: SOFT2 });
});

txt(s, "SEEN FROM THE OTHER SIDE", { x: 13.1, y: 3.3, w: 5.4, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: GREY, charSpacing: 3 });
txt(s, "Sam K.", { x: 13.1, y: 3.85, w: 5.4, h: 0.85, fontFace: DISPLAY, fontSize: 40, color: NAVY });
txt(s, "Refrigeration technician, Marshall. Fourteen years.", { x: 13.1, y: 4.8, w: 5.3, h: 0.5, fontFace: BODY, fontSize: 16, color: GREY });
rule(s, 5.5, { x: 13.1, w: 5.3 });
txt(s, "One of two people who hold the ammonia certification, so his step is to pass it on. He ticks the same box his manager sees.",
  { x: 13.1, y: 5.75, w: 5.3, h: 2.2, fontFace: BODY, fontSize: 18, color: INK, lineSpacingMultiple: 1.35 });
txt(s, "The prompt says employees close gaps. So one screen speaks to the employee, not only about them.",
  { x: 13.1, y: 8.1, w: 5.3, h: 1.5, fontFace: BODY, fontSize: 16, italic: true, color: GREY, lineSpacingMultiple: 1.3 });
footer(s, "Every skill page, plus the Employee view tab", "Demo plans. Methods are the five the prompt names.");
s.addNotes("Ten first steps and sixteen backups, covering every method the prompt lists.");

/* ---------- 8. beyond the five ---------- */
s = pres.addSlide();
txt(s, "BEYOND THE FIVE", { x: ML, y: 1.0, w: 6, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: GREY, charSpacing: 3 });
txt(s, "Two questions the prompt implies\nbut does not ask.", { x: ML, y: 1.55, w: 13, h: 2, fontFace: DISPLAY, fontSize: 42, color: NAVY, lineSpacingMultiple: 1.08 });

[
  ["Where would this data\nactually come from?",
   "Every skill page names the systems a real deployment would read. Ammonia systems over 10,000 pounds are an OSHA covered process, so the trained-operator roster and its three year refresher dates are kept by law. A food safety plan must be overseen by a preventive controls qualified individual.",
   "One skill says plainly that it has no system of record anywhere. That is the finding, not a gap in the tool."],
  ["How much of this\nis made up?",
   "Coverage percentages, per-site headcounts and employee records are invented, and the app says so on its own front page. The job groups, locations, business drivers and regulations are sourced. Ten sources in all.",
   "Three claims were cut during the fact check because they only traced back to blogs. FACTS.md lists every one."]
].forEach((b, i) => {
  const x = ML + i * 8.7;
  if (i === 1) s.addShape(pres.ShapeType.line, { x: x - 0.85, y: 4.2, w: 0, h: 4.9, line: { color: LINE, width: 1 } });
  txt(s, b[0], { x, y: 4.2, w: 7.3, h: 1.4, fontFace: DISPLAY, fontSize: 27, color: NAVY, lineSpacingMultiple: 1.1 });
  txt(s, b[1], { x, y: 5.8, w: 7.3, h: 2.4, fontFace: BODY, fontSize: 17, color: INK, lineSpacingMultiple: 1.35 });
  txt(s, b[2], { x, y: 8.35, w: 7.3, h: 1.3, fontFace: BODY, fontSize: 17, italic: true, color: GREY, lineSpacingMultiple: 1.3 });
});
footer(s, "Read more on the Overview, and every skill page", "FACTS.md: every claim, its source, and what was cut.");
s.addNotes("The objection is always the data. Answer it before it is asked.");

/* ---------- 9. close ---------- */
s = pres.addSlide();
block(s, 0, 0, W, H, NAVY);
block(s, 10.9, -0.4, 10, 12, NAVY_2);
txt(s, "Five questions.\nFive tabs.\nSame order.", { x: ML, y: 3.1, w: 8.8, h: 3.4, fontFace: DISPLAY, fontSize: 56, color: PAPER, lineSpacingMultiple: 1.1 });
rule(s, 7.05, { w: 5.2, color: EDGE, width: 2 });
txt(s, "github.com/Aj-Networks/schwan_s", { x: ML, y: 7.35, w: 8.8, h: 0.5, fontFace: BODY, fontSize: 19, color: PALE });

[
  ["01", "Skills", "what exists today"],
  ["02", "Future skills", "what will be needed"],
  ["03", "Succession risk", "who holds it alone"],
  ["04", "Overview", "the gaps, ranked"],
  ["05", "Employee view", "how a person closes one"]
].forEach((m, i) => {
  const y = 2.65 + i * 1.4;
  txt(s, m[0], { x: 11.9, y: y - 0.1, w: 1.2, h: 0.8, fontFace: DISPLAY_L, fontSize: 40, color: STEEL });
  txt(s, m[1], { x: 13.1, y: y, w: 2.8, h: 0.5, fontFace: DISPLAY, fontSize: 22, color: PAPER });
  txt(s, m[2], { x: 16.05, y: y + 0.08, w: 2.65, h: 0.5, fontFace: BODY, fontSize: 15, color: PALE, align: "right" });
  if (i < 4) rule(s, y + 0.98, { x: 11.9, w: 6.8, color: EDGE });
});
s.addNotes("Thank you. Questions.");


/* ---------- 10: questions to expect ---------- */
s = pres.addSlide();
block(s, 0, 0, W, H, PAPER);
txt(s, "QUESTIONS TO EXPECT", { x: ML, y: 1.0, w: 8, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: GREY, charSpacing: 3 });
txt(s, "Ask me any of these.", { x: ML, y: 1.45, w: 14, h: 1.9, fontFace: DISPLAY, fontSize: 42, color: NAVY, lineSpacingMultiple: 1.06 });

[
  ["Are these real Schwan's numbers?", "No. Coverage and headcounts are demo data. Locations, job groups and the regulations are sourced."],
  ["Where would this data really come from?", "Training and certification records, maintenance sign-offs, HR job codes. OSHA keeps the ammonia roster by law."],
  ["How is the ranking calculated?", "Impact out of five, times three over the number of holders, times the size of the gap. Shown on screen."],
  ["Why is there no AI advisor?", "The prompt lists it as one option of seven. A chatbot over twenty seeded rows would have been a bluff."],
  ["Why only three employee profiles?", "They are samples. The view reads whatever roster it is given, and the plan state is shared with the manager."],
  ["What would you build next?", "Live HR data, plans matched to people automatically, and a manager's view of one team rather than the company."]
].forEach((q, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = ML + col * 8.7, y = 3.9 + row * 2.0;
  txt(s, q[0], { x, y, w: 7.5, h: 0.65, fontFace: DISPLAY, fontSize: 20, color: NAVY, lineSpacingMultiple: 1.12 });
  txt(s, q[1], { x, y: y + 0.7, w: 7.5, h: 0.95, fontFace: BODY, fontSize: 16, color: GREY, lineSpacingMultiple: 1.3 });
  if (col === 0) s.addShape("line", { x: x + 8.0, y: y - 0.15, w: 0, h: 1.7, line: { color: LINE, width: 1 } });
  if (row < 2) rule(s, y + 1.78, { x, w: 7.5, color: LINE });
});
footer(s, "Q&A.html in the repository has the full sheet", "FACTS.md lists every claim, its source, and what was cut");
s.addNotes("If a question is not on this list, the honest answer is fine: I do not know, and I would rather find out than guess.");

pres.writeFile({ fileName: OUT }).then(() => console.log("written", OUT));
