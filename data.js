// Seed/demo data for SkillSight. Fake employee-level numbers; real Schwan's plant/segment names.
const SKILLSIGHT_DATA = {
  segments: [
    {
      name: "Manufacturing & Logistics",
      skills: [
        { skill: "Line Operations", coverage: 82 },
        { skill: "PLC / Automation Programming", coverage: 34 },
        { skill: "Food Safety / HACCP", coverage: 91 },
        { skill: "Refrigeration & Ammonia Systems", coverage: 22 },
        { skill: "Packaging Equipment Maintenance", coverage: 47 },
        { skill: "Lean / Six Sigma", coverage: 38 }
      ]
    },
    {
      name: "Retail Sales & Distribution",
      skills: [
        { skill: "Route Sales", coverage: 88 },
        { skill: "DSD Logistics", coverage: 65 },
        { skill: "Merchandising", coverage: 74 },
        { skill: "Customer Relationship Mgmt", coverage: 58 }
      ]
    },
    {
      name: "Foodservice Sales",
      skills: [
        { skill: "Foodservice Account Management", coverage: 70 },
        { skill: "Menu / Culinary Consulting", coverage: 29 },
        { skill: "Broadline Distributor Relations", coverage: 54 }
      ]
    },
    {
      name: "Corporate",
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
    { skill: "Ammonia Refrigeration Systems", segment: "Manufacturing & Logistics", location: "Marshall, MN (Ice Cream)", headcount: 2, impact: 5, note: "Only 2 certified techs plant-wide; both eligible for retirement within 5 years." },
    { skill: "PLC / Automation Programming", segment: "Manufacturing & Logistics", location: "Salina, KS (Pizza)", headcount: 3, impact: 4, note: "Line automation upgrades depend on 3 engineers across the plant." },
    { skill: "R&D / Food Science - Frozen Dough", segment: "Corporate", location: "Marshall, MN (R&D Center)", headcount: 1, impact: 4, note: "Single subject-matter expert for frozen dough formulation." },
    { skill: "Legal / Compliance - Food Labeling", segment: "Corporate", location: "Hopkins, MN (Corporate)", headcount: 2, impact: 5, note: "Cross-border labeling rules (US/CJ CheilJedang) known by 2 staff." },
    { skill: "World's Largest Pizza Plant - Line Config", segment: "Manufacturing & Logistics", location: "Salina, KS (Pizza)", headcount: 2, impact: 4, note: "Proprietary line configuration knowledge, not documented outside 2 senior operators." },
    { skill: "Culinary Consulting - Foodservice", segment: "Foodservice Sales", location: "Field - National", headcount: 3, impact: 3, note: "3 consultants cover all K-12 and healthcare foodservice accounts nationwide." }
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
    "Ammonia Refrigeration Systems": { method: "Certification", detail: "Sponsor RETA ammonia refrigeration certification now - both current techs are retirement-eligible within 5 years." },
    "R&D / Food Science - Frozen Dough": { method: "Mentoring", detail: "Pair the sole subject-matter expert with 2 mentees to document and transfer frozen dough formulation knowledge." },
    "R&D / Food Science": { method: "Mentoring", detail: "Pair senior food scientists with junior hires to spread formulation knowledge beyond a single expert." },
    "Legal / Compliance - Food Labeling": { method: "Training", detail: "Cross-border labeling compliance workshop for corporate legal staff, ahead of expanded CJ integration." },
    "Legal / Compliance": { method: "Training", detail: "Cross-border labeling compliance workshop for corporate legal staff, ahead of expanded CJ integration." },
    "Culinary Consulting - Foodservice": { method: "Project Experience", detail: "Rotate junior account staff through shadow assignments on K-12 and healthcare accounts nationwide." },
    "Menu / Culinary Consulting": { method: "Project Experience", detail: "Rotate junior account staff through shadow assignments on K-12 and healthcare accounts nationwide." },
    "World's Largest Pizza Plant - Line Config": { method: "Mentoring", detail: "Document proprietary line configuration knowledge and pair senior operators with backups before any transfer or retirement." },
    "Data Analytics": { method: "Training", detail: "Enroll corporate staff in an applied analytics bootcamp tied to the AI demand-forecasting rollout." },
    "Lean / Six Sigma": { method: "Certification", detail: "Fund Green Belt certification for plant supervisors to spread process-improvement skill beyond a small group." }
  }
};
