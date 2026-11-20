import fs from "node:fs"
import path from "node:path"
import Papa from "papaparse"

export type HappinessRow = {
  country: string
  region: string
  score: number
  year: number
}
///////////
export type Row = {
  country: string
  region: string
  score: number
  gdp: number
  health: number
  corruption: number
  year: number
}

const toNum = (v: string) => parseFloat(v.replace(",", "."))
const num = (v: string | undefined) => parseFloat((v ?? "").replace(",", "."))
const round = (v: number, d = 2) => Number(v.toFixed(d))
const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / (xs.length || 1)



export function loadHappiness(): Row[] {
  const file = path.join(process.cwd(), "data", "world_happiness_combined.csv")
  const text = fs.readFileSync(file, "utf-8")
  const [header, ...lines] = text.split(/\r?\n/).filter(Boolean)
  const cols = header.split(";")
  const idx = (name: string) => cols.indexOf(name)

  return lines.map((line) => {
    const c = line.split(";")
    return {
      country: c[idx("Country")],
      region: c[idx("Regional indicator")] ?? "",
      score: num(c[idx("Happiness score")]),
      gdp: num(c[idx("GDP per capita")]),
      health: num(c[idx("Healthy life expectancy")]),
      corruption: num(c[idx("Perceptions of corruption")]),
      year: Number(c[idx("Year")]),
    }
  })
}

// Correlación de Pearson
export function pearson(x: number[], y: number[]) {
  const n = x.length
  const mx = x.reduce((a, b) => a + b, 0) / n
  const my = y.reduce((a, b) => a + b, 0) / n
  let num = 0, dx = 0, dy = 0
  for (let i = 0; i < n; i++) {
    num += (x[i] - mx) * (y[i] - my)
    dx += (x[i] - mx) ** 2
    dy += (y[i] - my) ** 2
  }
  return num / Math.sqrt(dx * dy)
}

function yearStats(rows: Row[], threshold: number) {
  const happy = rows.filter((r) => r.score >= threshold).length
  return {
    totalCountries: rows.length,
    happy,
    sad: rows.length - happy,
    corrCorruption: round(pearson(rows.map((r) => r.corruption), rows.map((r) => r.score))),
    corrGdp: round(pearson(rows.map((r) => r.gdp), rows.map((r) => r.score))),
  }
}

// KPIs del último año comparados con el año anterior
export function getKpis(year?: number, threshold = 5.5) {
  const all = loadHappiness()
  const lastYear = year ?? Math.max(...all.map((r) => r.year))
  const current = yearStats(all.filter((r) => r.year === lastYear), threshold)
  const previous = yearStats(all.filter((r) => r.year === lastYear - 1), threshold)

  return { year: lastYear, previousYear: lastYear - 1, threshold, current, previous }
}

// Puntaje promedio mundial por año (gráfico de área)
export function getYearlyAverage() {
  const all = loadHappiness()
  const years = [...new Set(all.map((r) => r.year))].sort((a, b) => a - b)
  return years.map((y) => ({
    year: String(y),
    score: round(avg(all.filter((r) => r.year === y).map((r) => r.score)), 3),
  }))
}

