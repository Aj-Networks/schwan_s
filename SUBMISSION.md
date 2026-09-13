# Devpost submission copy

Paste-ready. Submit by 8:00 AM Sunday, September 13.

---

## Project name

SkillSight

## Tagline (one line)

Shows what skills Schwan's employees have, where skills are missing, and where a critical skill is known by too few people.

## Challenge

Prompt 01: Talent Readiness and Skills Intelligence Platform

## Team

Ajay Angdembe (solo)

## Links

- Repo: https://github.com/Aj-Networks/schwan_s
- Deck: `exports/SkillSight.pptx` (six slides for a three minute slot, speaker script and timings in the notes)
- Stage script: `exports/SkillSight_Script.html` (slide images, what to say, rehearsal timer)
- Written brief: `exports/Schwans_Project_Brief.docx` (APA 7, 3,500 words, 10 references, four appendices)
- Live demo: *(add the GitHub Pages link once the repo is public, or leave this out and use the video)*
- Video: *(add link)*

---

## What it does

Schwan's runs more than a dozen US facilities across 4 job groups. Skills data sits in different places, so a simple question has no answer: if the person who knows the ammonia system leaves, who else can do it?

SkillSight puts it in one place and answers the five questions in the challenge, one page each.

- **Overview**: a ranked "do this first" list, plus where coverage is lowest.
- **Skills**: every skill in the workforce and how well each is covered.
- **Succession risk**: which skills sit with three people or fewer, where they are, and how much it hurts if those people leave.
- **Future skills**: what the next two years need and how far short the workforce is now.
- **Employee view**: the same data seen by the person. What they know, which skills only they know, and the step to pass that knowledge on.
- **Plants and offices**: every site the data covers.

Click any row to open that skill. The skill page shows coverage, how many people hold it, why it is a risk, why it will be needed, and the first step to close the gap with two backup options. Marking a development plan as started is saved in the browser and is still there after a reload.

## Answering "we do not have this data"

Every skill page names the systems a real deployment would read from. Ammonia refrigeration is the strongest case: systems over 10,000 pounds are an OSHA covered process, so refresher training every three years and a record naming each trained employee already exist by law. Food safety has the FDA preventive-controls qualified individual. Maintenance skills come from work order sign-offs, which record who actually did the work rather than who took the course.

One skill says "None. This skill has no system of record anywhere." That is the Salina line setup, and it is the finding rather than a gap in the tool.

## The part that matters

Most dashboards show numbers and stop. SkillSight ranks them. The "do this first" list scores every at-risk skill by three things: how much the business is hurt if the skill is lost, how few people hold it, and how big the gap is. That turns a wall of numbers into an order of work a manager can act on Monday.

## How I built it

Plain HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies, no CDN scripts. The whole app is four files and runs by opening `index.html`. Light and dark themes, and the choice is remembered.

Keeping it dependency free was deliberate. It loads with no internet, it cannot break because a CDN is down during judging, and every line is mine to explain.

## Challenges

The hard part was not the code, it was the shape. I built and threw away three different layouts. Charts everywhere looked impressive and told the viewer nothing. What finally worked was one question per page, tables instead of graphics, and one ranked answer to "what do we fix first".

## What I learned

Dashboards fail when they show everything at once. Ranking is more useful than visualizing.

## What is next

- Real HR data instead of seeded numbers.
- Matching people to plans automatically, instead of one written step per skill.
- Bonus track: an RFID badge tap at a plant that pulls up that person's skills and what they are training toward.

## About the data

Coverage percentages, per-site headcounts, and employee records are made up. The job groups, plant and office locations, the Sioux Falls build-out, the Salina expansion and the CJ ownership are real and sourced. The workforce size of about 8,500 is a stated assumption, because the company does not publish a headcount. Every claim, its source, and the three claims cut after checking are in FACTS.md. Sources are linked inside the app.

---

## Demo script (about 3 minutes)

1. **Overview, 40 seconds.** "Schwan's runs more than a dozen US plants. In this demo, six skills are held by three people or fewer. This list is the order I would fix them in, ranked by how much it hurts, how few people hold it, and how big the gap is."
2. **Click row 1, 60 seconds.** "One person knows frozen dough formulation, at the Marshall R&D center. Here is why that matters, here is what it needs to look like by 2027, and here is the first step: pair the expert with two mentees. Check the box, the plan is tracked."
3. **Skills tab, 30 seconds.** "Every skill, lowest coverage first, so nothing hides."
4. **Future skills, 30 seconds.** "Sioux Falls opens in 2027, 700,000 square feet of Asian-style food production, and it needs automation techs. We are at 34 percent and need 65."
5. **Counter, 15 seconds.** "Every plan I tick shows in the corner. Click it and you get the list, with who owns each one and an undo. Twelve clicks in, you still know what you committed to."
6. **Employee view, 40 seconds.** "Same data, seen by Sam, the refrigeration tech at Marshall. He is one of two people who hold the ammonia certification, and his step is to pass it on. The checkbox is the same one the manager sees."
7. **Close, 20 seconds.** "No frameworks, no build, no internet needed. Four files, and every number is sourced."
