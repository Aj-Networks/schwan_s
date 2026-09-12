// Tab switching
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

function coverageColor(pct) {
  // low coverage = red (gap), high coverage = green
  const hue = Math.round((pct / 100) * 120); // 0 = red, 120 = green
  return `hsl(${hue}, 65%, 40%)`;
}

function renderHeatmap() {
  const container = document.getElementById("heatmap-container");
  const table = document.createElement("table");

  SKILLSIGHT_DATA.segments.forEach(segment => {
    const heading = document.createElement("tr");
    heading.innerHTML = `<th colspan="2">${segment.name}</th>`;
    table.appendChild(heading);

    segment.skills.forEach(s => {
      const row = document.createElement("tr");
      const skillCell = document.createElement("td");
      skillCell.textContent = s.skill;

      const heatCell = document.createElement("td");
      heatCell.textContent = s.coverage + "%";
      heatCell.className = "heat-cell";
      heatCell.style.background = coverageColor(s.coverage);

      row.appendChild(skillCell);
      row.appendChild(heatCell);
      table.appendChild(row);
    });
  });

  container.appendChild(table);
}

function renderGaps() {
  const container = document.getElementById("gaps-container");
  const gaps = [];

  SKILLSIGHT_DATA.segments.forEach(segment => {
    segment.skills.forEach(s => {
      if (s.coverage < 40) {
        gaps.push({ segment: segment.name, skill: s.skill, coverage: s.coverage });
      }
    });
  });

  gaps.sort((a, b) => a.coverage - b.coverage);

  gaps.forEach(g => {
    const card = document.createElement("div");
    card.className = "risk-card";
    card.innerHTML = `
      <h3>${g.skill}</h3>
      <div class="meta">${g.segment} • ${g.coverage}% coverage</div>
    `;
    container.appendChild(card);
  });
}

function renderRisks() {
  const container = document.getElementById("risk-container");
  SKILLSIGHT_DATA.successionRisks.forEach(r => {
    const card = document.createElement("div");
    card.className = "risk-card";
    card.innerHTML = `
      <h3>${r.skill}</h3>
      <div class="meta">${r.location} • ${r.headcount} people hold this skill</div>
      <div>${r.note}</div>
    `;
    container.appendChild(card);
  });
}

function renderPlants() {
  const container = document.getElementById("plants-container");
  const grid = document.createElement("div");
  grid.className = "plant-grid";
  SKILLSIGHT_DATA.plants.forEach(p => {
    const chip = document.createElement("div");
    chip.className = "plant-chip";
    chip.textContent = p;
    grid.appendChild(chip);
  });
  container.appendChild(grid);
}

renderHeatmap();
renderGaps();
renderRisks();
renderPlants();
