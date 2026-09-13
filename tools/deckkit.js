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
function newDeck(title) {
  const pres = new pptxgen();
  pres.defineLayout({ name: "PORTFOLIO", width: W, height: H });
  pres.layout = "PORTFOLIO";
  pres.author = "Ajay Angdembe";
  pres.title = title;
  return pres;
}

let pres = null;
const useDeck = p => { pres = p; };

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


module.exports = { pptxgen, newDeck, useDeck, get pres() { return pres; },
  NAVY, NAVY_2, INK, MIST, LINE, PAPER, GREY, PALE, STEEL, EDGE, SOFT2, TINT,
  DISPLAY, DISPLAY_L, BODY, W, H, ML, COL,
  txt, rule, block, footer, question, answer, bar };
