import io, base64

SLIDES = [
  dict(n=1, title="Cover", start=0, end=15, kicker="Opener",
       say=["SkillSight. It shows what skills Schwan's people have, where those skills are missing, and where one person leaving stops the work."],
       stage="Do not read the numbers out loud. Let them sit on the slide. Move on at fifteen seconds.",
       cue="Stand still. This is the only line you must land word for word."),
  dict(n=2, title="The problem", start=15, end=40, kicker="Set it up",
       say=["Schwan's runs more than a dozen US plants across four job groups, and a new plant opens in 2027.",
            "But ask a simple question. If the person who knows the ammonia refrigeration system leaves, who else can do it? Today that answer takes phone calls to three plants."],
       stage="Point at the zero. That is the whole problem in one number.",
       cue="Let the quote hang for a beat before the next line."),
  dict(n=3, title="The finding", start=40, end=75, kicker="Slow down here",
       say=["Six skills in this demo are held by three people or fewer. One is held by a single person: frozen dough formulation, at the Marshall R&D centre.",
            "Two of these are ammonia refrigeration techs who are close to retirement. That one is not guesswork. Ammonia systems over ten thousand pounds are an OSHA covered process, so the list of trained operators is kept by law. The data already exists."],
       stage="This is the slide people remember. Slow your pace by half.",
       cue="If a Schwan's person is judging, watch for a nod on the OSHA line."),
  dict(n=4, title="The answer", start=75, end=120, kicker="The core of the pitch",
       say=["Most dashboards show numbers and stop. This one scores every at-risk skill on three things: how much it hurts, how few people hold it, and how big the gap is. Then it sorts them.",
            "So a manager does not get a puzzle. They get an order of work. Fix frozen dough first, and here is the first step: pair the expert with two mentees.",
            "Each step is one of the five methods the challenge names. Training, mentoring, certification, job rotation, project experience."],
       stage="If you are demoing live, switch to the app here and tick one plan box.",
       cue="This is the differentiator. If you are running long, cut slide 5, never this one."),
  dict(n=5, title="The employee", start=120, end=150, kicker="The human beat",
       say=["The challenge says employees close skill gaps, so one screen is built for the employee, not only about them.",
            "Sam is a refrigeration tech at Marshall, fourteen years in. He is one of two people who hold the ammonia certification, so his step is to pass it on. He ticks the same box his manager sees."],
       stage="If demoing: tick the box, show the counter go to one, then say the last line.",
       cue="Say his name, not the employee. That is the point of the slide."),
  dict(n=6, title="Close and questions", start=150, end=180, kicker="Land it, then stop talking",
       say=["It is four files. Plain HTML, CSS and JavaScript. No framework, no build step, and nothing loads from the internet, so it cannot break on a bad venue network.",
            "Every outside number is sourced. Three claims got cut during a fact check because I could only trace them to blogs.",
            "Happy to take questions. These four are the ones I expect."],
       stage="Leave this slide up. It is your prompt sheet, the four answers are printed on it.",
       cue="If asked something not on the slide: I do not know, and I would rather find out than guess."),
]

