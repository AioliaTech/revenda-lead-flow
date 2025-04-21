
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FunnelChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const totalItems = data.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil de Vendas</CardTitle>
        <CardDescription>Distribuição de leads por etapa do processo</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="w-full flex flex-col items-center gap-1">
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const width = Math.max(30 + (100 - 30) * (1 - index / totalItems), 30);

            return (
              <div 
                key={item.name} 
                className="w-full flex flex-col items-center"
                style={{ maxWidth: `${width}%` }}
              >
                <div 
                  className="w-full h-16 relative group"
                  style={{
                    background: `linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)`,
                    clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.value} leads
                    </span>
                  </div>
                </div>
                <div className="text-sm font-medium text-muted-foreground mt-1">
                  {item.name}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelChart;
