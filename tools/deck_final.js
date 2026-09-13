/* SkillSight, one deck for a three minute stage slot.
   Six slides. Every slide carries its script and its timing in the notes. */

const K = require("./deckkit.js");
const {
  newDeck, useDeck, txt, rule, block, footer, bar,
  NAVY, NAVY_2, INK, MIST, LINE, PAPER, GREY, PALE, STEEL, EDGE, SOFT2, TINT,
  DISPLAY, DISPLAY_L, BODY, W, H, ML, COL
} = K;

const OUT = process.argv[2];
const pres = newDeck("SkillSight");
useDeck(pres);

function kicker(s, text, y, color) {
  txt(s, text.toUpperCase(), { x: ML, y, w: 9, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: color || GREY, charSpacing: 3 });
}

function title(s, lines, y, o = {}) {
  txt(s, lines, { x: ML, y, w: o.w || 13.5, h: o.h || 2.0, fontFace: DISPLAY, fontSize: o.size || 44, color: o.color || NAVY, lineSpacingMultiple: 1.06 });
}

/* ============ 1. cover, 15 seconds ============ */
let s = pres.addSlide();
block(s, 0, 0, W, H, NAVY);
block(s, 0, 8.9, W, 2.35, NAVY_2);
txt(s, "SkillSight", { x: ML, y: 2.4, w: 9.2, h: 2.3, fontFace: DISPLAY, fontSize: 116, color: PAPER, lineSpacingMultiple: 0.9 });
rule(s, 4.9, { color: EDGE, width: 2, w: 6.4 });
txt(s, "WORKFORCE SKILLS INTELLIGENCE", { x: ML, y: 5.15, w: 12, h: 0.6, fontFace: BODY, fontSize: 20, bold: true, color: PAPER, charSpacing: 6 });
txt(s, "What skills Schwan's people have, where those skills are missing,\nand where one person leaving stops the work.",
  { x: ML, y: 6.05, w: 11.5, h: 1.4, fontFace: BODY, fontSize: 21, color: PALE, lineSpacingMultiple: 1.35 });
txt(s, "20", { x: 15.6, y: 2.35, w: 3.0, h: 1.9, fontFace: DISPLAY_L, fontSize: 96, color: NAVY_2, align: "right" });
txt(s, "SKILLS TRACKED", { x: 15.6, y: 4.25, w: 3.0, h: 0.4, fontFace: BODY, fontSize: 13, color: EDGE, align: "right", charSpacing: 2 });
txt(s, "06", { x: 15.6, y: 5.1, w: 3.0, h: 1.9, fontFace: DISPLAY_L, fontSize: 96, color: NAVY_2, align: "right" });
txt(s, "HELD BY THREE OR FEWER", { x: 15.6, y: 7.0, w: 3.0, h: 0.4, fontFace: BODY, fontSize: 13, color: EDGE, align: "right", charSpacing: 2 });
txt(s, "SOUTHWEST MN HACKS 2026  ·  SCHWAN'S PROMPT 01", { x: ML, y: 9.45, w: 12, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: STEEL, charSpacing: 3 });
txt(s, "Talent Readiness and Skills Intelligence  ·  Ajay Angdembe, solo  ·  github.com/Aj-Networks/schwan_s",
  { x: ML, y: 9.9, w: 15, h: 0.5, fontFace: BODY, fontSize: 17, color: PAPER });
s.addNotes(
  "0:00 to 0:15  OPENER\n\n" +
  "\"SkillSight. It shows what skills Schwan's people have, where those skills are missing, and where one person leaving stops the work.\"\n\n" +
  "Do not read the numbers out. Let them sit on the slide. Move on at fifteen seconds."
);

/* ============ 2. the problem, 25 seconds ============ */
s = pres.addSlide();
kicker(s, "The problem", 1.0);
title(s, "Skills data sits in different places,\nso a simple question has no answer.", 1.5, { w: 12.5 });
txt(s, "“If the person who knows the ammonia system leaves,\nwho else can do it?”",
  { x: ML, y: 4.3, w: 13, h: 1.8, fontFace: DISPLAY, fontSize: 34, italic: true, color: NAVY_2, lineSpacingMultiple: 1.2 });
txt(s, "Today that takes phone calls to three plants. It should take one click.",
  { x: ML, y: 6.3, w: 13, h: 0.6, fontFace: BODY, fontSize: 19, color: GREY });
