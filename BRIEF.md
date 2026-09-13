# SkillSight: A Lightweight Skills Intelligence Tool for Identifying Knowledge Concentration Risk in Food Manufacturing

**Ajay Angdembe** · Independent entrant, solo
Southwest MN Hacks 2026, Marshall, Minnesota
Challenge Prompt 01: Talent Readiness and Skills Intelligence Platform
September 13, 2026

*This is the plain-text rendering of the project brief, so it can be read in the browser.
The formatted APA version, with page numbers and the full contents field, is
[SkillSight-Brief.pdf](exports/SkillSight-Brief.pdf).*

---

## Author Note

Ajay Angdembe is an independent solo entrant at Southwest MN Hacks 2026, held at Southwest Minnesota State University. The author is not affiliated with the university. The software described in this paper is available at https://github.com/Aj-Networks/schwan_s.

This work has no funding source and no affiliation with Schwan's Company. All coverage percentages, per-site headcounts, and employee records described here are simulated for demonstration. Organizational facts, business drivers, and regulatory requirements are drawn from public sources and are cited throughout.

Generative artificial intelligence tools were used during development, which the event rules permit on the condition that the entrant can explain the resulting code. All design decisions, the prioritization model, and the verification procedure described in the Method section are the author's own.

Correspondence concerning this paper should be addressed to Ajay Angdembe via the repository listed above.

## Abstract

Organizations in food manufacturing face a measurable shortage of skilled technical labour, an ageing trades workforce, and the operational risk created when critical knowledge is concentrated in very few employees. Existing enterprise systems record skills data but rarely rank it, leaving leaders with dashboards rather than decisions. This paper describes SkillSight, a lightweight web application built during a 24-hour hackathon to answer the five questions posed in Schwan's Prompt 01. The tool inventories skills by job group, identifies coverage gaps, flags skills held by three people or fewer, projects future demand against business drivers, and attaches a first development step to each gap using the five methods named in the prompt. Its distinguishing feature is a prioritization score that multiplies business impact, holder scarcity, and gap size to produce a single ranked order of work. The application is implemented in four files of dependency-free HTML, CSS, and JavaScript, and is accompanied by a verification script that asserts 42 skill-and-list combinations across every rendered page. Demonstration data is simulated and labelled as such in the interface; organizational context is sourced and audited. The paper reports the design, the scoring model, the verification approach, and the limitations that separate a hackathon demonstration from a deployable system.

*Keywords:* skills inventory, succession risk, knowledge concentration, workforce readiness, food manufacturing, process safety management

## Contents

