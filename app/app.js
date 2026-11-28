// The Island Ledger — page routing, rendering and controls.
// Hash routes: #overview #people #economy #health #education #land #regions #notes

const ROUTES = ["overview", "people", "economy", "health", "education", "land", "regions", "notes"];

function statCards(stats) {
  return stats
    .map(
      (stat) =>
        `<article class="stat-card"><div class="stat-value">${stat.value}</div>` +
        `<div class="stat-label">${stat.label}</div><div class="stat-note">${stat.note}</div></article>`
    )
    .join("");
}

function fillStats(elementId, stats) {
  document.getElementById(elementId).innerHTML = statCards(stats);
}

function drawPopulation(range) {
  const rows = range === "recent" ? POPULATION_SERIES.slice(-5) : POPULATION_SERIES;
  document.getElementById("chart-population").innerHTML = lineChart(
    rows.map((row) => ({ label: String(row.year), value: row.thousands })),
    {
      title: "Population of Iceland by year, thousands",
      color: "#14586b",
      floorZero: false,
      formatTick: (value) => `${Math.round(value)}k`,
      formatValue: (value) => `${Math.round(value)},000`
    }
  );
}

function drawGdp(unit) {
  const rows = GDP_SERIES.map((row) => ({
    label: String(row.year),
    value: unit === "isk" ? (row.usdThousands * row.iskPerUsd) / 1000 : row.usdThousands
  }));
  document.getElementById("chart-gdp").innerHTML = barChart(rows, {
    title: "GDP per person by year",
    color: "#14586b",
    formatTick: (value) => (unit === "isk" ? value.toFixed(0) : `$${Math.round(value)}k`),
    formatValue: (value) => (unit === "isk" ? `${value.toFixed(1)}m` : `$${Math.round(value)}k`)
  });
}

function drawMiniCharts() {
  document.getElementById("chart-pop-mini").innerHTML = sparkChart(
    POPULATION_SERIES.map((row) => ({ label: String(row.year), value: row.thousands })),
    {
      title: "Population of Iceland 2015 to 2024, thousands",
      color: "#14586b",
      floorZero: false,
      formatValue: (value) => `${Math.round(value)}k`
    }
  );
  document.getElementById("chart-visitors-mini").innerHTML = sparkChart(
    VISITOR_SERIES.map((row) => ({ label: String(row.year), value: row.millions })),
    {
      title: "Foreign visitors 2015 to 2024, millions",
      color: "#c25e3a",
      floorZero: true,
      formatValue: (value) => `${value.toFixed(2)}m`
    }
  );
  document.getElementById("chart-power-mini").innerHTML = stackedBar(POWER_MIX, {
    title: "Electricity generation by source, 2023"
  });
  document.getElementById("chart-exports-mini").innerHTML = shareBars(
    EXPORT_SHARES.map((row) => ({ label: row.label.replace(" services", "").replace(" & metals", ""), share: row.share })),
    { title: "Shares of exports of goods and services, 2023" }
  );
}

const converterState = { unit: "visitors" };

function formatConverterNumber(value) {
  if (!Number.isFinite(value) || value < 0) return "—";
  if (value >= 1000) return Math.round(value).toLocaleString("en-GB");
  if (value >= 10) return value.toFixed(1);
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(3);
}

function updateConverter() {
  const input = document.getElementById("converter-total");
  const total = Number(input.value);
  const perResident = total / RESIDENTS_2024;
  document.getElementById("converter-per").textContent = formatConverterNumber(perResident);
  document.getElementById("converter-per-label").textContent = `${converterState.unit} per resident`;
  document.getElementById("converter-per1000").textContent = formatConverterNumber(perResident * 1000);
  document.getElementById("converter-oneper").textContent =
    total > 0 ? `1 per ${formatConverterNumber(RESIDENTS_2024 / total)}` : "—";
}

function wireConverter() {
  const input = document.getElementById("converter-total");
  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = CONVERTER_PRESETS[Number(button.dataset.preset)];
      document.querySelectorAll("[data-preset]").forEach((other) => other.classList.remove("is-active"));
      button.classList.add("is-active");
      converterState.unit = preset.unit;
      input.value = String(preset.total);
      updateConverter();
    });
  });
  input.addEventListener("input", () => {
    document.querySelectorAll("[data-preset]").forEach((other) => other.classList.remove("is-active"));
    converterState.unit = "units";
    updateConverter();
  });
  updateConverter();
}