rule(s, 7.45);
[["12+", "US facilities"], ["4", "job groups"], ["2027", "Sioux Falls opens"], ["0", "single view of skills"]]
  .forEach((f, i) => {
    const x = ML + i * 4.3;
    txt(s, f[0], { x, y: 7.6, w: 4.0, h: 1.1, fontFace: DISPLAY, fontSize: 54, color: i === 3 ? NAVY : INK });
    txt(s, f[1], { x, y: 8.8, w: 4.0, h: 0.5, fontFace: BODY, fontSize: 15, color: GREY });
  });
footer(s, "Sets up the whole demo", "Facilities and job groups from Schwan's careers site.");
s.addNotes(
  "0:15 to 0:40  THE PROBLEM\n\n" +
  "\"Schwan's runs more than a dozen US plants across four job groups, and a new plant opens in 2027.\"\n\n" +
  "\"But ask a simple question. If the person who knows the ammonia refrigeration system leaves, who else can do it? Today that answer takes phone calls to three plants.\"\n\n" +
  "Point at the zero. That is the whole problem in one number."
);

/* ============ 3. the finding, 35 seconds ============ */
s = pres.addSlide();
block(s, 0, 0, W, H, NAVY);
block(s, 11.6, -0.4, 9, 12, NAVY_2);
kicker(s, "What the data shows", 1.0, STEEL);
title(s, "Six skills are held by\nthree people or fewer.", 1.5, { w: 9.4, size: 40, color: PAPER });
txt(s, "One of them is held by a single person, at the Marshall R&D centre. If that person leaves, frozen dough formulation leaves with them.",
  { x: ML, y: 4.5, w: 9.2, h: 1.8, fontFace: BODY, fontSize: 19, color: PALE, lineSpacingMultiple: 1.4 });
txt(s, "A skill known by one person is not\na statistic. It is a production risk\nwith a name on it.",
  { x: ML, y: 6.7, w: 9.2, h: 2.2, fontFace: DISPLAY, fontSize: 24, color: PAPER, lineSpacingMultiple: 1.3 });
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
s.addNotes(
  "0:40 to 1:15  THE FINDING\n\n" +
  "\"Six skills in this demo are held by three people or fewer. One is held by a single person: frozen dough formulation, at the Marshall R&D centre.\"\n\n" +
  "\"Two of these are ammonia refrigeration techs who are close to retirement. That one is not guesswork. Ammonia systems over ten thousand pounds are an OSHA covered process, so the list of trained operators is kept by law. The data already exists.\"\n\n" +
  "Slow down here. This is the slide people remember."
);

/* ============ 4. the answer, 45 seconds ============ */
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
s.addNotes(
  "1:15 to 2:00  THE ANSWER  (the core of the pitch)\n\n" +
  "\"Most dashboards show numbers and stop. This one scores every at-risk skill on three things: how much it hurts, how few people hold it, and how big the gap is. Then it sorts them.\"\n\n" +
  "\"So a manager does not get a puzzle. They get an order of work. Fix frozen dough first, and here is the first step: pair the expert with two mentees.\"\n\n" +
  "\"Each step is one of the five methods the challenge names. Training, mentoring, certification, job rotation, project experience.\"\n\n" +
  "If you are demoing live, this is where you switch to the app and tick one plan box."
);

/* ============ 5. the employee, 30 seconds ============ */
s = pres.addSlide();
block(s, 0, 0, W, H, MIST);
block(s, 11.0, -0.4, 9.6, 12, PAPER);
kicker(s, "The other side of it", 1.0);
title(s, "The challenge says employees\nclose skill gaps.", 1.5, { w: 9.2, size: 38 });
txt(s, "So one screen speaks to the employee, not only about them. Same data, same saved state as the manager's view.",
  { x: ML, y: 4.2, w: 8.8, h: 1.2, fontFace: BODY, fontSize: 19, color: GREY, lineSpacingMultiple: 1.4 });
txt(s, "TEN FIRST STEPS, SIXTEEN BACKUPS, ACROSS ALL FIVE METHODS",
  { x: ML, y: 5.55, w: 8.8, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: GREY, charSpacing: 2 });

