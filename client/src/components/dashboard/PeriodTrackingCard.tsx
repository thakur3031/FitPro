import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addDays, subDays } from "date-fns";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Sample appointment data
const appointments = [
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1), title: "Client: Sarah Johnson", description: "Nutrition Check-in" },
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2), title: "Team Meeting", description: "Monthly review" },
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2), title: "Client: Tom Lee", description: "Fitness Plan Update" },
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 4), title: "Consultation", description: "New client intro" },
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 6), title: "Client: Anna Kim", description: "Progress Check" },
];

const getAppointmentsForDay = (date: Date) => {
  return appointments.filter(
    (appt) =>
      appt.date.getFullYear() === date.getFullYear() &&
      appt.date.getMonth() === date.getMonth() &&
      appt.date.getDate() === date.getDate()
  );
};

const UpcomingWeekAppointments: React.FC = () => {
  // Track the start date of the visible week
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  }, [startDate]);

  const handlePrevWeek = () => setStartDate((prev) => subDays(prev, 7));
  const handleNextWeek = () => setStartDate((prev) => addDays(prev, 7));

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Upcoming Week</CardTitle>
        <div className="flex gap-2 ml-auto">
          <button onClick={handlePrevWeek} className="p-2 rounded hover:bg-muted transition-colors" aria-label="Previous week">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={handleNextWeek} className="p-2 rounded hover:bg-muted transition-colors" aria-label="Next week">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 overflow-hidden w-full">
          {weekDays.map((date, idx) => {
            const appts = getAppointmentsForDay(date);
            return (
              <div
                key={idx}
                className="min-w-[110px] max-w-[130px] flex-1 basis-1/5 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-2 flex-shrink"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
              >
                <div className="font-semibold text-xs mb-1 text-center">{format(date, 'EEE, MMM d')}</div>
                {appts.length > 0 ? (
                  <div className="space-y-1">
                    {appts.map((appt, i) => (
                      <div key={i} className="bg-primary-100 dark:bg-primary-900/30 text-xs rounded p-1 border border-primary-200 dark:border-primary-700 truncate">
                        <div className="font-semibold">{appt.title}</div>
                        <div className="text-muted-foreground">{appt.description}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground text-center mt-4">No appointments</div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingWeekAppointments;