def clock(t):
    return "%d:%02d" % (t // 60, t % 60)

imgs = []
for i in range(1, 7):
    imgs.append(base64.b64encode(io.open("final/Slide%d.PNG" % i, "rb").read()).decode())

blocks = []
for i, s in enumerate(SLIDES):
    say = "".join('<p class="say">%s</p>' % line for line in s["say"])
    blocks.append(
        '\n<section class="slide" id="s{n}" data-start="{start}" data-end="{end}">\n'
        '  <div class="meta">\n'
        '    <div class="num">{n:02d}</div>\n'
        '    <div class="clock">{c1} <span>to</span> {c2}</div>\n'
        '    <div class="dur">{dur} sec</div>\n'
        '  </div>\n'
        '  <div class="body">\n'
        '    <div class="head"><h2>{title}</h2><span class="kicker">{kicker}</span></div>\n'
        '    <img src="data:image/png;base64,{img}" alt="Slide {n}">\n'
        '    <div class="script">{say}</div>\n'
        '    <p class="stage"><b>Do</b> {stage}</p>\n'
        '    <p class="cue"><b>Note</b> {cue}</p>\n'
        '  </div>\n'
        '</section>'.format(n=s["n"], start=s["start"], end=s["end"], c1=clock(s["start"]),
                            c2=clock(s["end"]), dur=s["end"] - s["start"], title=s["title"],
                            kicker=s["kicker"], say=say, stage=s["stage"], cue=s["cue"], img=imgs[i]))

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SkillSight - what to say, slide by slide</title>
<style>
:root {
  --navy: #232E54; --navy2: #324070; --ink: #18212F; --grey: #6E7788;
  --mist: #EEF2F5; --line: #D9D9D9; --paper: #ffffff;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--paper); color: var(--ink);
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height: 1.6; }

header { position: sticky; top: 0; z-index: 20; background: var(--navy); color: #fff; padding: 14px 28px; }
.bar { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
header h1 { font-size: 19px; margin: 0; font-weight: 600; letter-spacing: -0.01em; }
header .sub { font-size: 13px; color: #B9C2D4; }
.timer { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.time { font-variant-numeric: tabular-nums; font-size: 26px; font-weight: 600; letter-spacing: -0.02em; min-width: 92px; }
.time.over { color: #ff9c8a; }
button { font: inherit; font-size: 13px; font-weight: 600; padding: 7px 14px; border-radius: 6px;
  border: 1px solid #44528A; background: #324070; color: #fff; cursor: pointer; }
button:hover { background: #3d4d85; }

.wrap { max-width: 1180px; margin: 0 auto; padding: 30px 28px 90px; }
.intro { border-bottom: 1px solid var(--line); padding-bottom: 22px; margin-bottom: 10px; }
.intro p { margin: 0 0 8px; color: var(--grey); font-size: 15px; max-width: 74ch; }

.slide { display: grid; grid-template-columns: 120px 1fr; gap: 26px; padding: 34px 0; border-bottom: 1px solid var(--line); }
.slide.now { background: #f7fafe; box-shadow: -14px 0 0 #2f6fb5; }
.meta .num { font-size: 42px; font-weight: 700; color: var(--line); line-height: 1; letter-spacing: -0.03em; }
.meta .clock { font-size: 15px; font-weight: 600; color: var(--navy); margin-top: 6px; font-variant-numeric: tabular-nums; }
.meta .clock span { color: var(--grey); font-weight: 400; }
.meta .dur { font-size: 13px; color: var(--grey); }

.head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 12px; }
.head h2 { font-size: 21px; margin: 0; font-weight: 600; }
.kicker { font-size: 11.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  color: var(--navy2); background: var(--mist); padding: 4px 9px; border-radius: 20px; }

.slide img { display: block; width: 100%; max-width: 620px; border: 1px solid var(--line); border-radius: 6px; margin-bottom: 18px; }

.say { font-size: 20px; line-height: 1.55; color: var(--ink); margin: 0 0 14px; max-width: 62ch;
  padding-left: 16px; border-left: 3px solid var(--navy); }
.stage, .cue { font-size: 14.5px; color: var(--grey); margin: 0 0 6px; max-width: 70ch; }
.stage b, .cue b { display: inline-block; min-width: 42px; font-size: 11px; letter-spacing: .07em;
  text-transform: uppercase; color: var(--navy2); }

.end { margin-top: 34px; padding: 20px 22px; background: var(--mist); border-radius: 8px; }
.end h3 { margin: 0 0 8px; font-size: 16px; }
.end p { margin: 0 0 6px; font-size: 14.5px; color: var(--grey); }

@media (max-width: 720px) {
  .slide { grid-template-columns: 1fr; gap: 10px; }
  .meta { display: flex; align-items: baseline; gap: 12px; }
  .say { font-size: 18px; }
}
@media print {
  header { position: static; } .timer { display: none; }
  .slide { page-break-inside: avoid; border-bottom: 1px solid #ccc; }
  .slide img { max-width: 420px; }
}
</style>
</head>
<body>

<header><div class="bar">
  <div>
    <h1>SkillSight, what to say</h1>
    <div class="sub">Six slides, three minutes. Demos and judging 8:30 AM, Sunday.</div>
  </div>
  <div class="timer">
    <div class="time" id="time">0:00</div>
    <button id="go">Start</button>
    <button id="reset">Reset</button>
  </div>
</div></header>

<div class="wrap">
  <div class="intro">
    <p>Start the timer and rehearse against it. The slide you should be on is highlighted as the clock runs.</p>
    <p>The quoted lines are what to say. They are the same words sitting in the PowerPoint speaker notes, so either screen works.</p>
  </div>
"""

TAIL = """
  <div class="end">
    <h3>If you run out of time</h3>
    <p>Cut slide 5, the employee view. Never cut slide 4, the ranked order, because that is the only thing on stage nobody else will have.</p>
    <p>If the laptop dies, the deck alone carries the story. If the app misbehaves, press Ctrl and F5, the saved state comes back.</p>
    <p>Anything you cannot answer: "I do not know, and I would rather find out than guess." Then move on.</p>
  </div>
</div>

<script>
const slides = [...document.querySelectorAll(".slide")];
const out = document.getElementById("time");
const go = document.getElementById("go");
let t = 0, running = false, tick = null;

function paint() {
  const m = Math.floor(t / 60), s = t % 60;
  out.textContent = m + ":" + String(s).padStart(2, "0");
  out.classList.toggle("over", t > 180);
  slides.forEach(el => {
    const on = running && t >= +el.dataset.start && t < +el.dataset.end;
    el.classList.toggle("now", on);
  });
}

go.addEventListener("click", () => {
  running = !running;
  go.textContent = running ? "Pause" : "Start";
  if (running) { tick = setInterval(() => { t++; paint(); }, 1000); }
  else { clearInterval(tick); }
  paint();
});

document.getElementById("reset").addEventListener("click", () => {
  clearInterval(tick); running = false; t = 0; go.textContent = "Start"; paint();
});

paint();
</script>
</body>
</html>
"""

html = HEAD + "".join(blocks) + TAIL
out = "C:/Users/root/OneDrive/AI/github/schwans/exports/SkillSight_Script.html"
io.open(out, "w", encoding="utf-8", newline="\n").write(html)
print("written", out, len(html), "bytes")
