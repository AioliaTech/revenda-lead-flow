
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Download } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DashboardFilter } from "@/types";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface DashboardFiltersProps {
  filter: DashboardFilter;
  setFilter: (f: DashboardFilter) => void;
  dateRange: DateRange | undefined;
  setDateRange: (r: DateRange | undefined) => void;
  handleExport: () => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  filter, setFilter, dateRange, setDateRange, handleExport
}) => (
  <div className="mb-6 flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <Label htmlFor="period">Período:</Label>
      <select
        id="period"
        value={filter.period}
        onChange={e => setFilter({ ...filter, period: e.target.value as DashboardFilter["period"] })}
        className="border rounded px-3 py-1"
      >
        <option value="today">Hoje</option>
        <option value="yesterday">Ontem</option>
        <option value="last7days">Últimos 7 dias</option>
        <option value="last14days">Últimos 14 dias</option>
        <option value="last30days">Últimos 30 dias</option>
        <option value="custom">Personalizado</option>
      </select>
      {filter.period === "custom" && (
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Selecione as datas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
      <div className="ml-4 flex items-center space-x-2">
        <Label htmlFor="channel">Canal:</Label>
        <select
          id="channel"
          value={filter.channelIds[0]}
          onChange={e => setFilter({ ...filter, channelIds: [e.target.value] })}
          className="border rounded px-3 py-1"
        >
          <option value="all">Todos os WhatsApps</option>
          <option value="channel1">Vendas Principal</option>
          <option value="channel2">Suporte ao Cliente</option>
        </select>
      </div>
    </div>
    <Button onClick={handleExport} className="flex items-center gap-2">
      <Download className="h-4 w-4" /> Exportar
    </Button>
  </div>
);

export default DashboardFilters;
