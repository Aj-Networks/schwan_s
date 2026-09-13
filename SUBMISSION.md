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
- Live demo: *(add the GitHub Pages link once the repo is public, or leave this out and use the video)*
- Video: *(add link)*

---

## What it does

Schwan's employs about 8,500 people across 16 plants and 3 corporate offices, split into 4 job groups. Skills data sits in different places, so a simple question has no answer: if the person who knows the ammonia system leaves, who else can do it?

SkillSight puts it in one place and answers the five questions in the challenge, one page each.

- **Overview**: a ranked "do this first" list, plus where coverage is lowest.
- **Skills**: every skill in the workforce and how well each is covered.
- **Succession risk**: which skills sit with three people or fewer, where they are, and how much it hurts if those people leave.
- **Future skills**: what the next two years need and how far short the workforce is now.
- **Employee view**: the same data seen by the person. What they know, which skills only they know, and the step to pass that knowledge on.
- **Plants and offices**: every site the data covers.

Click any row to open that skill. The skill page shows coverage, how many people hold it, why it is a risk, why it will be needed, and the first step to close the gap with two backup options. Marking a development plan as started is saved in the browser and is still there after a reload.

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

Coverage percentages, per-site headcounts, and employee records are made up. Company headcount (about 8,500), plant and office locations, job groups, and business drivers are real and from public sources. The demo numbers are shaped by published industry figures (Deloitte and The Manufacturing Institute on the 2.1 million job gap by 2030, the ammonia technician workforce approaching an average age of 55), all linked inside the app.

---

## Demo script (about 3 minutes)

1. **Overview, 40 seconds.** "Schwan's has 8,500 people across 16 plants and 3 offices. Six skills are held by three people or fewer. This list is the order I would fix them in, ranked by how much it hurts, how few people hold it, and how big the gap is."
2. **Click row 1, 60 seconds.** "One person knows frozen dough formulation, at the Marshall R&D center. Here is why that matters, here is what it needs to look like by 2027, and here is the first step: pair the expert with two mentees. Check the box, the plan is tracked."
3. **Skills tab, 30 seconds.** "Every skill, lowest coverage first, so nothing hides."
4. **Future skills, 30 seconds.** "Sioux Falls opens and needs automation techs. We are at 34 percent and need 65."
5. **Employee view, 40 seconds.** "Same data, seen by Sam, the refrigeration tech at Marshall. He is one of two people who hold the ammonia certification, and his step is to pass it on. The checkbox is the same one the manager sees."
6. **Close, 20 seconds.** "No frameworks, no build, no internet needed. Four files, and every number is sourced."
