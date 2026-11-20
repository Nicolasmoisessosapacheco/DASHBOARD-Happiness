import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KpiVariacionProps {
  titulo: string
  actual: number
  anterior: number
  /** Texto para el periodo anterior, por ejemplo "2023" */
  periodoAnterior?: string
  /** true cuando subir es malo (por ejemplo, más países tristes) */
  invertir?: boolean
  color?: string
}

export function KpiVariacion({
  titulo,
  actual,
  anterior,
  periodoAnterior = "el periodo anterior",
  invertir = false,
}: KpiVariacionProps) {
  // Evitar división entre cero
  const porcentaje = anterior !== 0 ? ((actual - anterior) / Math.abs(anterior)) * 100 : 0
  const sube = porcentaje >= 0
  const sinCambio = Math.abs(porcentaje) < 0.05
  const esBueno = invertir ? !sube : sube
  const variante = sinCambio ? "secondary" : esBueno ? "default" : "destructive"
  const barra = sinCambio ? "bg-muted-foreground/30" : esBueno ? "bg-primary" : "bg-destructive"

  return (
    <Card className="relative overflow-hidden">
      <span
        className={`absolute inset-x-0 top-0 h-1 ${barra}`}
      />
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground">
          {titulo}
        </CardTitle>
        <Badge variant={variante} className="shrink-0 gap-1">
          {sube ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {sube ? "+" : ""}
          {porcentaje.toFixed(1)}%
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{actual.toLocaleString("es-MX")}</div>
        <p className="mt-1 text-xs text-muted-foreground">
          vs. {anterior.toLocaleString("es-MX")} en {periodoAnterior}
        </p>
      </CardContent>
    </Card>
  )
}
