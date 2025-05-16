import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface NutritionData {
  type: string;
  progress: number;
  total: string | number;
  dailyGoal: string | number;
  remain: string | number;
  color?: string;
}

interface NutritionOverviewCardProps {
  nutritionData?: NutritionData[];
}

const NutritionOverviewCard: React.FC<NutritionOverviewCardProps> = ({
  nutritionData = [
    {
      type: "Caloric intake",
      progress: 80,
      total: "3,000",
      dailyGoal: "2,500",
      remain: "-500",
      color: "bg-green-500 dark:bg-green-600",
    },
    {
      type: "Proteins intake",
      progress: 65,
      total: "150g",
      dailyGoal: "Recom",
      remain: "100g",
      color: "bg-blue-500 dark:bg-blue-600",
    },
    {
      type: "Fat intake",
      progress: 45,
      total: "60g",
      dailyGoal: "Recomm",
      remain: "15",
      color: "bg-amber-500 dark:bg-amber-600",
    },
  ],
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Nutrition overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Type</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Progress</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Total</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Daily goal</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Remain</th>
              </tr>
            </thead>
            <tbody>
              {nutritionData.map((item, index) => (
                <tr 
                  key={index} 
                  className={index < nutritionData.length - 1 ? "border-b border-gray-200 dark:border-slate-700" : ""}
                >
                  <td className="py-3 px-2 text-sm">{item.type}</td>
                  <td className="py-3 px-2">
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`${item.color || "bg-primary-500"} h-2 rounded-full`} 
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-right">{item.total}</td>
                  <td className="py-3 px-2 text-sm text-right">{item.dailyGoal}</td>
                  <td className={`py-3 px-2 text-sm text-right ${
                    item.remain.toString().startsWith('-') ? 'text-rose-500' : ''
                  }`}>
                    {item.remain}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionOverviewCard;
