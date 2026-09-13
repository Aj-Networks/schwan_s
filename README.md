# SkillSight

A simple tool that shows what skills Schwan's employees have, where skills are missing, and where a critical skill is known by too few people.

Built for **Southwest MN Hacks 2026**, Schwan's Prompt 01: *Talent Readiness and Skills Intelligence Platform*.

## The problem

Schwan's runs 16 plants and 3 corporate offices, split into 4 job groups (Manufacturing and Logistics, Retail Sales and Distribution, Foodservice Sales, Corporate). Skills data sits in different places, so no one can answer a simple question: if the person who knows how to run the ammonia system leaves, who else can do it?

## What it does

SkillSight answers the five questions in the challenge, one page each.

| Page | Answers |
|---|---|
| **Overview** | A ranked "do this first" list, plus where coverage is lowest |
| **Skills** | What skills exist across the workforce and how well each is covered |
| **Succession risk** | Which skills sit with three people or fewer, where, and how much it hurts if they leave |
| **Future skills** | What the next two years need and how far short the workforce is now |
| **Plants and offices** | Every site the data covers |

Click any row to open that skill. The skill page shows coverage, how many people hold it, why it is a risk, why it will be needed, and the first step to close the gap, plus backup options. Checking "development plan started" is saved in the browser, so it is still there after a reload.

The **do this first** list is the part that matters. It scores every at-risk skill by how much the business is hurt if it is lost, how few people hold it, and how big the gap is, then ranks them. That turns a wall of numbers into an order of work.

## Run it

No install, no build step, no internet needed after first load.

```
open index.html in a browser
```

There is a light and dark toggle in the top right. The choice is remembered.

## Files

```
index.html    page shell: top bar, tabs, content area
style.css     all styling and both themes
script.js     app logic and page rendering
data.js       the data the app reads
PROJECT.md    challenge notes and research
```

## About the data

Coverage numbers, headcounts, and employee names are made up for the demo. Plant names, office locations, job groups, and the business drivers (the Sioux Falls plant build-out, the CJ CheilJedang integration) are real and taken from public sources. The app says this on screen so nobody mistakes the demo for a real report.

## Built with

Plain HTML, CSS, and JavaScript. No frameworks, no build tools, no dependencies.

## Team

Ajay Angdembe, solo.

## License

MIT, see [LICENSE](LICENSE).
