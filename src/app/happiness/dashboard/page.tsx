import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { DevicesPieChart } from "@/components/charts/devices-pie-chart"
import { ChartBarInteractive } from "@/components/charts/chart-bar-interactive"
import { ChartBarMixed } from "@/components/charts/chart-bar-mixed2"
import { ChartAreaInteractive } from "@/components/charts/linearea"
import { KpiVariacion } from "@/components/charts/kpi-variacion"
import { ChartBarMixed2 } from "@/components/charts/chart-bar-mixed"
import {getHappiness} from "@/lib/happiness"
import {WorldMap} from "@/components/charts/WorldMap"





import {
  getBands,
  getBottomCountries,
  getKpis,
  getRegions,
  getTopCountries,
  getYearlyAverage,
} from "@/lib/happiness"

export default function Page() {
  const k = getKpis()
  const prev = String(k.previousYear)
  const yearly = getYearlyAverage()
  const top = getTopCountries(10)
  const bands = getBands(k.year)
  const regions = getRegions(k.year)
  const bottom = getBottomCountries(10)
  const data = getHappiness()
  
  



  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />

            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    DASHBOARDS
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block" />

                <BreadcrumbItem>
                  <BreadcrumbPage>HAPPINESS WORLD 2015-2024</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Contenido */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">

          {/* KPIs: año más reciente comparado con el anterior */}
          <div className="grid gap-3 md:grid-cols-5">
            <KpiVariacion
              titulo="PAÍSES INVESTIGADOS"
              actual={k.current.totalCountries}
              anterior={k.previous.totalCountries}
              periodoAnterior={prev}
            />

            <KpiVariacion
              titulo={`PAÍSES FELICES (≥ ${k.threshold})`}
              actual={k.current.happy}
              anterior={k.previous.happy}
              periodoAnterior={prev}
            />

            <KpiVariacion
              titulo={`PAÍSES TRISTES (< ${k.threshold})`}
              actual={k.current.sad}
              anterior={k.previous.sad}
              periodoAnterior={prev}
              invertir
              color="#e91616"
            />

            <KpiVariacion
              titulo="PIB vs FELICIDAD"
              actual={k.current.corrGdp}
              anterior={k.previous.corrGdp}
              
            />

            <KpiVariacion
              titulo="CORRUPCIÓN vs FELICIDAD"
              actual={k.current.corrCorruption}
              anterior={k.previous.corrCorruption}
              
            />
          </div>

          {/* Gráfico principal */}
          <div className="grid gap-3 md:grid-cols-2">
            <ChartAreaInteractive data={yearly} />
            <WorldMap data={data} />
          </div>

          

          {/* Barras interactivas */}
          <div className="grid gap-3 md:grid-cols-1">
            <ChartBarInteractive
              year={regions.year}
              data={regions.data}
              totals={regions.totals}
              
            />
          </div>

          {/* Gráficos secundarios */}
          <div className="grid gap-3 md:grid-cols-2">
            <ChartBarMixed
              title="TOP 10 PAÍSES MÁS FELICES"
              data={top}
            />

            <ChartBarMixed2
              title="TOP 10 PAÍSES MÁS TRISTES"
              data={bottom}
              color="#b41b1b"
            />

            {/*<DevicesPieChart
              year={k.year}
              data={bands}
            />*/}
          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