[
  ["Training", 8], ["Mentoring", 6], ["Project experience", 5], ["Certification", 4], ["Job rotation", 3]
].forEach((m, i) => {
  const y = 6.25 + i * 0.8;
  txt(s, String(m[1]), { x: ML, y: y - 0.06, w: 0.8, h: 0.6, fontFace: DISPLAY, fontSize: 28, color: NAVY });
  txt(s, m[0], { x: ML + 0.9, y: y + 0.04, w: 4.0, h: 0.45, fontFace: DISPLAY, fontSize: 19, color: INK });
  if (i < 4) rule(s, y + 0.62, { w: 8.8, color: SOFT2 });
});
txt(s, "SEEN FROM THE OTHER SIDE", { x: 11.9, y: 2.5, w: 6.0, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: GREY, charSpacing: 3 });
txt(s, "Sam K.", { x: 11.9, y: 3.05, w: 6.0, h: 0.9, fontFace: DISPLAY, fontSize: 44, color: NAVY });
txt(s, "Refrigeration technician, Marshall. Fourteen years.", { x: 11.9, y: 4.05, w: 5.9, h: 0.5, fontFace: BODY, fontSize: 16, color: GREY });
rule(s, 4.75, { x: 11.9, w: 5.9 });
txt(s, "One of two people who hold the ammonia certification, so his step is to pass it on.",
  { x: 11.9, y: 5.05, w: 5.9, h: 1.6, fontFace: BODY, fontSize: 19, color: INK, lineSpacingMultiple: 1.4 });
txt(s, "He ticks the same box his manager sees. The manager starts the plan, the employee sees it, and the count in the corner goes up.",
  { x: 11.9, y: 6.9, w: 5.9, h: 2.0, fontFace: BODY, fontSize: 17, color: GREY, lineSpacingMultiple: 1.4 });
footer(s, "Employee view tab", "Demo profiles. Methods are the five the challenge names.");
s.addNotes(
  "2:00 to 2:30  THE EMPLOYEE\n\n" +
  "\"The challenge says employees close skill gaps, so one screen is built for the employee, not only about them.\"\n\n" +
  "\"Sam is a refrigeration tech at Marshall, fourteen years in. He is one of two people who hold the ammonia certification, so his step is to pass it on. He ticks the same box his manager sees.\"\n\n" +
  "If demoing: tick the box, show the counter go to one, then say the next line."
);

/* ============ 6. close and questions, 30 seconds ============ */
s = pres.addSlide();
kicker(s, "How it is built, and what to ask", 1.0);
title(s, "Four files. No framework, no build step,\nnothing loaded from the internet.", 1.5, { w: 15.4, size: 38 });
txt(s, "Every outside number is sourced, and three claims were cut after checking because they only traced back to blogs. FACTS.md lists all of it.",
  { x: ML, y: 3.5, w: 14, h: 0.6, fontFace: BODY, fontSize: 18, color: GREY });
rule(s, 4.35);
[
  ["Are these real numbers?", "Coverage and headcounts are demo data. Sites, job groups and the regulations are sourced."],
  ["Where would the data come from?", "Training records, certifications, maintenance sign-offs. OSHA keeps the ammonia roster by law."],
  ["How is the order decided?", "Impact, times how few hold it, times gap size. The formula is on screen."],
  ["Did you use AI to build it?", "Yes, the rules allow it. The architecture is mine and I can explain any line."]
].forEach((q, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = ML + col * 8.7, y = 4.75 + row * 2.15;
  txt(s, q[0], { x, y, w: 7.5, h: 0.6, fontFace: DISPLAY, fontSize: 21, color: NAVY });
  txt(s, q[1], { x, y: y + 0.68, w: 7.5, h: 1.0, fontFace: BODY, fontSize: 16, color: GREY, lineSpacingMultiple: 1.3 });
  if (col === 0) s.addShape("line", { x: x + 8.0, y: y - 0.15, w: 0, h: 1.8, line: { color: LINE, width: 1 } });
  if (row < 1) rule(s, y + 1.85, { x, w: 7.5 });
});
footer(s, "github.com/Aj-Networks/schwan_s", "Q&A.html has the full sheet. FACTS.md has every source.");
s.addNotes(
  "2:30 to 3:00  CLOSE, then leave this slide up for questions\n\n" +
  "\"It is four files. Plain HTML, CSS and JavaScript. No framework, no build step, and nothing loads from the internet, so it cannot break on a bad venue network.\"\n\n" +
  "\"Every outside number is sourced. Three claims got cut during a fact check because I could only trace them to blogs.\"\n\n" +
  "\"Happy to take questions. These four are the ones I expect.\"\n\n" +
  "Leave this slide up. It is your prompt sheet: the four answers are on it.\n\n" +
  "If asked something not here: \"I do not know, and I would rather find out than guess.\""
);

pres.writeFile({ fileName: OUT }).then(() => console.log("written", OUT));
