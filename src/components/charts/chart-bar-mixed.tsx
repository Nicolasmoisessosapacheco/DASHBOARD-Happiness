"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  score: { label: "Puntaje", color: "var(--chart-1)" },
} satisfies ChartConfig



type Props = {
  title: string
  description?: string
  data: { country: string; score: number }[]
  color?: string
}

export function ChartBarMixed2({
  title,
  description = "Promedio 2015-2024",
  data,
  color = "var(--chart-1)",
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[320px] w-full" config={chartConfig}>
          <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 0, right: 40 }}>
            <defs>
              <linearGradient id="fillTop" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity={0.55} />
                <stop offset="100%" stopColor={color} stopOpacity={1} />
              </linearGradient>
            </defs>
            <YAxis dataKey="country" type="category" tickLine={false} axisLine={false} tickMargin={10} width={110} />
            <XAxis dataKey="score" type="number" hide domain={[0, 8]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="score" radius={6} fill="url(#fillTop)">
              <LabelList
                dataKey="score"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
