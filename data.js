// Seed/demo data for SkillSight. Fake employee-level numbers; real Schwan's plant/segment names.
const SKILLSIGHT_DATA = {
  // Said on screen so nobody mistakes the demo for a real report.
  demoNotes: {
    headline: "Demo numbers, real places. Assumes a workforce of about 7,000 people across four job groups.",
    points: [
      "Where this started: the five questions in the challenge. Each one became a page.",
      "Assumed workforce: 4,200 in Manufacturing and Logistics, 1,300 in Retail Sales and Distribution, 450 in Foodservice Sales, 1,050 in Corporate.",
      "Coverage is the share of a job group that has a skill. The people counts in the risk list are for one site, not the whole group, which is why a skill can read 22 percent and still come down to two certified techs at Marshall.",
      "Real: plant and office locations, job groups, and the business reasons (the Sioux Falls build-out, the CJ CheilJedang integration, the Marshall R&D center).",
      "Made up: every coverage percentage, headcount, and employee name.",
      "Limits: no real HR data, no individual records, no login, and no employee view yet. Scores rank the work, they do not predict who will leave."
    ]
  },

  segments: [
    {
      name: "Manufacturing & Logistics",
      size: 4200,
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
      size: 1300,
      skills: [
        { skill: "Route Sales", coverage: 88 },
        { skill: "DSD Logistics", coverage: 65 },
        { skill: "Merchandising", coverage: 74 },
        { skill: "Customer Relationship Mgmt", coverage: 58 }
      ]
    },
    {
      name: "Foodservice Sales",
      size: 450,
      skills: [
        { skill: "Foodservice Account Management", coverage: 70 },
        { skill: "Menu / Culinary Consulting", coverage: 29 },
        { skill: "Broadline Distributor Relations", coverage: 54 }
      ]
    },
    {
      name: "Corporate",
      size: 1050,
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
    "La Palma, CA (Corporate)",
    "Salina, KS (Pizza)", "Florence, KY (Pizza)", "Pasadena/Deer Park, TX (Pizza)",
    "Columbus, OH (Pizza)", "Sidney, OH (Pizza)", "City of Industry, CA (Pizza)",
    "Sioux Falls, SD (Pizza - new facility)", "Erie, PA (Pizza)", "North East, PA (Pizza)",
    "Westfield, NY (Pizza)", "Brooklyn, NY (Pizza)", "Fullerton, CA (Pizza)", "Beaumont, CA (Pizza)",
    "Stilwell, OK (Frozen Desserts)", "Pottstown, PA (Packaging)"
  ],

  // Forward-looking demand tied to real business drivers (Q2: future skills needed)
  futureSkills: [
    { skill: "PLC / Automation Programming", segment: "Manufacturing & Logistics", currentCoverage: 34, targetCoverage: 65, driver: "Sioux Falls plant build-out needs automation techs ready before opening." },
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
    "Packaging Equipment Maintenance": [
      { method: "Training", detail: "Equipment maker runs a maintenance course on site." },
      { method: "Mentoring", detail: "Senior mechanics take one trainee each per shift." }
    ]
  }
};