- [Introduction](#introduction)
- [Background](#background)
  - [The Skills Gap in United States Manufacturing](#the-skills-gap-in-united-states-manufacturing)
  - [Knowledge Concentration and an Ageing Trades Workforce](#knowledge-concentration-and-an-ageing-trades-workforce)
  - [Where Skills Data Already Exists](#where-skills-data-already-exists)
  - [Organizational Context](#organizational-context)
- [Method](#method)
  - [Design Approach](#design-approach)
  - [Data Model](#data-model)
  - [Prioritization Score](#prioritization-score)
  - [Verification](#verification)
  - [Fact Verification Procedure](#fact-verification-procedure)
- [Results](#results)
- [Discussion](#discussion)
  - [Interpretation](#interpretation)
  - [Limitations](#limitations)
  - [Ethical Considerations](#ethical-considerations)
  - [Future Work](#future-work)
- [Conclusion](#conclusion)
- [References](#references)
- [Appendix A](#appendix-a)
  - [Data Dictionary](#data-dictionary)
- [Appendix B](#appendix-b)
  - [Worked Example of the Prioritization Score](#worked-example-of-the-prioritization-score)
- [Appendix C](#appendix-c)
  - [Fact Verification Audit](#fact-verification-audit)
- [Appendix D](#appendix-d)
  - [Verification Script Coverage](#verification-script-coverage)

## Introduction

Leaders of large manufacturing organizations are routinely asked to plan for capability they cannot see. Skills information is dispersed across human resources systems, plant training files, certification registries, and the working memory of long-tenured employees. The consequence is not merely administrative. When a critical skill is held by one or two people at a single site, the organization carries an operational risk that no one has quantified and no one owns.

Schwan's Prompt 01 at Southwest MN Hacks 2026 framed this problem directly, asking entrants to build a solution that helps an organization understand current workforce capability, identify critical gaps, assess future talent needs, and accelerate readiness through targeted development recommendations. The prompt specified five questions the platform should answer, concerning skills that exist today, skills that will be needed, skills concentrated in a few individuals, the greatest capability gaps and succession risks, and the ways employees can close those gaps.

This paper describes SkillSight, the application built in response, and argues a narrow thesis: in a domain where enterprise systems already collect skills data, the scarce capability is not visualization but prioritization. The contribution of the tool is therefore a defensible ranking, expressed in a formula that is displayed to the user rather than hidden, together with an honest account of which numbers are real and which are simulated.

## Background

### The Skills Gap in United States Manufacturing

Analysis published by Deloitte and The Manufacturing Institute estimates that 2.1 million manufacturing jobs in the United States could go unfilled by 2030, at a cost of approximately $1 trillion in that year alone, with 34% of surveyed manufacturers identifying the retirement of baby boomers as a leading cause (Deloitte & The Manufacturing Institute, n.d.). The figure is frequently cited in workforce planning literature and establishes the macro condition in which any skills intelligence tool operates.

### Knowledge Concentration and an Ageing Trades Workforce

The distribution of that shortage is uneven. The International Institute of Ammonia Refrigeration (IIAR), reporting analysis of the skilled trades workforce, notes that 40% of the 12 million people in the skilled trades are over the age of 45, that nearly half of those workers are over 55, and that fewer than 9% of workers aged 19 to 24 are entering the trades (IIAR, n.d.). The same publication observes candidly that no comprehensive refrigeration-sector workforce dataset exists, a caution this paper adopts when describing its own demonstration figures.

The practical form of this condition is knowledge concentration: a plant may run continuously on a system that two certified technicians understand, both of whom are within a few years of retirement. That is a succession risk expressed in production terms rather than in human resources terms, and it is the risk SkillSight is designed to surface.

### Where Skills Data Already Exists

A common objection to any skills intelligence proposal is that the underlying data does not exist. In regulated manufacturing this objection is weaker than it appears. Ammonia refrigeration systems containing 10,000 pounds or more are a covered process under the Occupational Safety and Health Administration's process safety management standard, which requires refresher training for operators at least every three years and requires the employer to prepare a record identifying each trained employee, the date of training, and the means used to verify the employee understood it (OSHA, 2016). The roster of qualified operators therefore exists as a legal obligation.

Food safety provides a second instance. Under the United States Food and Drug Administration's preventive controls framework, a facility's written food safety plan must be prepared, or its preparation overseen, by a preventive controls qualified individual, although the agency mandates no specific certificate and permits qualification through job experience (FDA, n.d.). In both cases, a deployment of SkillSight would read an existing record rather than request a new one.

### Organizational Context

Schwan's Company is headquartered in Marshall, Minnesota, and operates as a subsidiary of CJ CheilJedang, describing itself as a United States affiliate of CJ Foods (Schwan's Company, n.d.-a). Its careers materials describe more than a dozen United States facilities and four career areas, which this study adopts unchanged as its job groups: Manufacturing and Logistics, Retail Sales and Distribution, Foodservice Sales, and Corporate (Schwan's Company, n.d.-b).

Two current business drivers shape the demonstration scenario. The company is constructing a 700,000 square foot Asian-style food production facility in Sioux Falls, South Dakota, expected to create more than 600 plant positions and 50 office positions and to open in 2027 (Schwan's Company, 2024). Separately, its Salina, Kansas pizza plant completed a 400,000 square foot expansion in 2023 that created 225 jobs (Kansas Department of Commerce, 2023). The acquisition by CJ CheilJedang expanded that group's United States production base from five sites to 22 (CJ CheilJedang, 2019), and CJ Foods relocated its United States headquarters to La Palma, California, in 2023 (Orange County Business Journal, 2023). Each of these facts appears in the tool as the stated reason a future skill target exists.

## Method

### Design Approach

Three interface designs were built and discarded before the final structure was adopted. The first presented a risk matrix and multiple charts; the second used a master-detail layout with a data list in a left-hand column; the third grouped every skill into a single long table. Each was rejected for the same reason: the viewer could see the data but could not determine what to do about it.

The final design allocates one page to each question in the prompt, in the order the prompt asks them, and adds a sixth page presenting the same data from the employee's perspective. Navigation, data provenance, and demonstration disclaimers are stated on screen rather than in documentation.

### Data Model

The demonstration dataset contains 20 skills distributed across the four job groups, each with a coverage percentage representing the share of that job group holding the skill; six succession risk records carrying a site, a headcount, an impact rating from 1 to 5, and an explanatory note; five future skill targets tied to business drivers; ten recommended first steps and sixteen alternative development actions; three sample employee profiles; and a provenance record for each skill naming the systems a real deployment would read. Appendix A gives the full data dictionary.

### Prioritization Score

The scoring model is deliberately simple, on the basis that a model a manager cannot explain is a model a manager will not trust. Each at-risk skill receives a score as the product of three normalized terms: business impact divided by five; scarcity, expressed as three divided by the number of holders, so that a single holder scores 3.0 and three holders score 1.0; and a gap term of 0.4 plus the proportion of the job group that does not hold the skill. The formula is displayed in the interface. Appendix B works the calculation for the highest ranked item.

### Verification

Because the application manages state across six pages and five lists, manual testing proved unreliable; a defect in which plans saved from one list were invisible in another survived several rounds of clicking. A verification script was therefore written that renders every page in a stub document object model and asserts four properties: that every clickable row opens a page that renders without undefined values; that every skill page contains either a development plan or an explicit statement of why none exists; that a plan started from any list becomes visible in every other list containing that skill, across 42 combinations; and that the underlying data obeys the rule the interface states on screen. Appendix D reports the coverage of that script.

### Fact Verification Procedure

All external claims were audited in three passes: inventory of every factual assertion in the code and documents, verification of each against a primary or authoritative source, and correction of the application. Three claims were removed because they could be traced only to vendor blogs or syndicated content, and one factual error was corrected, namely the characterization of the Sioux Falls facility as a pizza plant rather than an Asian-style food plant. Appendix C reproduces the audit.

## Results

The demonstration dataset produces an average coverage of 50% across the 20 tracked skills. Table 1 reports the distribution by coverage band. Seven skills fall below the 40% threshold the interface treats as a critical gap.

**Table 1**

*Distribution of Tracked Skills by Coverage Band*

| Coverage band | Skills | Range | Lowest in band |
|---|---|---|---|
| Critical gap | 7 | Below 40% | Salina line setup, 12% |
| Needs attention | 6 | 40% to 59% | Data analytics, 41% |
| Well covered | 7 | 60% and above | Customer relationship management, 58% |

*Note.* Coverage represents the simulated share of a job group holding the skill. Band thresholds are set by the application.

Table 2 reports the six skills identified as succession risks, each held by three people or fewer. One is held by a single individual.

**Table 2**

*Skills Held by Three People or Fewer*

| Skill | Holders | Impact | Location |
|---|---|---|---|
| R&D, frozen dough formulation | 1 | 4 of 5 | Marshall, MN, R&D centre |
| Ammonia refrigeration | 2 | 5 of 5 | Marshall, MN, ice cream plant |
| Food labeling compliance | 2 | 5 of 5 | Hopkins, MN, corporate |
| Salina line configuration | 2 | 4 of 5 | Salina, KS, pizza plant |
| PLC automation programming | 3 | 4 of 5 | Salina, KS, pizza plant |
| Menu and culinary consulting | 3 | 3 of 5 | Field, national |

*Note.* Headcounts are simulated. Locations and the regulatory basis for the ammonia record are factual; see OSHA (2016).

Table 3 reports the five future skill targets, each attached to a documented business driver rather than to a general expectation about technology.

**Table 3**

*Future Skill Targets and Their Business Drivers*

| Skill | Now | 2027 | Driver |
|---|---|---|---|
| Legal and compliance | 20% | 55% | CJ integration increases labeling load |
| PLC and automation | 34% | 65% | Sioux Falls facility opens in 2027 |
| Data analytics | 41% | 70% | Demand forecasting rollout |
| Refrigeration and ammonia | 22% | 50% | Frozen capacity expansion |
| Menu and culinary consulting | 29% | 55% | K-12 and healthcare account growth |

*Note.* Current and target coverage are simulated. Drivers are sourced; see Schwan's Company (2024) and CJ CheilJedang (2019).

Table 4 reports the distribution of recommended development actions across the five methods named in the prompt. Every method is represented, and no skill carries a recommendation without a stated first step.

**Table 4**

*Development Actions by Method*

| Method | Actions | Example |
|---|---|---|
| Training | 8 | Vendor-led controls course for maintenance staff |
| Mentoring | 6 | Sole subject matter expert pairs with two mentees |
| Project experience | 5 | Technicians join the Sioux Falls commissioning team |
| Certification | 4 | Sponsored ammonia refrigeration certification |
| Job rotation | 3 | Rotation through the Salina automation lines |

*Note.* Counts include ten primary first steps and sixteen alternative actions.

Figure 1 shows the overview page, which combines the four summary measures, the ranked order of work, and the lowest coverage skills on a single screen.

## Discussion

### Interpretation

The ranked list is the substantive result. Frozen dough formulation ranks first not because its coverage is lowest, which it is not, but because the scarcity term dominates when a single individual holds the skill. This is the behaviour a succession planning instrument should exhibit, and it distinguishes the output from a sorted list of coverage percentages.

### Limitations

Three limitations qualify every result above. First, coverage percentages, per-site headcounts, and employee records are simulated; only the organizational context and regulatory framework are sourced. Second, the assumed workforce of 8,500 is an estimate rather than a published figure, since the company does not publish a headcount and third-party profiles disagree substantially. Third, persistence is implemented in browser local storage keyed by skill rather than by person, so the demonstration cannot represent two employees pursuing the same development plan.

A further limitation concerns the scoring weights. The constants that normalize impact and scarcity were chosen by the author on judgement and are not empirically derived. In a deployment these would be configurable by a human resources leader rather than fixed by a developer.

### Ethical Considerations

A skills instrument becomes a ranking of people if it is permitted to. Two design constraints mitigate that risk. The application holds only skills and training data, never performance or disciplinary content, and the employee view presents an individual with their own record and their own development plan rather than presenting a comparison against peers. Two sources of bias should nevertheless be acknowledged: coverage data reflects who was recorded as trained, which systematically under-represents informally acquired skills, and impact ratings encode the priorities of whoever sets them. Displaying the inputs alongside the score, as the interface does, is a partial mitigation rather than a solution.

### Future Work

Three extensions follow directly from the limitations. Connecting the tool to a human resources information system would replace simulated coverage with observed records. Modelling development plans as records with an owner, a date, and a status would replace browser storage. Matching employees to plans automatically, using the skills they already hold as the basis for adjacency, would replace the current fixed recommendation per skill. A fourth extension, suggested by the event's hardware track, would read a badge at a plant entrance and present that employee's development plan on a local display.

## Conclusion

SkillSight demonstrates that the useful output of a skills intelligence system is an order of work rather than a display of data. The tool answers the five questions of the prompt in the order they are asked, states on screen which of its numbers are simulated, names the operational systems a real deployment would read, and ranks its findings using a formula a manager can inspect. It is deliberately small: four files, no framework, no build step, and no network dependency. The verification script and the fact audit are included in the repository so that both the software behaviour and the factual claims can be checked independently.

## References

- CJ CheilJedang. (2019). *CJ CheilJedang acquires major US food firm Schwan's Company, securing future growth engine to become a leading global top food company* [Press release]. https://www.cj.co.kr/en/newsroom/pressreleases/news-detail/1283

- Deloitte & The Manufacturing Institute. (n.d.). *2.1 million manufacturing jobs could go unfilled by 2030*. The Manufacturing Institute. Retrieved September 13, 2026, from https://themanufacturinginstitute.org/2-1-million-manufacturing-jobs-could-go-unfilled-by-2030-11330/

- International Institute of Ammonia Refrigeration. (n.d.). *The technician shortage*. IIAR Condenser. Retrieved September 13, 2026, from https://iiarcondenser.org/the-technician-shortage/

- Kansas Department of Commerce. (2023, May). *Governor Kelly congratulates Schwan's for completion of major pizza plant expansion in Salina creating 225 jobs*. https://www.kansascommerce.gov/2023/05/governor-kelly-congratulates-schwans-for-completion-of-major-pizza-plant-expansion-in-salina-creating-225-jobs/

- Occupational Safety and Health Administration. (2016, July 21). *Process safety management of highly hazardous chemicals and covered concentrations of listed appendix A chemicals* [Standard interpretation]. United States Department of Labor. https://www.osha.gov/laws-regs/standardinterpretations/2016-07-21

- Orange County Business Journal. (2023). *CJ Foods follows Fullerton plant with new HQ in La Palma*. https://www.ocbj.com/real-estate/cj-foods-follows-fullerton-plant-new-hq-la-palma/

- Schwan's Company. (n.d.-a). *About us*. Retrieved September 13, 2026, from https://www.schwanscompany.com/about-us/

- Schwan's Company. (n.d.-b). *Careers*. Retrieved September 13, 2026, from https://www.schwansjobs.com/

- Schwan's Company. (2024, May). *Schwan's Company and State of South Dakota announce future investments in Sioux Falls to support new food production facility* [Press release]. PR Newswire. https://www.prnewswire.com/news-releases/schwans-company-and-state-of-south-dakota-announce-future-investments-in-sioux-falls-to-support-new-food-production-facility-302159947.html

- United States Food and Drug Administration. (n.d.). *Frequently asked questions on FSMA*. Retrieved September 13, 2026, from https://www.fda.gov/food/food-safety-modernization-act-fsma/frequently-asked-questions-fsma

## Appendix A

### Data Dictionary

The demonstration dataset is a single JavaScript object. Its fields are as follows.

- segments: four job groups, each with a name, an assumed size, and a list of skills with coverage percentages.
- successionRisks: six records with skill, segment, location, headcount, impact from 1 to 5, and an explanatory note.
- futureSkills: five records with current coverage, target coverage for 2027, and the business driver.
- recommendedActions: ten primary development actions keyed by skill, each with a method and a detail.
- alternateActions: sixteen alternative actions, grouped by skill, used where a primary action exists.
- employees: three sample profiles with role, site, tenure, skills held, and skills in progress.
- dataSources: provenance for each skill, naming the operational systems a real deployment would read, with regulatory citations where they apply.
- demoNotes: the on-screen statement of assumptions and the list of ten external sources.

## Appendix B

### Worked Example of the Prioritization Score

The score for a skill is the product of impact, scarcity, and gap terms. For frozen dough formulation, which ranks first in the demonstration data:

impact = 4 of 5 = 0.80

scarcity = 3 divided by 1 holder = 3.00

gap = 0.4 plus (100 minus 18) divided by 100 = 1.22

score = 0.80 x 3.00 x 1.22 = 2.93

For PLC automation programming, which ranks fifth: impact 0.80, scarcity 3 divided by 3 holders = 1.00, gap 0.4 plus 0.66 = 1.06, giving a score of 0.85. The ratio of roughly 3.4 to 1 between the two reflects the scarcity term, which is the intended behaviour of the model.

## Appendix C

### Fact Verification Audit

Every external claim was checked against a primary or authoritative source. The table below summarizes the outcome. The full audit, with links, is maintained in the repository as FACTS.md.

**Table C1**

*Outcome of the Three-Pass Fact Check*

| Claim | Outcome | Basis |
|---|---|---|
| Four job groups and facility count | Verified | Schwan's Company (n.d.-b) |
| Sioux Falls plant type, size, jobs, year | Corrected | Schwan's Company (2024) |
| Salina expansion and job creation | Verified | Kansas Department of Commerce (2023) |
| Ammonia PSM threshold and records | Verified | OSHA (2016) |
| Preventive controls qualified individual | Verified | FDA (n.d.) |
| Skills gap of 2.1 million by 2030 | Verified | Deloitte & The Manufacturing Institute (n.d.) |
| Ageing of the skilled trades | Verified | IIAR (n.d.) |
| Workforce of about 8,500 | Assumption | Company publishes no headcount |
| Average ammonia technician age of 55 | Removed | Traceable only to vendor blogs |
| Maintenance understaffing survey | Removed | Vendor survey via syndicated content |
| La Palma as a corporate office | Corrected | Orange County Business Journal (2023) |

*Note.* Sources were limited to company publications, a state government release, federal regulators, and an industry association.

## Appendix D

### Verification Script Coverage

The script at verify.js renders every page in a stub document object model and asserts the following. All assertions passed at the time of submission.

**Table D1**

*Assertions Executed by the Verification Script*

| Assertion | Cases | Result |
|---|---|---|
| Every clickable row opens a page with no undefined values | 23 | Pass |
| Every skill page states a plan or why none exists | 23 | Pass |
| Every skill page names its data provenance | 23 | Pass |
| A started plan is visible in every list containing that skill | 42 | Pass |
| Previous and next navigation is correct at each position | 42 | Pass |
| Employee profiles reflect their own started plans | 5 | Pass |
| Data obeys the plan rule stated in the interface | 20 | Pass |

*Note.* The script reports a pass or the identity of the failing page and skill.