function drawStaticCharts() {
  document.getElementById("chart-age").innerHTML = barChart(
    AGE_SHARES.map((row) => ({ label: row.label, value: row.share })),
    {
      title: "Share of population by age band, percent",
      colorAt: (index) => CHART_COLORS[index % CHART_COLORS.length],
      formatTick: (value) => `${Math.round(value)}%`,
      formatValue: (value) => `${value}%`
    }
  );
  document.getElementById("chart-vital").innerHTML = barChart(
    VITAL_2023.map((row) => ({ label: row.label, value: row.count })),
    {
      title: "Births, deaths and net migration in 2023",
      colorAt: (index) => CHART_COLORS[index % CHART_COLORS.length],
      formatTick: (value) => `${Math.round(value / 1000)}k`,
      formatValue: (value) => value.toLocaleString("en-GB")
    }
  );
  document.getElementById("chart-exports").innerHTML = donutChart(EXPORT_SHARES, {
    title: "Shares of exports of goods and services, 2023",
    centerTop: "2023",
    centerBottom: "all exports"
  });
  document.getElementById("chart-visitors").innerHTML = lineChart(
    VISITOR_SERIES.map((row) => ({ label: String(row.year), value: row.millions })),
    {
      title: "Foreign visitors through Keflavík airport, millions",
      color: "#c25e3a",
      floorZero: true,
      formatTick: (value) => value.toFixed(1),
      formatValue: (value) => `${value.toFixed(2)}m`
    }
  );
  document.getElementById("chart-life").innerHTML = hbarChart(
    LIFE_EXPECTANCY.map((row) => ({ label: row.label, value: row.years })),
    {
      title: "Life expectancy at birth, 2023",
      colorAt: (index) => CHART_COLORS[index % CHART_COLORS.length],
      formatValue: (value) => `${value.toFixed(1)} yrs`
    }
  );
  document.getElementById("chart-students").innerHTML = barChart(
    STUDENT_LEVELS.map((row) => ({ label: row.label, value: row.students })),
    {
      title: "Students by level, school year 2023-24",
      colorAt: (index) => CHART_COLORS[index % CHART_COLORS.length],
      formatTick: (value) => `${Math.round(value / 1000)}k`,
      formatValue: (value) => value.toLocaleString("en-GB")
    }
  );
  document.getElementById("chart-power").innerHTML = donutChart(POWER_MIX, {
    title: "Electricity generation by source, 2023",
    centerTop: "~100%",
    centerBottom: "renewable"
  });
  document.getElementById("chart-co2").innerHTML = lineChart(
    CO2_SERIES.map((row) => ({ label: String(row.year), value: row.tonnes })),
    {
      title: "Carbon dioxide per resident, tonnes",
      color: "#5d7a4e",
      floorZero: false,
      formatTick: (value) => value.toFixed(1),
      formatValue: (value) => `${value.toFixed(1)} t`
    }
  );
  document.getElementById("chart-regions").innerHTML = hbarChart(
    REGIONS.map((region) => ({
      label: region.name,
      value: Math.round((region.population / 387758) * 1000) / 10
    })),
    {
      title: "Share of national population by region, percent",
      colorAt: (index) => CHART_COLORS[index % CHART_COLORS.length],
      formatValue: (value) => `${value.toFixed(1)}%`
    }
  );
}

function renderIndicators(query) {
  const needle = query.trim().toLowerCase();
  const matches = INDICATORS.filter(
    (item) => needle === "" || item.name.toLowerCase().includes(needle) || item.detail.toLowerCase().includes(needle)
  );
  document.getElementById("indicator-list").innerHTML = matches
    .map(
      (item) =>
        `<li><a href="#${item.page}">${item.name}</a><span class="indicator-meta">${item.detail}</span></li>`
    )
    .join("");
  document.getElementById("indicator-count").textContent =
    matches.length === INDICATORS.length
      ? `${matches.length} indicators. Select one to jump to its page.`
      : `${matches.length} of ${INDICATORS.length} indicators match “${query.trim()}”.`;
}

const regionState = { sortKey: "population", ascending: false, filter: "" };

function regionRows() {
  const total = REGIONS.reduce((sum, region) => sum + region.population, 0);
  const rows = REGIONS.map((region) => ({
    name: region.name,
    population: region.population,
    share: (region.population / total) * 100,
    density: region.population / region.areaKm2
  }));
  const needle = regionState.filter.trim().toLowerCase();
  const visible = rows.filter((row) => needle === "" || row.name.toLowerCase().includes(needle));
  visible.sort((a, b) => {
    const left = a[regionState.sortKey];
    const right = b[regionState.sortKey];
    const order = typeof left === "string" ? left.localeCompare(right) : left - right;
    return regionState.ascending ? order : -order;
  });
  return visible;
}

function renderRegions() {
  document.getElementById("region-rows").innerHTML = regionRows()
    .map(
      (row) =>
        `<tr><td>${row.name}</td><td>${row.population.toLocaleString("en-GB")}</td>` +
        `<td>${row.share.toFixed(1)}%</td><td>${row.density.toFixed(1)}</td></tr>`
    )
    .join("");
}

function showRoute() {
  const hash = window.location.hash.replace("#", "");
  const route = ROUTES.includes(hash) ? hash : "overview";
  ROUTES.forEach((name) => {
    document.getElementById(`page-${name}`).hidden = name !== route;
  });
  document.querySelectorAll(".mainnav a").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.route === route);
  });
  window.scrollTo(0, 0);
}

function wireControls() {
  document.querySelectorAll("[data-range]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-range]").forEach((other) => other.classList.remove("is-active"));
      button.classList.add("is-active");
      drawPopulation(button.dataset.range);
    });
  });
  document.querySelectorAll("[data-unit]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-unit]").forEach((other) => other.classList.remove("is-active"));
      button.classList.add("is-active");
      drawGdp(button.dataset.unit);
    });
  });
  document.getElementById("indicator-search").addEventListener("input", (event) => {
    renderIndicators(event.target.value);
  });
  document.getElementById("region-filter").addEventListener("input", (event) => {
    regionState.filter = event.target.value;
    renderRegions();
  });
  document.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.sort;
      if (regionState.sortKey === key) {
        regionState.ascending = !regionState.ascending;
      } else {
        regionState.sortKey = key;
        regionState.ascending = key === "name";
      }
      renderRegions();
    });
  });
  window.addEventListener("hashchange", showRoute);
}

fillStats("headline-stats", HEADLINE_STATS);
fillStats("people-stats", PEOPLE_STATS);
fillStats("economy-stats", ECONOMY_STATS);
fillStats("health-stats", HEALTH_STATS);
fillStats("education-stats", EDUCATION_STATS);
fillStats("land-stats", LAND_STATS);
drawPopulation("full");
drawGdp("usd");
drawMiniCharts();
wireConverter();
drawStaticCharts();
renderIndicators("");
renderRegions();
wireControls();
showRoute();
