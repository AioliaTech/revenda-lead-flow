
import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Calendar as CalendarIcon,
  Download,
  Filter,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockKanbanColumns } from "../services/mockData";
import { cn } from "@/lib/utils";
import { DashboardFilter } from "@/types";

const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState<DashboardFilter>({
    period: "last7days",
    channelIds: ["all"],
  });
  
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  // Mock data for charts and stats
  const stats = {
    newLeads: 18,
    inProgressLeads: 32,
    completedLeads: 7,
  };
  
  // Transform kanban columns data for the funnel chart
  const funnelData = mockKanbanColumns.map((column) => ({
    name: column.title,
    value: column.leadIds.length,
  }));

  // Calculate percentage changes
  const percentageChanges = {
    newLeads: 12,
    inProgressLeads: -5,
    completedLeads: 20,
  };

  const handleFilterChange = (period: DashboardFilter["period"]) => {
    setFilter({ ...filter, period });
  };
  
  const handleExport = () => {
    alert("Exportando dados...");
  };

  return (
    <Layout title="Dashboard">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Label htmlFor="period">Período:</Label>
          <select
            id="period"
            value={filter.period}
            onChange={(e) => handleFilterChange(e.target.value as DashboardFilter["period"])}
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
                    {dateRange.from ? (
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range)}
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
              onChange={(e) => setFilter({ ...filter, channelIds: [e.target.value] })}
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Leads Iniciados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">{stats.newLeads}</div>
              <div className={cn(
                "flex items-center text-xs",
                percentageChanges.newLeads >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {percentageChanges.newLeads >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(percentageChanges.newLeads)}%
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Leads Em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">{stats.inProgressLeads}</div>
              <div className={cn(
                "flex items-center text-xs",
                percentageChanges.inProgressLeads >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {percentageChanges.inProgressLeads >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(percentageChanges.inProgressLeads)}%
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Leads Finalizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">{stats.completedLeads}</div>
              <div className={cn(
                "flex items-center text-xs",
                percentageChanges.completedLeads >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {percentageChanges.completedLeads >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(percentageChanges.completedLeads)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Funil de Vendas</CardTitle>
          <CardDescription>Distribuição de leads por etapa do processo</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              layout="vertical"
              data={funnelData}
              margin={{
                top: 5,
                right: 30,
                left: 80,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#1A73E8"
                radius={[0, 4, 4, 0]}
                label={{ position: 'right', fontSize: 12 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Dashboard;
