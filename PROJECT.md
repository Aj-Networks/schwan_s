# Schwan's Challenge - Southwest MN Hacks 2026

## Event

- **Event:** Southwest MN Hacks
- **Dates:** Saturday September 12 - Sunday September 13, 2026
- **Ref:** https://www.southwestmnhacks.org/#event-hub

### Schedule

**Saturday, Sept 12**
| Time | Item |
|---|---|
| 8:00 AM | Check-in and breakfast |
| 9:00 AM | Opening ceremony |
| 10:00 AM | Challenge reveal and hacking begins |
| 12:00 PM | Lunch |
| 6:00 PM | Dinner |
| Overnight | Hacking continues, mentor support and designated rest areas |

**Sunday, Sept 13**
| Time | Item |
|---|---|
| 8:00 AM | Devpost submissions due |
| 8:30 AM | Project demos and judging |
| 9:30 AM | Awards ceremony |
| 10:00 AM | Event ends |

## Challenge Selection

**Prompt 01 - Talent Readiness & Skills Intelligence Platform** (selected)

> Organizations are facing rapid changes in technology, automation, AI, and workforce expectations. Yet many leaders lack visibility into the skills that exist within their workforce, the capabilities they will need in the future, and the risks created by knowledge concentration, skill shortages, and succession gaps.
>
> Build a solution that helps organizations understand current workforce capabilities, identify critical skill and knowledge gaps, assess future talent needs, and accelerate workforce readiness through targeted development recommendations.

The platform should help answer:
- What skills and competencies exist across our workforce today?
- What skills will be needed to support future business and technology strategies?
- Which critical skills are concentrated in only a few individuals?
- Where are our greatest capability gaps and succession risks?
- How can employees close skill gaps through training, mentoring, certifications, job rotations, or project experiences?

Solution space: skills inventories, talent heat maps, AI-powered career development advisors, workforce readiness dashboards, personalized learning plans, knowledge transfer tools, predictive analytics.

### Other prompts (not selected)

- **02 - AI Use Case Generator:** tool interviews business users, understands processes/challenges, recommends AI use cases with estimated benefits, risks, implementation complexity.
- **03 - Childcare Availability Finder:** aggregates childcare availability, age openings, waitlist info, provider details into a searchable experience.
- **Bonus - RFID + QR + LED Interactive System:** scanning/identifying something triggers a meaningful physical response (LEDs communicate info or react). Open-ended, judged for Creative Award.

## Schwan's Research (for Prompt 01 pitch)

Source: https://www.schwanscompany.com/

**Scale/footprint** - Based in Minnesota; thousands of employees across dozens of locations. Three corporate offices (Marshall MN, Hopkins MN, La Palma CA). ~16 production sites:
- Pizza, Asian-style foods & appetizers: Salina KS, Florence KY, Pasadena/Deer Park TX, Columbus OH, Sidney OH, City of Industry CA, Sioux Falls SD, Erie PA, North East PA, Westfield NY, Brooklyn NY, Fullerton CA, Beaumont CA
- Frozen desserts / ice cream: Marshall MN, Stilwell OK
- Packaging: Pottstown PA

*Pitch angle:* skills data is scattered across 16 plants and 3 offices with no single view.

**Active growth** - Hiring across the U.S.; building a new production facility in Sioux Falls, SD. New plant = hundreds of roles to staff/train against capabilities that already exist elsewhere in the network.

*Pitch angle:* the tool answers "who can we redeploy or train, and who trains them."

**Four workforce segments (taxonomy problem)** - Manufacturing and Logistics; Retail Sales and Distribution; Foodservice Sales; Corporate (marketing, R&D, operations, finance, information services, HR, legal, communications).

*Pitch angle:* no single skills framework fits both a line operator and a food scientist - platform needs role-family-aware skill taxonomies.

**Knowledge concentration risk** - Manufacturing runs advanced tech across a dozen+ facilities, including what the company calls the world's largest pizza plant. Marshall also hosts the company's R&D center.

*Pitch angle:* single-site R&D and one-of-a-kind plant equipment is exactly where "critical skills concentrated in only a few individuals" shows up.

**Cross-border/cross-culture complexity** - CJ Schwan's is a U.S.-based affiliate of CJ Foods, a subsidiary of CJ CheilJedang; gained the La Palma, CA office in 2023 via integration with CJ Foods USA.

*Pitch angle:* post-integration workforces have duplicate roles, mismatched titles, untracked overlapping capability.

**Stated values (use their language back at them)** - Talent (exceptional talent, strong and adaptive culture), Onlyone (first, best, different), Shared Growth.

**Anchor/brand detail for demo** - From a Minnesota dairy in the 1950s to a leading U.S. food manufacturer, serving retail stores, K-12 schools, restaurants, healthcare facilities, convenience stores, college/university dining. Brands: Red Baron, bibigo, Freschetta, Tony's, Mrs. Smith's, Edwards, Pagoda, Minh, Big Daddy's, Villa Prima, Twin Marquis, Chef One, Sabatasso's, Beacon Street, Stilwell.

> HINT: seed demo data with the real plant list and the four career areas - judges from Schwan's will recognize their own org chart, which lands harder than generic "Acme Corp" sample data.

## Submission Requirements

Per Devpost / event rules, the submission must include:
- Project name and description
- Challenge selection
- Project link (GitHub, live demo, or video walkthrough)
- Screenshots or demo video
- Team members

## Deliverables Tracker

| Item | Status | File |
|---|---|---|
| Master reference doc | Done | `PROJECT.md` (this file) |
| Solution name and description | Done | SkillSight. Shows what skills Schwan's employees have, where skills are missing, and where a critical skill is known by too few people. |
| Working app | Done | `index.html`, `style.css`, `script.js`, `data.js` |
| Team members | Done | Ajay Angdembe, solo |
| GitHub repo | Done | https://github.com/Aj-Networks/schwan_s |
| Devpost copy | Done | `SUBMISSION.md` |
| Screenshots | Done | `screenshots/` |
| Live demo link | Pending | GitHub Pages, needs the repo to be public |
| Project brief (.docx) | Done | `exports/Schwans_Project_Brief.docx` |
| Pitch deck (.pptx) | Done, 9 slides | `exports/Schwans_Pitch_Deck.pptx` |

## Build Notes

- Layout: top bar, tabs, centered content. No side column.
- Five pages, one per challenge question, plus a skill detail page reached by clicking any row.
- Light and dark themes, saved per browser.
- "Development plan started" checkboxes persist in localStorage, so the demo carries real state.
- No frameworks and no CDN scripts, so the app runs with no internet once the page is open.
- Demo numbers, real locations. The app says so on screen.

## Open Items

1. Make the repo public and turn on GitHub Pages for a live demo link, or submit with the repo link and a video.
2. Bonus RFID/QR/LED track: only if the organizers have loaner hardware.
