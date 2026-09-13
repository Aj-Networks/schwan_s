# SkillSight

A simple tool that shows what skills Schwan's employees have, where skills are missing, and where a critical skill is known by too few people.

Built for **Southwest MN Hacks 2026**, Schwan's Prompt 01: *Talent Readiness and Skills Intelligence Platform*.

## The problem

Schwan's employs about 8,500 people across 16 plants and 3 corporate offices, split into 4 job groups (Manufacturing and Logistics, Retail Sales and Distribution, Foodservice Sales, Corporate). Skills data sits in different places, so no one can answer a simple question: if the person who knows how to run the ammonia system leaves, who else can do it?

## What it does

SkillSight answers the five questions in the challenge, one page each, plus a view built for the employee rather than the manager.

| Page | Answers |
|---|---|
| **Overview** | A ranked "do this first" list, plus where coverage is lowest |
| **Skills** | What skills exist across the workforce and how well each is covered |
| **Succession risk** | Which skills sit with three people or fewer, where, and how much it hurts if they leave |
| **Future skills** | What the next two years need and how far short the workforce is now |
| **Employee view** | The same data seen by the person: what they know, what only they know, and their next step |
| **Plants and offices** | Every site the data covers |

Click any row to open that skill. The skill page shows coverage, how many people hold it, why it is a risk, why it will be needed, the first step to close the gap with backup options, and **where the data would come from in a real deployment**. Checking "development plan started" is saved in the browser, so it is still there after a reload.

The **do this first** list is the part that matters. It scores every at-risk skill by how much the business is hurt if it is lost, how few people hold it, and how big the gap is, then ranks them. That turns a wall of numbers into an order of work.

## Run it

No install, no build step, no internet needed after first load.

```
open index.html in a browser
```

There is a light and dark toggle in the top right. The choice is remembered.

## Self-check

`verify.js` renders every page in a stub DOM and asserts the things that are easy to break by hand: every clickable row opens a real page, a started plan shows up in every list that contains that skill, Previous and Next are correct at every position, and the data obeys the rule the app states on screen.

```
node verify.js
```

## Files

```
index.html    page shell: top bar, tabs, content area
style.css     all styling and both themes
script.js     app logic and page rendering
data.js       the data the app reads
PROJECT.md    challenge notes and research
```

## About the data

Coverage percentages, per-site headcounts, and employee records are made up for the demo. Company headcount, plant names, office locations, job groups, and the business drivers (the Sioux Falls plant build-out, the CJ CheilJedang integration) are real and taken from public sources.

The made-up numbers are shaped by published figures rather than invented. Schwan's reports about 8,500 employees. Deloitte and The Manufacturing Institute put the manufacturing skills gap at 2.1 million unfilled jobs by 2030. The average certified ammonia refrigeration technician in the US is approaching 55, which is why the demo puts two retirement-eligible techs on the Marshall ammonia system. Every source is linked inside the app, under "Read more" on the Overview.

## Where the data would really come from

Every skill page names the systems a real deployment would read from, because the common objection is "we do not have this data". Most companies already do.

The clearest case is ammonia refrigeration. Systems holding 10,000 pounds or more are a covered process under OSHA's process safety management rule, so the list of trained operators and their three-year refresher dates is kept by law. Food safety has a similar hook: FDA's preventive controls rule requires each facility to name a qualified individual in its food safety plan.

One skill, the Salina line setup, honestly says "None. This skill has no system of record anywhere." That is the finding, not a gap in the tool.

## Built with

Plain HTML, CSS, and JavaScript. No frameworks, no build tools, no dependencies.

## Team

Ajay Angdembe, solo.

## License

MIT, see [LICENSE](LICENSE).
