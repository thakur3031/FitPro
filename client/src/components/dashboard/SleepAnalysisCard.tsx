import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SleepMetric {
  label: string;
  value: number;
  color?: string;
}

interface SleepAnalysisCardProps {
  metrics?: SleepMetric[];
}

const SleepAnalysisCard: React.FC<SleepAnalysisCardProps> = ({ 
  metrics = [
    { label: "REM sleep cycles", value: 30 },
    { label: "Deep sleep patterns", value: 50 },
    { label: "Light sleep phases", value: 20 }
  ]
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Sleep analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</span>
                <span className="text-sm font-medium">{metric.value}%</span>
              </div>
              <Progress value={metric.value} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepAnalysisCard;
