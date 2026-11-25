"use client"

import { useMemo, useState } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import type { HappinessRow } from "@/lib/happiness"


const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const colorScale = scaleLinear<string>()
  .domain([3, 5.5, 8])
  .range(["#fee2e2", "#fb923c", "#9a3412"])

export function WorldMap({ data }: { data: HappinessRow[] }) {
  const years = useMemo(() => [...new Set(data.map((d) => d.year))].sort(), [data])
  const [year, setYear] = useState(years[years.length - 1])
  const [hover, setHover] = useState<string | null>(null)

  // Map: nombre del país (como en el mapa) -> score del año elegido
  const scoreByCountry = useMemo(() => {
    const m = new Map<string, number>()
    data
      .filter((d) => d.year === year)
      .forEach((d) => m.set(d.country, d.score))
    return m
  }, [data, year])

  return (
    <div>
      <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <ComposableMap projection="geoMercator">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties?.name as string
              const score = scoreByCountry.get(name)
              const fill = score ? colorScale(score) : "#d4d4d8"

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() =>
                    setHover(score ? `${name}: ${score.toFixed(2)}` : `${name}: sin datos`)
                  }
                  onMouseLeave={() => setHover(null)}
                  fill={fill}
                  style={{ outline: "none" }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      <p>{hover ?? "Pasa el cursor sobre un país"}</p>
    </div>
  )
}