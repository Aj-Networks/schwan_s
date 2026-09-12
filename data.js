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
  successionRisks: [
    { skill: "Ammonia Refrigeration Systems", location: "Marshall, MN (Ice Cream)", headcount: 2, note: "Only 2 certified techs plant-wide; both eligible for retirement within 5 years." },
    { skill: "PLC / Automation Programming", location: "Salina, KS (Pizza)", headcount: 3, note: "Line automation upgrades depend on 3 engineers across the plant." },
    { skill: "R&D / Food Science - Frozen Dough", location: "Marshall, MN (R&D Center)", headcount: 1, note: "Single subject-matter expert for frozen dough formulation." },
    { skill: "Legal / Compliance - Food Labeling", location: "Hopkins, MN (Corporate)", headcount: 2, note: "Cross-border labeling rules (US/CJ CheilJedang) known by 2 staff." },
    { skill: "World's Largest Pizza Plant - Line Config", location: "Salina, KS (Pizza)", headcount: 2, note: "Proprietary line configuration knowledge, not documented outside 2 senior operators." },
    { skill: "Culinary Consulting - Foodservice", location: "Field - National", headcount: 3, note: "3 consultants cover all K-12 and healthcare foodservice accounts nationwide." }
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
  ]
};
