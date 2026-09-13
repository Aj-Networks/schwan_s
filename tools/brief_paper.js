/* SkillSight project brief, formatted to APA 7 (professional paper):
   title page, abstract with keywords, table of contents, levelled headings,
   APA tables, reference list with hanging indents, appendices.

   Writes a .docx. The repository publishes the PDF export and BRIEF.md, the
   plain-text rendering, because GitHub cannot preview Word files.

   Usage: node tools/brief_paper.js out.docx  */

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak,
  Header, PageNumber, TabStopType, TabStopPosition, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, TableOfContents, ImageRun, LevelFormat
} = require("docx");
const fs = require("fs");

const OUT = process.argv[2];
const SERIF = "Times New Roman";
const DOUBLE = 480;          // twips: double spacing for 12pt
const INDENT = 720;          // 0.5 inch first-line indent
const RUNNING = "SKILLSIGHT: SKILLS INTELLIGENCE FOR KNOWLEDGE RISK";

/* ---------- paragraph helpers ---------- */

const body = (text, o = {}) => new Paragraph({
  spacing: { line: DOUBLE, before: 0, after: 0 },
  indent: o.noIndent ? undefined : { firstLine: INDENT },
  alignment: o.align,
  children: [new TextRun({ text, font: SERIF, size: 24, italics: o.italics, bold: o.bold })]
});

const rich = (runs, o = {}) => new Paragraph({
  spacing: { line: DOUBLE, before: 0, after: 0 },
  indent: o.noIndent ? undefined : { firstLine: INDENT },
  alignment: o.align,
  children: runs.map(r => new TextRun(Object.assign({ font: SERIF, size: 24 }, r)))
});

const blank = () => new Paragraph({ spacing: { line: DOUBLE }, children: [new TextRun({ text: "", font: SERIF, size: 24 })] });

// APA level 1: centred, bold, title case, on its own line
const h1 = text => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  alignment: AlignmentType.CENTER,
  spacing: { line: DOUBLE, before: 0, after: 0 },
  children: [new TextRun({ text, font: SERIF, size: 24, bold: true })]
});

// APA level 2: flush left, bold
const h2 = text => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { line: DOUBLE, before: 0, after: 0 },
  children: [new TextRun({ text, font: SERIF, size: 24, bold: true })]
});

// APA level 3: flush left, bold italic
const h3 = text => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { line: DOUBLE, before: 0, after: 0 },
  children: [new TextRun({ text, font: SERIF, size: 24, bold: true, italics: true })]
});

// reference entry: hanging indent of 0.5 inch
// Centred and bold, but not a heading style, so it does not enter the contents list.
const plainHead = text => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { line: DOUBLE, before: 0, after: 0 },
  children: [new TextRun({ text, font: SERIF, size: 24, bold: true })]
});

const ref = runs => new Paragraph({
  spacing: { line: DOUBLE, before: 0, after: 0 },
  indent: { left: INDENT, hanging: INDENT },
  children: runs.map(r => new TextRun(Object.assign({ font: SERIF, size: 24 }, r)))
});

const bullet = text => new Paragraph({
  numbering: { reference: "apa-bullets", level: 0 },
  spacing: { line: DOUBLE, before: 0, after: 0 },
  children: [new TextRun({ text, font: SERIF, size: 24 })]
});

/* ---------- APA table: no vertical rules, rule above and below the head ---------- */

const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const SOLID = { style: BorderStyle.SINGLE, size: 4, color: "000000" };

function cell(text, { head = false, w, italics = false, align } = {}) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    borders: { top: NONE, bottom: head ? SOLID : NONE, left: NONE, right: NONE },
    children: [new Paragraph({
      spacing: { line: 240, before: 0, after: 0 },
      alignment: align,
      children: [new TextRun({ text, font: SERIF, size: 22, bold: head, italics })]
    })]
  });
}

