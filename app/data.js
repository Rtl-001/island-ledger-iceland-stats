// The Island Ledger — every figure the site shows, with its source and year.
// Values are published statistics rounded for reading; nothing is fetched.

const HEADLINE_STATS = [
  { value: "387,758", label: "Residents", note: "1 January 2024 · Statistics Iceland" },
  { value: "$85,863", label: "GDP per person", note: "2024 · World Bank" },
  { value: "83.0 years", label: "Life expectancy", note: "2023 · Statistics Iceland" },
  { value: "~100%", label: "Renewable electricity", note: "2023 · National Energy Authority" },
  { value: "3.6%", label: "Unemployment", note: "2024 · Statistics Iceland" },
  { value: "5.9%", label: "Inflation", note: "2024 average · Statistics Iceland" },
  { value: "1.6", label: "Children per woman", note: "Fertility rate, 2023 · Statistics Iceland" },
  { value: "2.26 million", label: "Foreign visitors", note: "2024 · Icelandic Tourist Board" }
];

// Denominator for the per-person converter: the headline resident count.
const RESIDENTS_2024 = 387758;

// Converter presets: published totals the visitor can rescale per resident.
const CONVERTER_PRESETS = [
  { label: "Visitors 2024", total: 2260000, unit: "visitors" },
  { label: "Births 2023", total: 4700, unit: "births" },
  { label: "Students 2023–24", total: 111500, unit: "students" }
];

const POPULATION_SERIES = [
  { year: 2015, thousands: 329 },
  { year: 2016, thousands: 335 },
  { year: 2017, thousands: 339 },
  { year: 2018, thousands: 348 },
  { year: 2019, thousands: 357 },
  { year: 2020, thousands: 364 },
  { year: 2021, thousands: 369 },
  { year: 2022, thousands: 376 },
  { year: 2023, thousands: 382 },
  { year: 2024, thousands: 388 }
];

const PEOPLE_STATS = [
  { value: "36.6 years", label: "Median age", note: "2024 · Statistics Iceland" },
  { value: "1.6", label: "Children per woman", note: "Fertility rate, 2023 · Statistics Iceland" },
  { value: "18%", label: "Born abroad", note: "Share of residents, 2024 · Statistics Iceland" },
  { value: "3.8", label: "People per km²", note: "Whole island, 2024 · computed from land area" },
  { value: "+12,100", label: "Population balance", note: "2023 · births − deaths + net migration, computed" },
  { value: "67", label: "Dependants per 100", note: "Ages 0–19 & 65+ per 100 aged 20–64 · computed from 2024 shares" }
];

const AGE_SHARES = [
  { label: "0–19", share: 25 },
  { label: "20–39", share: 29 },
  { label: "40–64", share: 31 },
  { label: "65+", share: 15 }
];

const VITAL_2023 = [
  { label: "Births", count: 4700 },
  { label: "Deaths", count: 2400 },
  { label: "Net migration", count: 7200 }
];

const ECONOMY_STATS = [
  { value: "3.6%", label: "Unemployment", note: "2024 · Statistics Iceland labour survey" },
  { value: "5.9%", label: "Inflation", note: "Consumer prices, 2024 average · Statistics Iceland" },
  { value: "2.26 million", label: "Foreign visitors", note: "2024 · Icelandic Tourist Board" },
  { value: "81%", label: "In work or seeking it", note: "Ages 16–74, 2024 · Statistics Iceland" },
  { value: "5.8", label: "Visitors per resident", note: "2024 · arrivals ÷ residents, computed" }
];

// GDP per person in thousands of US dollars, with the year's average
// króna-per-dollar rate so the króna view converts the same figures.
const GDP_SERIES = [
  { year: 2015, usdThousands: 51, iskPerUsd: 131 },
  { year: 2016, usdThousands: 60, iskPerUsd: 121 },
  { year: 2017, usdThousands: 70, iskPerUsd: 106 },
  { year: 2018, usdThousands: 73, iskPerUsd: 109 },
  { year: 2019, usdThousands: 67, iskPerUsd: 124 },
  { year: 2020, usdThousands: 60, iskPerUsd: 137 },
  { year: 2021, usdThousands: 69, iskPerUsd: 127 },
  { year: 2022, usdThousands: 74, iskPerUsd: 138 },
  { year: 2023, usdThousands: 85, iskPerUsd: 139 },
  { year: 2024, usdThousands: 86, iskPerUsd: 138 }
];

const EXPORT_SHARES = [
  { label: "Tourism services", share: 39 },
  { label: "Marine products", share: 24 },
  { label: "Aluminium & metals", share: 17 },
  { label: "Other goods", share: 12 },
  { label: "Other services", share: 8 }
];

const VISITOR_SERIES = [
  { year: 2015, millions: 1.26 },
  { year: 2016, millions: 1.77 },
  { year: 2017, millions: 2.22 },
  { year: 2018, millions: 2.34 },
  { year: 2019, millions: 2.01 },
  { year: 2020, millions: 0.49 },
  { year: 2021, millions: 0.70 },
  { year: 2022, millions: 1.70 },
  { year: 2023, millions: 2.24 },
  { year: 2024, millions: 2.26 }
];

