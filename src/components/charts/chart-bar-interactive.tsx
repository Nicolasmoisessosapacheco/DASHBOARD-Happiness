"use client"
import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "Promedios por región con selector de indicador"

const chartConfig = {
  score: {
    label: "Felicidad",
    color: "var(--chart-1)",
  },
  gdp: {
    label: "PIB (índice 0-10)",
    color: "var(--chart-4)",
  },
  health: {
    label: "Esperanza de vida",
    color: "var(--chart-5)",
  },
  perceptions: {
    label: "Percepción de corrupción",
    color: "var(--chart-6)",
  },

} satisfies ChartConfig

type Metric = keyof typeof chartConfig

type RegionRow = { region: string; score: number; gdp: number; health: number; perceptions: number }

type Props = {
  year: number
  data: RegionRow[]
  totals: Record<Metric, number>
}

export function ChartBarInteractive({ year, data, totals }: Props) {
  const [activeChart, setActiveChart] = React.useState<Metric>("score")

  const sorted = React.useMemo(
    () => [...data].sort((a, b) => b[activeChart] - a[activeChart]),
    [data, activeChart]
  )

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>Indicadores por región</CardTitle>
          <CardDescription>
            Promedio de cada región 2015-2024. Elige un indicador a la derecha.
          </CardDescription>
        </div>
        <div className="flex">
          {(Object.keys(chartConfig) as Metric[]).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors even:border-l data-[active=true]:bg-muted/60 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: chartConfig[key].color }}
                />
                {chartConfig[key].label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {totals[key].toLocaleString("es-MX")}
              </span>
              <span className="text-[11px] text-muted-foreground">promedio mundial</span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[360px] w-full">
          <BarChart
            accessibilityLayer
            data={sorted}
            layout="vertical"
            margin={{ left: 12, right: 24 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="region"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={190}
            />
            <XAxis
              type="number"
              dataKey={activeChart}
              tickLine={false}
              axisLine={false}
              domain={activeChart === "health" ? ["dataMin - 5", "dataMax + 2"] : [0, "auto"]}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="w-[190px]" />}
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
