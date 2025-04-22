import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  Calendar as CalendarIcon,
  Download,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { mockKanbanColumns } from "../services/mockData";
import { cn } from "@/lib/utils";
import { DashboardFilter } from "@/types";
import { DateRange } from "react-day-picker";
import FunnelChart from "@/components/charts/FunnelChart";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import DashboardFilters from "@/components/dashboard/DashboardFilters";

const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState<DashboardFilter>({
    period: "last7days",
    channelIds: ["all"],
  });
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  
  const stats = {
    newLeads: 18,
    inProgressLeads: 32,
    completedLeads: 7,
  };
  
  const funnelData = mockKanbanColumns.map((column) => ({
    name: column.title,
    value: column.leadIds.length,
  }));

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
      <DashboardFilters
        filter={filter}
        setFilter={setFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        handleExport={handleExport}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardStatCard
          title="Leads Iniciados"
          value={stats.newLeads}
          percentageChange={percentageChanges.newLeads}
        />
        <DashboardStatCard
          title="Leads Em Andamento"
          value={stats.inProgressLeads}
          percentageChange={percentageChanges.inProgressLeads}
        />
        <DashboardStatCard
          title="Leads Finalizados"
          value={stats.completedLeads}
          percentageChange={percentageChanges.completedLeads}
        />
      </div>

      <FunnelChart data={funnelData} />
    </Layout>
  );
};

export default Dashboard;
