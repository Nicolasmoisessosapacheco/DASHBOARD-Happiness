"use client"

import { Label, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  countries: { label: "Países" },
  low: { label: "Bajo (< 4.5)", color: "var(--chart-3)" },
  mid: { label: "Medio (4.5 - 6)", color: "var(--chart-2)" },
  high: { label: "Alto (≥ 6)", color: "var(--chart-1)" },
} satisfies ChartConfig

type Props = { year: number; data: { band: string; countries: number }[] }

export function DevicesPieChart({ year, data }: Props) {
  const chartData = data.map((d) => ({ ...d, fill: `var(--color-${d.band})` }))
  const total = data.reduce((a, d) => a + d.countries, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Países por nivel de felicidad</CardTitle>
        <CardDescription>Año {year}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto h-[320px] w-full">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="countries"
              nameKey="band"
              innerRadius={70}
              outerRadius={115}
              paddingAngle={3}
              cornerRadius={6}
              strokeWidth={0}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {total}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 22} className="fill-muted-foreground text-xs">
                          países
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="band" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