function apaTable(number, title, note, cols, rows) {
  const total = cols.reduce((t, c) => t + c.w, 0);
  const out = [
    new Paragraph({ spacing: { line: DOUBLE, before: 240, after: 0 },
      children: [new TextRun({ text: "Table " + number, font: SERIF, size: 24, bold: true })] }),
    new Paragraph({ spacing: { line: DOUBLE, before: 0, after: 60 },
      children: [new TextRun({ text: title, font: SERIF, size: 24, italics: true })] }),
    new Table({
      columnWidths: cols.map(c => c.w),
      width: { size: total, type: WidthType.DXA },
      borders: { top: SOLID, bottom: SOLID, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE },
      rows: [
        new TableRow({ tableHeader: true, children: cols.map(c => cell(c.label, { head: true, w: c.w, align: c.align })) }),
        ...rows.map(r => new TableRow({ children: r.map((v, i) => cell(String(v), { w: cols[i].w, align: cols[i].align })) }))
      ]
    })
  ];
  if (note) {
    out.push(new Paragraph({
      spacing: { line: DOUBLE, before: 60, after: 0 },
      children: [
        new TextRun({ text: "Note. ", font: SERIF, size: 22, italics: true }),
        new TextRun({ text: note, font: SERIF, size: 22 })
      ]
    }));
  }
  return out;
}

/* ---------- document ---------- */