// Top N de países por puntaje promedio en todo el periodo
export function getTopCountries(n = 10) {
  const all = loadHappiness()
  const byCountry = new Map<string, number[]>()
  for (const r of all) {
    if (!byCountry.has(r.country)) byCountry.set(r.country, [])
    byCountry.get(r.country)!.push(r.score)
  }
  return [...byCountry.entries()]
    .map(([country, scores]) => ({ country, score: round(avg(scores), 2) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
}

// Bottom N de países por puntaje promedio en todo el periodo
export function getBottomCountries(n = 10) {
  const all = loadHappiness()
  const byCountry = new Map<string, number[]>()
  for (const r of all) {
    if (!byCountry.has(r.country)) byCountry.set(r.country, [])
    byCountry.get(r.country)!.push(r.score)
  }
  return [...byCountry.entries()]
    .map(([country, scores]) => ({ country, score: round(avg(scores), 2) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, n)
}


// Países por nivel de felicidad en un año (gráfico de pastel)
export function getBands(year?: number) {
  const all = loadHappiness()
  const y = year ?? Math.max(...all.map((r) => r.year))
  const rows = all.filter((r) => r.year === y)
  return [
    { band: "low", countries: rows.filter((r) => r.score < 4.5).length },
    { band: "mid", countries: rows.filter((r) => r.score >= 4.5 && r.score < 6).length },
    { band: "high", countries: rows.filter((r) => r.score >= 6).length },
  ]
}

const REGION_NAMES: Record<string, string> = {
  "Western Europe": "Europa Occidental",
  "North America and ANZ": "Norteamérica y ANZ",
  "Central and Eastern Europe": "Europa Central y del Este",
  "Latin America and Caribbean": "Latinoamérica y Caribe",
  "East Asia": "Asia Oriental",
  "Southeast Asia": "Sudeste Asiático",
  "Commonwealth of Independent States": "Comunidad de Estados Indep.",
  "Middle East and North Africa": "Medio Oriente y N. África",
  "South Asia": "Asia del Sur",
  "Sub-Saharan Africa": "África Subsahariana",
}

// Promedios por región en un año (barras interactivas)
export function getRegions(year?: number) {
  const all = loadHappiness()
  const y = year ?? Math.max(...all.map((r) => r.year))
  const rows = all.filter((r) => r.year === y && r.region)
  const regions = [...new Set(rows.map((r) => r.region))]
  

  const data = regions
    .map((region) => {
      const rs = rows.filter((r) => r.region === region)
      return {
        region: REGION_NAMES[region] ?? region,
        score: round(avg(rs.map((r) => r.score))),
        gdp: round(avg(rs.map((r) => r.gdp))),
        health: round(avg(rs.map((r) => r.health)), 1),
        perceptions: round(avg(rs.map((r) => r.corruption))),
      }
    })
    .sort((a, b) => b.score - a.score)

  const totals = {
    score: round(avg(rows.map((r) => r.score))),
    gdp: round(avg(rows.map((r) => r.gdp))),
    health: round(avg(rows.map((r) => r.health)), 1),
    perceptions: round(avg(rows.map((r) => r.corruption))), 
  }

  return { year: y, data, totals }
}


export function getHappiness(): HappinessRow[] {
  const file = path.join(process.cwd(), "data", "world_happiness_combined.csv")
  const text = fs.readFileSync(file, "utf-8")

  const { data } = Papa.parse<Record<string, string>>(text, {
    header: true,
    delimiter: ";",
    skipEmptyLines: true,
  })

  return data.map((r) => ({
    country: normalizeCountry(r["Country"]),
    region: r["Regional indicator"],
    score: toNum(r["Happiness score"]),
    year: Number(r["Year"]),
  }))
}

// Nombre del CSV -> nombre en world-atlas
const ALIASES: Record<string, string> = {
  "United States": "United States of America",
  "Czech Republic": "Czechia",
  "Turkiye": "Turkey",
  "Argelia": "Algeria",
  "Ivory Coast": "Côte d'Ivoire",
  "Swaziland": "eSwatini",
  "Eswatini": "eSwatini",
  "Macedonia": "North Macedonia",
  "Congo (Kinshasa)": "Dem. Rep. Congo",
  "Congo (Brazzaville)": "Congo",
  "Bosnia and Herzegovina": "Bosnia and Herz.",
  "Central African Republic": "Central African Rep.",
  "Dominican Republic": "Dominican Rep.",
  "South Sudan": "S. Sudan",
  "North Cyprus": "N. Cyprus",
  "Somaliland region": "Somaliland",
  "Palestinian Territories": "Palestine",
  "State of Palestine": "Palestine",
  "Taiwan Province of China": "Taiwan",
  "Trinidad & Tobago": "Trinidad and Tobago",
}

export const normalizeCountry = (name: string) => ALIASES[name] ?? name
