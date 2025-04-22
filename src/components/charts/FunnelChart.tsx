
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FunnelChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
  // Only take the first 4 items
  const limitedData = data.slice(0, 4);
  const maxValue = Math.max(...limitedData.map(item => item.value));
  const totalItems = limitedData.length;

  return (
    <Card className="w-1/3 mx-auto animate-fade-in"> 
      <CardHeader>
        <CardTitle>Funil de Vendas</CardTitle>
        <CardDescription>Distribuição de leads por etapa do processo</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="w-full flex flex-col items-center gap-0.5 max-h-[50vh]">
          {limitedData.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const width = Math.max(10 + (30 - 10) * (1 - index / totalItems), 10);

            return (
              <div 
                key={item.name} 
                className="w-full flex flex-col items-center animate-scale-in"
                style={{ maxWidth: `${width}%` }}
              >
                <div 
                  className="w-full h-10 relative" 
                  style={{
                    background: `linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)`,
                    clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                    <span className="text-xs">
                      {item.value} leads
                    </span>
                  </div>
                </div>
                <div className="text-[10px] font-medium text-muted-foreground mt-0.5">
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
