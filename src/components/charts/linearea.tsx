"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  score: { label: "Puntaje promedio", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartAreaInteractive({ data }: { data: { year: string; score: number }[] }) {
  return (
    <Card className="pt-0">
      <CardHeader className="border-b py-5">
        <CardTitle>Evolución de la felicidad</CardTitle>
        <CardDescription>Puntaje promedio mundial por año</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-score)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-score)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              width={40}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 0.1", "dataMax + 0.1"]}
              tickFormatter={(v: number) => v.toFixed(1)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="score"
              type="monotone"
              fill="url(#fillScore)"
              stroke="var(--color-score)"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: "var(--color-score)", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}