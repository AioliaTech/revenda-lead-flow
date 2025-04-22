
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatCardProps {
  title: string;
  value: number;
  percentageChange: number;
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({ title, value, percentageChange }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold">{value}</div>
        <div className={cn(
          "flex items-center text-xs",
          percentageChange >= 0 ? "text-green-500" : "text-red-500"
        )}>
          {percentageChange >= 0
            ? <ArrowUp className="h-3 w-3 mr-1" />
            : <ArrowDown className="h-3 w-3 mr-1" />
          }
          {Math.abs(percentageChange)}%
        </div>
      </div>
    </CardContent>
  </Card>
);

export default DashboardStatCard;