const doc = new Document({
  creator: "Ajay Angdembe",
  title: "SkillSight: A Lightweight Skills Intelligence Tool for Identifying Knowledge Concentration Risk",
  description: "Project brief prepared in APA 7 format for Southwest MN Hacks 2026, Schwan's Prompt 01.",
  features: { updateFields: true },
  numbering: {
    config: [{
      reference: "apa-bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 1080, hanging: 360 } } }
      }]
    }]
  },
  styles: {
    default: {
      document: { run: { font: SERIF, size: 24 }, paragraph: { spacing: { line: DOUBLE } } }
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: SERIF, size: 24, bold: true, color: "000000" },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { line: DOUBLE, before: 0, after: 0 } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: SERIF, size: 24, bold: true, color: "000000" },
        paragraph: { spacing: { line: DOUBLE, before: 0, after: 0 } } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: SERIF, size: 24, bold: true, italics: true, color: "000000" },
        paragraph: { spacing: { line: DOUBLE, before: 0, after: 0 } } }
    ]
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: {
      default: new Header({
        children: [new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { line: 240 },
          children: [
            new TextRun({ text: RUNNING, font: SERIF, size: 24 }),
            new TextRun({ text: "\t", font: SERIF, size: 24 }),
            new TextRun({ children: [PageNumber.CURRENT], font: SERIF, size: 24 })
          ]
        })]
      })
    },
    children: [

      /* ===== title page ===== */
      blank(), blank(), blank(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: DOUBLE },
        children: [new TextRun({ text: "SkillSight: A Lightweight Skills Intelligence Tool for Identifying", font: SERIF, size: 24, bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: DOUBLE },
        children: [new TextRun({ text: "Knowledge Concentration Risk in Food Manufacturing", font: SERIF, size: 24, bold: true })] }),
      blank(),
      body("Ajay Angdembe", { align: AlignmentType.CENTER, noIndent: true }),
      body("Independent entrant, Southwest MN Hacks 2026", { align: AlignmentType.CENTER, noIndent: true }),
      body("Southwest Minnesota State University, Marshall, Minnesota", { align: AlignmentType.CENTER, noIndent: true }),
      body("Challenge Prompt 01: Talent Readiness and Skills Intelligence Platform", { align: AlignmentType.CENTER, noIndent: true }),
      body("September 13, 2026", { align: AlignmentType.CENTER, noIndent: true }),
      blank(), blank(), blank(),
      plainHead("Author Note"),
      body("Ajay Angdembe is an independent solo entrant at Southwest MN Hacks 2026. The software described in this paper is available at https://github.com/Aj-Networks/schwan_s."),
      body("This work has no funding source and no affiliation with Schwan's Company. All coverage percentages, per-site headcounts, and employee records described here are simulated for demonstration. Organizational facts, business drivers, and regulatory requirements are drawn from public sources and are cited throughout."),
      body("Generative artificial intelligence tools were used during development, which the event rules permit on the condition that the entrant can explain the resulting code. All design decisions, the prioritization model, and the verification procedure described in the Method section are the author's own."),
      body("Correspondence concerning this paper should be addressed to Ajay Angdembe via the repository listed above."),
      new Paragraph({ children: [new PageBreak()] }),

      /* ===== abstract ===== */
      plainHead("Abstract"),
      body("Organizations in food manufacturing face a measurable shortage of skilled technical labour, an ageing trades workforce, and the operational risk created when critical knowledge is concentrated in very few employees. Existing enterprise systems record skills data but rarely rank it, leaving leaders with dashboards rather than decisions. This paper describes SkillSight, a lightweight web application built during a 24-hour hackathon to answer the five questions posed in Schwan's Prompt 01. The tool inventories skills by job group, identifies coverage gaps, flags skills held by three people or fewer, projects future demand against business drivers, and attaches a first development step to each gap using the five methods named in the prompt. Its distinguishing feature is a prioritization score that multiplies business impact, holder scarcity, and gap size to produce a single ranked order of work. The application is implemented in four files of dependency-free HTML, CSS, and JavaScript, and is accompanied by a verification script that asserts 42 skill-and-list combinations across every rendered page. Demonstration data is simulated and labelled as such in the interface; organizational context is sourced and audited. The paper reports the design, the scoring model, the verification approach, and the limitations that separate a hackathon demonstration from a deployable system.", { noIndent: true }),
      blank(),
      rich([
        { text: "Keywords: ", italics: true },
        { text: "skills inventory, succession risk, knowledge concentration, workforce readiness, food manufacturing, process safety management" }
      ]),
      new Paragraph({ children: [new PageBreak()] }),

      /* ===== contents ===== */
      plainHead("Table of Contents"),
      new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-3" }),
      body("If the entries below appear as a placeholder, select the table and press F9 in Microsoft Word to update the field.", { italics: true }),
      new Paragraph({ children: [new PageBreak()] }),

      /* ===== introduction (APA: repeat the title, no Introduction heading) ===== */
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: DOUBLE },
        children: [new TextRun({ text: "SkillSight: A Lightweight Skills Intelligence Tool for Identifying", font: SERIF, size: 24, bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: DOUBLE },
        children: [new TextRun({ text: "Knowledge Concentration Risk in Food Manufacturing", font: SERIF, size: 24, bold: true })] }),
      body("Leaders of large manufacturing organizations are routinely asked to plan for capability they cannot see. Skills information is dispersed across human resources systems, plant training files, certification registries, and the working memory of long-tenured employees. The consequence is not merely administrative. When a critical skill is held by one or two people at a single site, the organization carries an operational risk that no one has quantified and no one owns."),
      body("Schwan's Prompt 01 at Southwest MN Hacks 2026 framed this problem directly, asking entrants to build a solution that helps an organization understand current workforce capability, identify critical gaps, assess future talent needs, and accelerate readiness through targeted development recommendations. The prompt specified five questions the platform should answer, concerning skills that exist today, skills that will be needed, skills concentrated in a few individuals, the greatest capability gaps and succession risks, and the ways employees can close those gaps."),
      body("This paper describes SkillSight, the application built in response, and argues a narrow thesis: in a domain where enterprise systems already collect skills data, the scarce capability is not visualization but prioritization. The contribution of the tool is therefore a defensible ranking, expressed in a formula that is displayed to the user rather than hidden, together with an honest account of which numbers are real and which are simulated."),

      /* ===== background ===== */
      h1("Background"),
      h2("The Skills Gap in United States Manufacturing"),
      body("Analysis published by Deloitte and The Manufacturing Institute estimates that 2.1 million manufacturing jobs in the United States could go unfilled by 2030, at a cost of approximately $1 trillion in that year alone, with 34% of surveyed manufacturers identifying the retirement of baby boomers as a leading cause (Deloitte & The Manufacturing Institute, n.d.). The figure is frequently cited in workforce planning literature and establishes the macro condition in which any skills intelligence tool operates."),
      h2("Knowledge Concentration and an Ageing Trades Workforce"),
      body("The distribution of that shortage is uneven. The International Institute of Ammonia Refrigeration (IIAR), reporting analysis of the skilled trades workforce, notes that 40% of the 12 million people in the skilled trades are over the age of 45, that nearly half of those workers are over 55, and that fewer than 9% of workers aged 19 to 24 are entering the trades (IIAR, n.d.). The same publication observes candidly that no comprehensive refrigeration-sector workforce dataset exists, a caution this paper adopts when describing its own demonstration figures."),
      body("The practical form of this condition is knowledge concentration: a plant may run continuously on a system that two certified technicians understand, both of whom are within a few years of retirement. That is a succession risk expressed in production terms rather than in human resources terms, and it is the risk SkillSight is designed to surface."),
      h2("Where Skills Data Already Exists"),
      body("A common objection to any skills intelligence proposal is that the underlying data does not exist. In regulated manufacturing this objection is weaker than it appears. Ammonia refrigeration systems containing 10,000 pounds or more are a covered process under the Occupational Safety and Health Administration's process safety management standard, which requires refresher training for operators at least every three years and requires the employer to prepare a record identifying each trained employee, the date of training, and the means used to verify the employee understood it (OSHA, 2016). The roster of qualified operators therefore exists as a legal obligation."),
      body("Food safety provides a second instance. Under the United States Food and Drug Administration's preventive controls framework, a facility's written food safety plan must be prepared, or its preparation overseen, by a preventive controls qualified individual, although the agency mandates no specific certificate and permits qualification through job experience (FDA, n.d.). In both cases, a deployment of SkillSight would read an existing record rather than request a new one."),
      h2("Organizational Context"),
      body("Schwan's Company is headquartered in Marshall, Minnesota, and operates as a subsidiary of CJ CheilJedang, describing itself as a United States affiliate of CJ Foods (Schwan's Company, n.d.-a). Its careers materials describe more than a dozen United States facilities and four career areas, which this study adopts unchanged as its job groups: Manufacturing and Logistics, Retail Sales and Distribution, Foodservice Sales, and Corporate (Schwan's Company, n.d.-b)."),
      body("Two current business drivers shape the demonstration scenario. The company is constructing a 700,000 square foot Asian-style food production facility in Sioux Falls, South Dakota, expected to create more than 600 plant positions and 50 office positions and to open in 2027 (Schwan's Company, 2024). Separately, its Salina, Kansas pizza plant completed a 400,000 square foot expansion in 2023 that created 225 jobs (Kansas Department of Commerce, 2023). The acquisition by CJ CheilJedang expanded that group's United States production base from five sites to 22 (CJ CheilJedang, 2019), and CJ Foods relocated its United States headquarters to La Palma, California, in 2023 (Orange County Business Journal, 2023). Each of these facts appears in the tool as the stated reason a future skill target exists."),

      /* ===== method ===== */
      h1("Method"),
      h2("Design Approach"),
      body("Three interface designs were built and discarded before the final structure was adopted. The first presented a risk matrix and multiple charts; the second used a master-detail layout with a data list in a left-hand column; the third grouped every skill into a single long table. Each was rejected for the same reason: the viewer could see the data but could not determine what to do about it."),
      body("The final design allocates one page to each question in the prompt, in the order the prompt asks them, and adds a sixth page presenting the same data from the employee's perspective. Navigation, data provenance, and demonstration disclaimers are stated on screen rather than in documentation."),
      h2("Data Model"),
      body("The demonstration dataset contains 20 skills distributed across the four job groups, each with a coverage percentage representing the share of that job group holding the skill; six succession risk records carrying a site, a headcount, an impact rating from 1 to 5, and an explanatory note; five future skill targets tied to business drivers; ten recommended first steps and sixteen alternative development actions; three sample employee profiles; and a provenance record for each skill naming the systems a real deployment would read. Appendix A gives the full data dictionary."),
      h2("Prioritization Score"),
      body("The scoring model is deliberately simple, on the basis that a model a manager cannot explain is a model a manager will not trust. Each at-risk skill receives a score as the product of three normalized terms: business impact divided by five; scarcity, expressed as three divided by the number of holders, so that a single holder scores 3.0 and three holders score 1.0; and a gap term of 0.4 plus the proportion of the job group that does not hold the skill. The formula is displayed in the interface. Appendix B works the calculation for the highest ranked item."),
      h2("Verification"),
      body("Because the application manages state across six pages and five lists, manual testing proved unreliable; a defect in which plans saved from one list were invisible in another survived several rounds of clicking. A verification script was therefore written that renders every page in a stub document object model and asserts four properties: that every clickable row opens a page that renders without undefined values; that every skill page contains either a development plan or an explicit statement of why none exists; that a plan started from any list becomes visible in every other list containing that skill, across 42 combinations; and that the underlying data obeys the rule the interface states on screen. Appendix D reports the coverage of that script."),
      h2("Fact Verification Procedure"),
      body("All external claims were audited in three passes: inventory of every factual assertion in the code and documents, verification of each against a primary or authoritative source, and correction of the application. Three claims were removed because they could be traced only to vendor blogs or syndicated content, and one factual error was corrected, namely the characterization of the Sioux Falls facility as a pizza plant rather than an Asian-style food plant. Appendix C reproduces the audit."),

      /* ===== results ===== */
      h1("Results"),
      body("The demonstration dataset produces an average coverage of 50% across the 20 tracked skills. Table 1 reports the distribution by coverage band. Seven skills fall below the 40% threshold the interface treats as a critical gap."),
      ...apaTable(1, "Distribution of Tracked Skills by Coverage Band",
        "Coverage represents the simulated share of a job group holding the skill. Band thresholds are set by the application.",
        [{ label: "Coverage band", w: 3000 }, { label: "Skills", w: 1200, align: AlignmentType.CENTER },
         { label: "Range", w: 2000 }, { label: "Lowest in band", w: 3160 }],
        [["Critical gap", 7, "Below 40%", "Salina line setup, 12%"],
         ["Needs attention", 6, "40% to 59%", "Data analytics, 41%"],
         ["Well covered", 7, "60% and above", "Customer relationship management, 58%"]]),
      blank(),
      body("Table 2 reports the six skills identified as succession risks, each held by three people or fewer. One is held by a single individual."),
      ...apaTable(2, "Skills Held by Three People or Fewer",
        "Headcounts are simulated. Locations and the regulatory basis for the ammonia record are factual; see OSHA (2016).",
        [{ label: "Skill", w: 3400 }, { label: "Holders", w: 1200, align: AlignmentType.CENTER },
         { label: "Impact", w: 1200, align: AlignmentType.CENTER }, { label: "Location", w: 3560 }],
        [["R&D, frozen dough formulation", 1, "4 of 5", "Marshall, MN, R&D centre"],
         ["Ammonia refrigeration", 2, "5 of 5", "Marshall, MN, ice cream plant"],
         ["Food labeling compliance", 2, "5 of 5", "Hopkins, MN, corporate"],
         ["Salina line configuration", 2, "4 of 5", "Salina, KS, pizza plant"],
         ["PLC automation programming", 3, "4 of 5", "Salina, KS, pizza plant"],
         ["Menu and culinary consulting", 3, "3 of 5", "Field, national"]]),
      blank(),
      body("Table 3 reports the five future skill targets, each attached to a documented business driver rather than to a general expectation about technology."),
      ...apaTable(3, "Future Skill Targets and Their Business Drivers",
        "Current and target coverage are simulated. Drivers are sourced; see Schwan's Company (2024) and CJ CheilJedang (2019).",
        [{ label: "Skill", w: 3200 }, { label: "Now", w: 900, align: AlignmentType.CENTER },
         { label: "2027", w: 900, align: AlignmentType.CENTER }, { label: "Driver", w: 4360 }],
        [["Legal and compliance", "20%", "55%", "CJ CheilJedang integration increases labeling load"],
         ["PLC and automation", "34%", "65%", "Sioux Falls facility opens in 2027"],
         ["Data analytics", "41%", "70%", "Demand forecasting rollout"],
         ["Refrigeration and ammonia", "22%", "50%", "Frozen capacity expansion"],
         ["Menu and culinary consulting", "29%", "55%", "K-12 and healthcare account growth"]]),
      blank(),
      body("Table 4 reports the distribution of recommended development actions across the five methods named in the prompt. Every method is represented, and no skill carries a recommendation without a stated first step."),
      ...apaTable(4, "Development Actions by Method",
        "Counts include ten primary first steps and sixteen alternative actions.",
        [{ label: "Method", w: 3200 }, { label: "Actions", w: 1400, align: AlignmentType.CENTER }, { label: "Example", w: 4760 }],
        [["Training", 8, "Vendor-led controls course for maintenance staff"],
         ["Mentoring", 6, "Sole subject matter expert pairs with two mentees"],
         ["Project experience", 5, "Technicians join the Sioux Falls commissioning team"],
         ["Certification", 4, "Sponsored ammonia refrigeration certification"],
         ["Job rotation", 3, "Rotation through the Salina automation lines"]]),
      blank(),
      body("Figure 1 shows the overview page, which combines the four summary measures, the ranked order of work, and the lowest coverage skills on a single screen."),

      /* ===== discussion ===== */
      h1("Discussion"),
      h2("Interpretation"),
      body("The ranked list is the substantive result. Frozen dough formulation ranks first not because its coverage is lowest, which it is not, but because the scarcity term dominates when a single individual holds the skill. This is the behaviour a succession planning instrument should exhibit, and it distinguishes the output from a sorted list of coverage percentages."),
      h2("Limitations"),
      body("Three limitations qualify every result above. First, coverage percentages, per-site headcounts, and employee records are simulated; only the organizational context and regulatory framework are sourced. Second, the assumed workforce of 8,500 is an estimate rather than a published figure, since the company does not publish a headcount and third-party profiles disagree substantially. Third, persistence is implemented in browser local storage keyed by skill rather than by person, so the demonstration cannot represent two employees pursuing the same development plan."),
      body("A further limitation concerns the scoring weights. The constants that normalize impact and scarcity were chosen by the author on judgement and are not empirically derived. In a deployment these would be configurable by a human resources leader rather than fixed by a developer."),
      h2("Ethical Considerations"),
      body("A skills instrument becomes a ranking of people if it is permitted to. Two design constraints mitigate that risk. The application holds only skills and training data, never performance or disciplinary content, and the employee view presents an individual with their own record and their own development plan rather than presenting a comparison against peers. Two sources of bias should nevertheless be acknowledged: coverage data reflects who was recorded as trained, which systematically under-represents informally acquired skills, and impact ratings encode the priorities of whoever sets them. Displaying the inputs alongside the score, as the interface does, is a partial mitigation rather than a solution."),
      h2("Future Work"),
      body("Three extensions follow directly from the limitations. Connecting the tool to a human resources information system would replace simulated coverage with observed records. Modelling development plans as records with an owner, a date, and a status would replace browser storage. Matching employees to plans automatically, using the skills they already hold as the basis for adjacency, would replace the current fixed recommendation per skill. A fourth extension, suggested by the event's hardware track, would read a badge at a plant entrance and present that employee's development plan on a local display."),

      /* ===== conclusion ===== */
      h1("Conclusion"),
      body("SkillSight demonstrates that the useful output of a skills intelligence system is an order of work rather than a display of data. The tool answers the five questions of the prompt in the order they are asked, states on screen which of its numbers are simulated, names the operational systems a real deployment would read, and ranks its findings using a formula a manager can inspect. It is deliberately small: four files, no framework, no build step, and no network dependency. The verification script and the fact audit are included in the repository so that both the software behaviour and the factual claims can be checked independently."),

      /* ===== references ===== */
      new Paragraph({ children: [new PageBreak()] }),
      plainHead("References"),
      ref([{ text: "CJ CheilJedang. (2019). " },
           { text: "CJ CheilJedang acquires major US food firm Schwan's Company, securing future growth engine to become a leading global top food company", italics: true },
           { text: " [Press release]. https://www.cj.co.kr/en/newsroom/pressreleases/news-detail/1283" }]),
      ref([{ text: "Deloitte & The Manufacturing Institute. (n.d.). " },
           { text: "2.1 million manufacturing jobs could go unfilled by 2030", italics: true },
           { text: ". The Manufacturing Institute. Retrieved September 13, 2026, from https://themanufacturinginstitute.org/2-1-million-manufacturing-jobs-could-go-unfilled-by-2030-11330/" }]),
      ref([{ text: "International Institute of Ammonia Refrigeration. (n.d.). " },
           { text: "The technician shortage", italics: true },
           { text: ". IIAR Condenser. Retrieved September 13, 2026, from https://iiarcondenser.org/the-technician-shortage/" }]),
      ref([{ text: "Kansas Department of Commerce. (2023, May). " },
           { text: "Governor Kelly congratulates Schwan's for completion of major pizza plant expansion in Salina creating 225 jobs", italics: true },
           { text: ". https://www.kansascommerce.gov/2023/05/governor-kelly-congratulates-schwans-for-completion-of-major-pizza-plant-expansion-in-salina-creating-225-jobs/" }]),
      ref([{ text: "Occupational Safety and Health Administration. (2016, July 21). " },
           { text: "Process safety management of highly hazardous chemicals and covered concentrations of listed appendix A chemicals", italics: true },
           { text: " [Standard interpretation]. United States Department of Labor. https://www.osha.gov/laws-regs/standardinterpretations/2016-07-21" }]),
      ref([{ text: "Orange County Business Journal. (2023). " },
           { text: "CJ Foods follows Fullerton plant with new HQ in La Palma", italics: true },
           { text: ". https://www.ocbj.com/real-estate/cj-foods-follows-fullerton-plant-new-hq-la-palma/" }]),
      ref([{ text: "Schwan's Company. (n.d.-a). " },
           { text: "About us", italics: true },
           { text: ". Retrieved September 13, 2026, from https://www.schwanscompany.com/about-us/" }]),
      ref([{ text: "Schwan's Company. (n.d.-b). " },
           { text: "Careers", italics: true },
           { text: ". Retrieved September 13, 2026, from https://www.schwansjobs.com/" }]),
      ref([{ text: "Schwan's Company. (2024, May). " },
           { text: "Schwan's Company and State of South Dakota announce future investments in Sioux Falls to support new food production facility", italics: true },
           { text: " [Press release]. PR Newswire. https://www.prnewswire.com/news-releases/schwans-company-and-state-of-south-dakota-announce-future-investments-in-sioux-falls-to-support-new-food-production-facility-302159947.html" }]),
      ref([{ text: "United States Food and Drug Administration. (n.d.). " },
           { text: "Frequently asked questions on FSMA", italics: true },
           { text: ". Retrieved September 13, 2026, from https://www.fda.gov/food/food-safety-modernization-act-fsma/frequently-asked-questions-fsma" }]),

      /* ===== appendices ===== */
      new Paragraph({ children: [new PageBreak()] }),
      h1("Appendix A"),
      plainHead("Data Dictionary"),
      body("The demonstration dataset is a single JavaScript object. Its fields are as follows.", { noIndent: true }),
      bullet("segments: four job groups, each with a name, an assumed size, and a list of skills with coverage percentages."),
      bullet("successionRisks: six records with skill, segment, location, headcount, impact from 1 to 5, and an explanatory note."),
      bullet("futureSkills: five records with current coverage, target coverage for 2027, and the business driver."),
      bullet("recommendedActions: ten primary development actions keyed by skill, each with a method and a detail."),
      bullet("alternateActions: sixteen alternative actions, grouped by skill, used where a primary action exists."),
      bullet("employees: three sample profiles with role, site, tenure, skills held, and skills in progress."),
      bullet("dataSources: provenance for each skill, naming the operational systems a real deployment would read, with regulatory citations where they apply."),
      bullet("demoNotes: the on-screen statement of assumptions and the list of ten external sources."),

      new Paragraph({ children: [new PageBreak()] }),
      h1("Appendix B"),
      plainHead("Worked Example of the Prioritization Score"),
      body("The score for a skill is the product of impact, scarcity, and gap terms. For frozen dough formulation, which ranks first in the demonstration data:", { noIndent: true }),
      body("impact = 4 of 5 = 0.80", { noIndent: true }),
      body("scarcity = 3 divided by 1 holder = 3.00", { noIndent: true }),
      body("gap = 0.4 plus (100 minus 18) divided by 100 = 1.22", { noIndent: true }),
      body("score = 0.80 x 3.00 x 1.22 = 2.93", { noIndent: true }),
      body("For PLC automation programming, which ranks fifth: impact 0.80, scarcity 3 divided by 3 holders = 1.00, gap 0.4 plus 0.66 = 1.06, giving a score of 0.85. The ratio of roughly 3.4 to 1 between the two reflects the scarcity term, which is the intended behaviour of the model.", { noIndent: true }),

      new Paragraph({ children: [new PageBreak()] }),
      h1("Appendix C"),
      plainHead("Fact Verification Audit"),
      body("Every external claim was checked against a primary or authoritative source. The table below summarizes the outcome. The full audit, with links, is maintained in the repository as FACTS.md.", { noIndent: true }),
      ...apaTable("C1", "Outcome of the Three-Pass Fact Check",
        "Sources were limited to company publications, a state government release, federal regulators, and an industry association.",
        [{ label: "Claim", w: 4600 }, { label: "Outcome", w: 2000 }, { label: "Basis", w: 2760 }],
        [["Four job groups and facility count", "Verified", "Schwan's Company (n.d.-b)"],
         ["Sioux Falls plant type, size, jobs, year", "Corrected", "Schwan's Company (2024)"],
         ["Salina expansion and job creation", "Verified", "Kansas Department of Commerce (2023)"],
         ["Ammonia PSM threshold and records", "Verified", "OSHA (2016)"],
         ["Preventive controls qualified individual", "Verified", "FDA (n.d.)"],
         ["Skills gap of 2.1 million by 2030", "Verified", "Deloitte & The Manufacturing Institute (n.d.)"],
         ["Ageing of the skilled trades", "Verified", "IIAR (n.d.)"],
         ["Workforce of about 8,500", "Assumption", "Company publishes no headcount"],
         ["Average ammonia technician age of 55", "Removed", "Traceable only to vendor blogs"],
         ["Maintenance understaffing survey", "Removed", "Vendor survey via syndicated content"],
         ["La Palma as a corporate office", "Corrected", "Orange County Business Journal (2023)"]]),

      new Paragraph({ children: [new PageBreak()] }),
      h1("Appendix D"),
      plainHead("Verification Script Coverage"),
      body("The script at verify.js renders every page in a stub document object model and asserts the following. All assertions passed at the time of submission.", { noIndent: true }),
      ...apaTable("D1", "Assertions Executed by the Verification Script",
        "The script reports a pass or the identity of the failing page and skill.",
        [{ label: "Assertion", w: 6200 }, { label: "Cases", w: 1400, align: AlignmentType.CENTER }, { label: "Result", w: 1760 }],
        [["Every clickable row opens a page with no undefined values", "23", "Pass"],
         ["Every skill page states a plan or why none exists", "23", "Pass"],
         ["Every skill page names its data provenance", "23", "Pass"],
         ["A started plan is visible in every list containing that skill", "42", "Pass"],
         ["Previous and next navigation is correct at each position", "42", "Pass"],
         ["Employee profiles reflect their own started plans", "5", "Pass"],
         ["Data obeys the plan rule stated in the interface", "20", "Pass"]])
    ]
  }]
});

Packer.toBuffer(doc).then(b => { fs.writeFileSync(OUT, b); console.log("written", OUT); });
