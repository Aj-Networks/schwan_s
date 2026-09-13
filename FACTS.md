# Fact check

Every outside claim SkillSight makes, where it came from, and what was thrown out.

Checked in three passes: inventory every claim in the code and documents, verify each against a primary or authoritative source, then correct the app and record the result here. Sources are company pages, a state government release, federal regulators, and an industry association. Nothing rests on a personal blog or an SEO page.

Run the app's own self-check with `node verify.js`.

## Verified

| Claim used in the app | Status | Source |
|---|---|---|
| Headquartered in Marshall, MN. Subsidiary of CJ CheilJedang, describes itself as a US-based affiliate of CJ Foods | Verified | [Schwan's Company, About Us](https://www.schwanscompany.com/about-us/) |
| The four job groups are the company's own career areas: Manufacturing and Logistics, Retail Sales and Distribution, Foodservice Sales, Corporate | Verified | [Schwan's Careers](https://www.schwansjobs.com/) |
| "More than a dozen facilities across the U.S." and "the World's largest pizza plant" | Verified, company's own wording | [Schwan's Careers](https://www.schwansjobs.com/) |
| Sioux Falls, SD: 700,000 sq ft **Asian-style food** plant for bibigo, 600+ plant jobs plus 50 office jobs, opening 2027 | Verified | [Schwan's press release, May 2024](https://www.prnewswire.com/news-releases/schwans-company-and-state-of-south-dakota-announce-future-investments-in-sioux-falls-to-support-new-food-production-facility-302159947.html) |
| Salina, KS pizza plant completed a 400,000 sq ft expansion in 2023, creating 225 jobs | Verified | [Kansas Department of Commerce](https://www.kansascommerce.gov/2023/05/governor-kelly-congratulates-schwans-for-completion-of-major-pizza-plant-expansion-in-salina-creating-225-jobs/) |
| CJ's acquisition took its US production bases from 5 to 22 | Verified | [CJ CheilJedang press release](https://www.cj.co.kr/en/newsroom/pressreleases/news-detail/1283) |
| CJ Foods moved its US headquarters to La Palma, CA in 2023 | Verified | [Orange County Business Journal](https://www.ocbj.com/real-estate/cj-foods-follows-fullerton-plant-new-hq-la-palma/) |
| US manufacturing could leave 2.1 million jobs unfilled by 2030, costing $1 trillion in that year. Boomer retirement named by 34 percent of manufacturers | Verified | [Deloitte and The Manufacturing Institute](https://themanufacturinginstitute.org/2-1-million-manufacturing-jobs-could-go-unfilled-by-2030-11330/) |
| 40 percent of the 12 million skilled trades workers are over 45, nearly half of those over 55, fewer than 9 percent of workers aged 19 to 24 are entering the trades | Verified | [IIAR Condenser](https://iiarcondenser.org/the-technician-shortage/) (the industrial refrigeration association's journal, citing PeopleReady) |
| Ammonia systems of 10,000 lb or more are a covered process under OSHA 1910.119. Refresher training at least every three years, and the employer must keep a record naming the employee, the date, and how understanding was verified | Verified | [OSHA, 29 CFR 1910.119](https://www.osha.gov/laws-regs/standardinterpretations/2016-07-21) |
| A facility's written food safety plan must be prepared, or its preparation overseen, by a preventive controls qualified individual. No specific certificate is mandated | Verified | [FDA, FSMA questions and answers](https://www.fda.gov/food/food-safety-modernization-act-fsma/frequently-asked-questions-fsma) |

## Stated as assumptions, not facts

| Claim | Why it is not presented as fact |
|---|---|
| A workforce of about 8,500 people, split 5,200 / 1,500 / 550 / 1,250 | Schwan's does not publish a headcount. Third-party profiles disagree: Wikipedia and IBISWorld say about 8,500, Revelio Labs reports roughly 4,000. The demo uses the high end and says so on screen. |
| The 18-site network list | Compiled from public reporting. The company says only that it runs "more than a dozen" US facilities and does not publish a site list, so this network is close but not official. Said on the Plants page. |
| Every coverage percentage, per-site headcount, impact score and employee record | Invented for the demo. Stated on the Overview and on the Plants page. |

## Removed after checking

| Claim previously used | Why it was cut |
|---|---|
| "Sioux Falls is a new pizza plant" | Wrong. It is an Asian-style food plant for bibigo. Corrected in the app, the deck and the brief. |
| "The average certified ammonia refrigeration technician is approaching 55" | Only found on contractor blogs and vendor pages. The IIAR itself states there is no comprehensive refrigeration-specific workforce data, so the claim cannot be stood up. Replaced with the sourced skilled-trades figures above. |
| "More than 70 percent of maintenance teams are understaffed, 37 percent chronically" | Traces to a vendor survey republished through syndicated content. Not an authority worth citing to judges. Dropped. |
| "La Palma, CA is a Schwan's corporate office" | It is CJ Foods USA's headquarters, an affiliate site. Relabelled in the app. |

## Where the sources appear in the app

- **Overview**, under "Read more": the full source list with links.
- **Every skill page**, under "Where this comes from": the systems a real deployment would read that skill from, with the OSHA and FDA citations attached to the skills they govern.
- **Plants and offices**: the note that the site list is compiled rather than official.
