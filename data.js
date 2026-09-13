// Seed/demo data for SkillSight. Fake employee-level numbers; real Schwan's plant/segment names.
const SKILLSIGHT_DATA = {
  // Said on screen so nobody mistakes the demo for a real report.
  demoNotes: {
    headline: "Demo numbers, real places. Every outside fact is sourced, and the workforce size is a stated assumption.",
    points: [
      "Where this started: the five questions in the challenge. Each one became a page.",
      "Assumed workforce of 8,500: 5,200 in Manufacturing and Logistics, 1,500 in Retail Sales and Distribution, 550 in Foodservice Sales, 1,250 in Corporate. Schwan's does not publish a headcount. Third party profiles range from about 4,000 to about 8,500. This demo uses the high end and says so, rather than claiming it as fact.",
      "Coverage is the share of a job group that has a skill. The people counts in the risk list are for one site, not the whole group, which is why a skill can read 22 percent and still come down to two certified techs at Marshall.",
      "Real and sourced: the job group names, plant and office locations, the Sioux Falls build-out, the Salina expansion, CJ CheilJedang ownership, and the regulations behind each data source. Links below.",
      "Made up: every coverage percentage, the per-site headcounts, and all employee records. They are shaped by published industry figures, listed below, not invented from nothing.",
      "The site list is compiled from public reporting, not from a list Schwan's publishes. The company says only that it runs more than a dozen US facilities, so treat this network as close but not official.",
      "Limits: no real HR data, no login, and no live system to read from. The scores rank the work, they do not predict who will leave."
    ],
    // Every outside fact the app leans on, with the source it came from: company
    // pages, a state government release, a federal regulator, and an industry
    // association. Nothing from a personal blog. Full audit in FACTS.md.
    sources: [
      { fact: "Schwan's is headquartered in Marshall, MN and is a subsidiary of CJ CheilJedang, describing itself as a US-based affiliate of CJ Foods.",
        source: "Schwan's Company, About Us", url: "https://www.schwanscompany.com/about-us/" },
      { fact: "The four job groups used here are Schwan's own career areas: Manufacturing and Logistics, Retail Sales and Distribution, Foodservice Sales, and Corporate. The same site describes more than a dozen US facilities and the world's largest pizza plant.",
        source: "Schwan's Careers", url: "https://www.schwansjobs.com/" },
      { fact: "The new Sioux Falls plant is 700,000 square feet of Asian-style food production for bibigo, creating over 600 plant jobs plus 50 office jobs, opening 2027.",
        source: "Schwan's Company press release, May 2024", url: "https://www.prnewswire.com/news-releases/schwans-company-and-state-of-south-dakota-announce-future-investments-in-sioux-falls-to-support-new-food-production-facility-302159947.html" },
      { fact: "The Salina, KS pizza plant completed a 400,000 square foot expansion in 2023, creating 225 jobs.",
        source: "Kansas Department of Commerce", url: "https://www.kansascommerce.gov/2023/05/governor-kelly-congratulates-schwans-for-completion-of-major-pizza-plant-expansion-in-salina-creating-225-jobs/" },
      { fact: "The US manufacturing skills gap could leave 2.1 million jobs unfilled by 2030, costing $1 trillion in that year alone. Retirement of baby boomers is named by 34 percent of manufacturers as a top cause.",
        source: "Deloitte and The Manufacturing Institute", url: "https://themanufacturinginstitute.org/2-1-million-manufacturing-jobs-could-go-unfilled-by-2030-11330/" },
      { fact: "40 percent of the 12 million people in the skilled trades are over 45, nearly half of those over 55, and fewer than 9 percent of workers aged 19 to 24 are entering the trades. That is why the demo puts retirement-eligible techs on a critical system.",
        source: "IIAR Condenser, the industrial refrigeration association's journal", url: "https://iiarcondenser.org/the-technician-shortage/" },
      { fact: "Ammonia refrigeration systems holding 10,000 pounds or more are a covered process under OSHA 1910.119, which requires refresher training at least every three years and a record naming each trained employee and the date.",
        source: "OSHA, 29 CFR 1910.119", url: "https://www.osha.gov/laws-regs/standardinterpretations/2016-07-21" },
      { fact: "CJ CheilJedang's acquisition of Schwan's took its US production bases from 5 to 22, which is the integration this demo's labeling and duplicate-role pressure comes from.",
        source: "CJ CheilJedang press release", url: "https://www.cj.co.kr/en/newsroom/pressreleases/news-detail/1283" },
      { fact: "CJ Foods moved its US headquarters to La Palma, CA in 2023, which is why La Palma appears in this network as an affiliate office rather than a Schwan's corporate site.",
        source: "Orange County Business Journal", url: "https://www.ocbj.com/real-estate/cj-foods-follows-fullerton-plant-new-hq-la-palma/" },
      { fact: "A facility's written food safety plan must be prepared, or its preparation overseen, by a preventive controls qualified individual. FDA mandates no specific certificate.",
        source: "FDA, FSMA questions and answers", url: "https://www.fda.gov/food/food-safety-modernization-act-fsma/frequently-asked-questions-fsma" }
    ]
  },

  segments: [
    {
      name: "Manufacturing & Logistics",
      size: 5200,
      skills: [
        { skill: "Line Operations", coverage: 82 },
        { skill: "PLC / Automation Programming", coverage: 34 },
        { skill: "Food Safety / HACCP", coverage: 91 },
        { skill: "Refrigeration & Ammonia Systems", coverage: 22 },
        { skill: "Packaging Equipment Maintenance", coverage: 47 },
        { skill: "Lean / Six Sigma", coverage: 38 },
        { skill: "Pizza Line Configuration", coverage: 12 }
      ]
    },
    {
      name: "Retail Sales & Distribution",
      size: 1500,
      skills: [
        { skill: "Route Sales", coverage: 88 },
        { skill: "DSD Logistics", coverage: 65 },
        { skill: "Merchandising", coverage: 74 },
        { skill: "Customer Relationship Mgmt", coverage: 58 }
      ]
    },
    {
      name: "Foodservice Sales",
      size: 550,
      skills: [
        { skill: "Foodservice Account Management", coverage: 70 },
        { skill: "Menu / Culinary Consulting", coverage: 29 },
        { skill: "Broadline Distributor Relations", coverage: 54 }
      ]
    },
    {
      name: "Corporate",
      size: 1250,
      skills: [
        { skill: "R&D / Food Science", coverage: 18 },
        { skill: "Data Analytics", coverage: 41 },
        { skill: "Marketing Strategy", coverage: 60 },
        { skill: "Supply Chain Planning", coverage: 45 },
        { skill: "HR / Talent Management", coverage: 55 },
        { skill: "Legal / Compliance", coverage: 20 }
      ]
    }
  ],

  // Where a real deployment would read each skill from. The point judges ask about:
  // this is not a new dataset to build, it is systems the company already runs.
  dataSources: {
    bySegment: {
      "Manufacturing & Logistics": "Plant training records, equipment certifications, and maintenance work order sign-offs.",
      "Retail Sales & Distribution": "HR job codes, route assignments, and sales system activity.",
      "Foodservice Sales": "HR job codes and customer account assignments.",
      "Corporate": "HR job codes, learning records, and project assignment history."
    },
    bySkill: {
      "Refrigeration & Ammonia Systems": {
        systems: "Process safety training records, RETA or EPA certification files, and maintenance sign-offs.",
        note: "Ammonia systems holding 10,000 pounds or more are a covered process under OSHA 1910.119. The employer must refresher-train operators at least every three years and keep a record naming each employee, the date, and how understanding was verified. The roster exists by law. Nobody has to build it.",
        source: "OSHA 29 CFR 1910.119", url: "https://www.osha.gov/laws-regs/standardinterpretations/2016-07-21"
      },
      "Food Safety / HACCP": {
        systems: "Food safety plan records and training files.",
        note: "A facility's written food safety plan must be prepared, or its preparation overseen, by a preventive controls qualified individual, so the plant already knows who that is. FDA mandates no specific certificate, which is why job history counts here as much as a course.",
        source: "FDA, FSMA questions and answers", url: "https://www.fda.gov/food/food-safety-modernization-act-fsma/frequently-asked-questions-fsma"
      },
      "PLC / Automation Programming": {
        systems: "Maintenance certifications, vendor training records, and work order history.",
        note: "Controls work is signed off by name in the maintenance system, which is the practical record of who can actually do it, not just who took the course."
      },
      "Pizza Line Configuration": {
        systems: "None. This skill has no system of record anywhere.",
        note: "That is the finding, not a gap in the tool. The setup lives with two operators and is written down nowhere, which is exactly why the first step is to document it."
      },
      "Packaging Equipment Maintenance": {
        systems: "Equipment maker training records and maintenance work order history."
      },
      "R&D / Food Science": {
        systems: "HR job codes and project assignment history.",
        note: "Formulation knowledge is traceable through who owned which product project."
      },
      "Legal / Compliance": {
        systems: "HR job codes and matter assignment records."
      },
      "Data Analytics": {
        systems: "Learning records and reporting tool access logs.",
        note: "Who has access to the reporting tools is a fair first proxy for who can use them."
      },
      "Menu / Culinary Consulting": {
        systems: "HR job codes and customer account assignments."
      },
      "Lean / Six Sigma": {
        systems: "Certification records and improvement project history."
      }
    }
  },

  // Three sample profiles so the tool can be seen from the employee's side,
  // not only the manager's. Same plan data, same saved checkboxes.
  employees: [
    {
      id: "EMP-1042", name: "Sam K.", role: "Refrigeration Technician", site: "Marshall, MN (Ice Cream)",
      segment: "Manufacturing & Logistics", years: 14,
      has: ["Refrigeration & Ammonia Systems", "Line Operations", "Food Safety / HACCP"],
      learning: ["Lean / Six Sigma"],
      note: "Holds the ammonia certification. The plant has one other person who does."
    },
    {
      id: "EMP-2071", name: "Dani M.", role: "Maintenance Technician", site: "Salina, KS (Pizza)",
      segment: "Manufacturing & Logistics", years: 6,
      has: ["Line Operations", "Packaging Equipment Maintenance", "Food Safety / HACCP"],
      learning: ["PLC / Automation Programming", "Pizza Line Configuration"],
      note: "Next in line for the automation work when Sioux Falls opens."
    },
    {
      id: "EMP-3310", name: "Alex T.", role: "Demand Planner", site: "Hopkins, MN (Corporate)",
      segment: "Corporate", years: 3,
      has: ["Supply Chain Planning", "Marketing Strategy"],
      learning: ["Data Analytics"],
      note: "Already does reporting work by hand, so analytics is the shortest jump."
    }
  ],

  // Skills held by very few people -> succession/knowledge-concentration risk
  // impact = business criticality if this knowledge is lost (1-5). headcount = how few people hold it.
  // Together these two axes make a real risk matrix (Impact x Concentration), not just a list.
  successionRisks: [
    { skill: "Refrigeration & Ammonia Systems", segment: "Manufacturing & Logistics", location: "Marshall, MN (Ice Cream)", headcount: 2, impact: 5, note: "Only 2 certified techs plant-wide; both eligible for retirement within 5 years." },
    { skill: "PLC / Automation Programming", segment: "Manufacturing & Logistics", location: "Salina, KS (Pizza)", headcount: 3, impact: 4, note: "Line automation upgrades depend on 3 engineers across the plant." },
    { skill: "R&D / Food Science - Frozen Dough", segment: "Corporate", location: "Marshall, MN (R&D Center)", headcount: 1, impact: 4, note: "Single subject-matter expert for frozen dough formulation." },
    { skill: "Legal / Compliance - Food Labeling", segment: "Corporate", location: "Hopkins, MN (Corporate)", headcount: 2, impact: 5, note: "Cross-border labeling rules (US/CJ CheilJedang) known by 2 staff." },
    { skill: "Pizza Line Configuration - Salina", segment: "Manufacturing & Logistics", location: "Salina, KS (Pizza)", headcount: 2, impact: 4, note: "How the Salina lines are set up is not written down anywhere. Two senior operators carry it in their heads." },
    { skill: "Menu / Culinary Consulting", segment: "Foodservice Sales", location: "Field - National", headcount: 3, impact: 3, note: "3 consultants cover all K-12 and healthcare foodservice accounts nationwide." }
  ],

  plants: [
    "Marshall, MN (Corporate + R&D + Ice Cream)",
    "Hopkins, MN (Corporate)",
    "La Palma, CA (CJ Foods USA office)",
    "Salina, KS (Pizza)", "Florence, KY (Pizza)", "Pasadena/Deer Park, TX (Pizza)",
    "Columbus, OH (Pizza)", "Sidney, OH (Pizza)", "City of Industry, CA (Pizza)",
    "Sioux Falls, SD (Asian-style foods, opening 2027)", "Erie, PA (Pizza)", "North East, PA (Pizza)",
    "Westfield, NY (Pizza)", "Brooklyn, NY (Pizza)", "Fullerton, CA (Pizza)", "Beaumont, CA (Pizza)",
    "Stilwell, OK (Frozen Desserts)", "Pottstown, PA (Packaging)"
  ],

  // Forward-looking demand tied to real business drivers (Q2: future skills needed)
  futureSkills: [
    { skill: "PLC / Automation Programming", segment: "Manufacturing & Logistics", currentCoverage: 34, targetCoverage: 65, driver: "The new Sioux Falls plant, 700,000 square feet of Asian-style food production, needs automation techs trained before it opens in 2027." },
    { skill: "Data Analytics", segment: "Corporate", currentCoverage: 41, targetCoverage: 70, driver: "AI-driven demand forecasting rollout across the supply chain." },
    { skill: "Refrigeration & Ammonia Systems", segment: "Manufacturing & Logistics", currentCoverage: 22, targetCoverage: 50, driver: "New frozen-capacity expansion requires more certified techs, not just replacements." },
    { skill: "Legal / Compliance", segment: "Corporate", currentCoverage: 20, targetCoverage: 55, driver: "Cross-border integration with CJ CheilJedang increases labeling and compliance load." },
    { skill: "Menu / Culinary Consulting", segment: "Foodservice Sales", currentCoverage: 29, targetCoverage: 55, driver: "Expanding K-12 and healthcare foodservice accounts nationwide." }
  ],

  // How to close each gap (Q5) - one primary recommended action per skill, keyed by skill name
  recommendedActions: {
    "PLC / Automation Programming": { method: "Job Rotation", detail: "Rotate maintenance techs from other plants through Salina's automation line for hands-on cross-training before Sioux Falls opens." },
    "Refrigeration & Ammonia Systems": { method: "Certification", detail: "Sponsor RETA ammonia refrigeration certification now - both current techs are retirement-eligible within 5 years." },
    "R&D / Food Science - Frozen Dough": { method: "Mentoring", detail: "Pair the sole subject-matter expert with 2 mentees to document and transfer frozen dough formulation knowledge." },
    "R&D / Food Science": { method: "Mentoring", detail: "Pair senior food scientists with junior hires to spread formulation knowledge beyond a single expert." },
    "Legal / Compliance - Food Labeling": { method: "Training", detail: "Cross-border labeling compliance workshop for corporate legal staff, ahead of expanded CJ integration." },
    "Legal / Compliance": { method: "Training", detail: "Cross-border labeling compliance workshop for corporate legal staff, ahead of expanded CJ integration." },
    "Menu / Culinary Consulting": { method: "Project Experience", detail: "Rotate junior account staff through shadow assignments on K-12 and healthcare accounts nationwide." },
    "Pizza Line Configuration": { method: "Mentoring", detail: "Write down how the lines are set up, and pair each senior operator with a backup before anyone transfers or retires." },
    "Data Analytics": { method: "Training", detail: "Enroll corporate staff in an applied analytics bootcamp tied to the AI demand-forecasting rollout." },
    "Lean / Six Sigma": { method: "Certification", detail: "Fund Green Belt certification for plant supervisors to spread process-improvement skill beyond a small group." }
  },

  // The challenge names five ways to close a gap: training, mentoring, certification,
  // job rotation, and project experience. One is recommended first, these are the backups.
  alternateActions: {
    "PLC / Automation Programming": [
      { method: "Training", detail: "Vendor-led PLC course for maintenance staff at each pizza plant." },
      { method: "Project Experience", detail: "Put two techs on the Sioux Falls commissioning team so they learn the new lines while building them." }
    ],
    "Refrigeration & Ammonia Systems": [
      { method: "Mentoring", detail: "Both certified techs each take an apprentice for a full year." },
      { method: "Job Rotation", detail: "Bring techs from Stilwell through Marshall on a set rotation." }
    ],
    "R&D / Food Science": [
      { method: "Training", detail: "Food science short course for product and quality staff already on site." },
      { method: "Project Experience", detail: "Give junior staff a small reformulation project with the expert reviewing." }
    ],
    "Legal / Compliance": [
      { method: "Certification", detail: "Food labeling certification for two more corporate staff." },
      { method: "Mentoring", detail: "The two people who know the cross-border rules each train a backup." }
    ],
    "Menu / Culinary Consulting": [
      { method: "Mentoring", detail: "Pair each consultant with an account manager who wants to move into the role." },
      { method: "Training", detail: "Culinary consulting workshop for foodservice sales staff." }
    ],
    "Data Analytics": [
      { method: "Certification", detail: "Sponsor a data analytics certificate for staff already doing reporting work." },
      { method: "Project Experience", detail: "Staff the demand forecasting pilot with people learning on the job." }
    ],
    "Pizza Line Configuration": [
      { method: "Job Rotation", detail: "Move operators from other pizza plants through Salina for a set period." },
      { method: "Training", detail: "Build a short course from the written-down setup once it exists." }
    ],
    "Lean / Six Sigma": [
      { method: "Project Experience", detail: "Each supervisor runs one improvement project with a coach." },
      { method: "Training", detail: "Yellow Belt basics for every line lead, not just supervisors." }
    ],
  }
};