const HEALTH_STATS = [
  { value: "83.0 years", label: "Life expectancy", note: "At birth, 2023 · Statistics Iceland" },
  { value: "1.6", label: "Infant deaths", note: "Per 1,000 live births, 2022 · Statistics Iceland" },
  { value: "3.9", label: "Doctors", note: "Per 1,000 residents, 2022 · OECD" },
  { value: "9.4%", label: "Health spending", note: "Share of GDP, 2022 · OECD" },
  { value: "2.8 years", label: "Women–men gap", note: "Life expectancy, 2023 · computed from life tables" }
];

const LIFE_EXPECTANCY = [
  { label: "Women", years: 84.4 },
  { label: "Everyone", years: 83.0 },
  { label: "Men", years: 81.6 }
];

const EDUCATION_STATS = [
  { value: "44%", label: "Adults with a degree", note: "Ages 25–64, 2023 · OECD" },
  { value: "99%", label: "Literacy", note: "Adults, 2023 · UNESCO" },
  { value: "10 years", label: "Compulsory school", note: "Ages 6–16 · Ministry of Education" },
  { value: "3,100", label: "Students abroad", note: "2023 · Statistics Iceland" },
  { value: "111,500", label: "Students in all", note: "2023–24 · sum of levels below, computed" }
];

const STUDENT_LEVELS = [
  { label: "Pre-primary", students: 19500 },
  { label: "Compulsory", students: 46000 },
  { label: "Upper secondary", students: 25000 },
  { label: "Tertiary", students: 21000 }
];

const LAND_STATS = [
  { value: "103,125 km²", label: "Land area", note: "National Land Survey of Iceland" },
  { value: "11%", label: "Under glaciers", note: "Share of land · Icelandic Met Office" },
  { value: "2,110 m", label: "Highest peak", note: "Hvannadalshnjúkur · National Land Survey" },
  { value: "~32", label: "Active volcanic systems", note: "Icelandic Met Office" },
  { value: "11,300 km²", label: "Glacier area", note: "Computed: 11% of land area" }
];

const POWER_MIX = [
  { label: "Hydropower", share: 70 },
  { label: "Geothermal", share: 30 }
];

const CO2_SERIES = [
  { year: 2015, tonnes: 8.1 },
  { year: 2016, tonnes: 8.4 },
  { year: 2017, tonnes: 8.8 },
  { year: 2018, tonnes: 9.2 },
  { year: 2019, tonnes: 8.9 },
  { year: 2020, tonnes: 8.3 },
  { year: 2021, tonnes: 8.5 },
  { year: 2022, tonnes: 8.7 }
];

const REGIONS = [
  { name: "Capital Region", population: 248000, areaKm2: 1062 },
  { name: "Southern Peninsula", population: 32500, areaKm2: 829 },
  { name: "South", population: 31500, areaKm2: 24256 },
  { name: "Northeast", population: 31000, areaKm2: 22721 },
  { name: "West", population: 17300, areaKm2: 9554 },
  { name: "East", population: 11300, areaKm2: 22721 },
  { name: "Westfjords", population: 7400, areaKm2: 9409 },
  { name: "Northwest", population: 7300, areaKm2: 12737 }
];

const INDICATORS = [
  { name: "Per-person converter", page: "overview", detail: "Rescale any total per resident" },
  { name: "Population", page: "people", detail: "387,758 residents, 2024" },
  { name: "Age structure", page: "people", detail: "Shares by age band, 2024" },
  { name: "Fertility", page: "people", detail: "1.6 children per woman, 2023" },
  { name: "Population balance", page: "people", detail: "+12,100 in 2023, computed" },
  { name: "GDP per person", page: "economy", detail: "$85,863, 2024" },
  { name: "Tourism visitors", page: "economy", detail: "2.26 million arrivals, 2024" },
  { name: "Visitors per resident", page: "economy", detail: "5.8, 2024, computed" },
  { name: "Unemployment", page: "economy", detail: "3.6%, 2024" },
  { name: "Inflation", page: "economy", detail: "5.9%, 2024 average" },
  { name: "Exports mix", page: "economy", detail: "Tourism, fish and aluminium, 2023" },
  { name: "Life expectancy", page: "health", detail: "83.0 years, 2023" },
  { name: "Doctors per 1,000", page: "health", detail: "3.9, 2022" },
  { name: "University degrees", page: "education", detail: "44% of adults 25–64, 2023" },
  { name: "Students by level", page: "education", detail: "111,500 in all, 2023–24" },
  { name: "Glaciers", page: "land", detail: "11% of the land, ≈11,300 km²" },
  { name: "Electricity sources", page: "land", detail: "Hydro 70%, geothermal 30%, 2023" },
  { name: "Carbon dioxide", page: "land", detail: "8.7 tonnes per person, 2022" },
  { name: "Regional population", page: "regions", detail: "Eight regions, 2024" },
  { name: "Sources and methods", page: "notes", detail: "Where every figure comes from" }
];
