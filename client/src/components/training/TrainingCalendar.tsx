import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import * as Icons from "@/lib/icons";

interface Exercise {
  name: string;
  sets?: string;
  reps?: string;
  weight?: string;
  notes?: string;
}

interface WorkoutDay {
  id: string;
  name: string;
  exercises: Exercise[];
  completed?: boolean;
}

interface TrainingCalendarProps {
  clientId: string;
}

const TrainingCalendar: React.FC<TrainingCalendarProps> = ({ clientId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<"1 Week" | "2 Week" | "4 Week">("2 Week");

  // Mock data - replace with real data from your API
  const workouts: Record<string, WorkoutDay[]> = {
    "MON": [
      {
        id: "1",
        name: "SQUAT, PRESS, POWER CLEAN - DEMO",
        exercises: [
          {
            name: "Barbell Full Squat",
            sets: "3x",
            weight: "250 kg x 5, 250 kg x 5, 250 kg x 5"
          },
          {
            name: "Barbell Shoulder Press",
            sets: "3x",
            weight: "100 kg x 5, 100 kg x 5, 100 kg x 5"
          },
          {
            name: "Power Clean",
            sets: "5x",
            weight: "180 kg x 3, 180 kg x 3, 180 kg x 3"
          }
        ],
        completed: true
      }
    ],
    "WED": [
      {
        id: "2",
        name: "UPPER BODY SUPERSETS - DEMO",
        exercises: [
          {
            name: "Push-Up",
            sets: "1x",
            reps: "10-12 reps"
          },
          {
            name: "Front Raise And Pullover",
            sets: "1x",
            reps: "10 kg x 10"
          },
          {
            name: "Dumbbell Rear Delt Row",
            sets: "1x",
            reps: "10 kg x 10"
          },
          {
            name: "Dumbbell Floor Press",
            sets: "1x",
            reps: "10 kg x 12"
          }
        ]
      }
    ],
    "FRI": [
      {
        id: "3",
        name: "SQUAT, PRESS, DEADLIFT - DEMO",
        exercises: [
          {
            name: "Barbell Full Squat",
            sets: "3x",
            weight: "250 kg x 5, 250 kg x 5, 250 kg x 5"
          },
          {
            name: "Barbell Shoulder Press",
            sets: "3x",
            weight: "100 kg x 5, 100 kg x 5, 100 kg x 5"
          },
          {
            name: "Barbell Deadlift",
            sets: "1x",
            weight: "280 kg x 5"
          }
        ]
      }
    ]
  };

  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + i);
    return date.getDate();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Icons.ChevronLeftIcon className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="px-4 py-2 bg-muted rounded-md">
            May 19 - Jun 1
          </div>
          <Button variant="outline">
            Next
            <Icons.ChevronRightIcon className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="secondary">
            <Icons.CalendarIcon className="h-4 w-4 mr-2" />
            Master Planner
          </Button>
          <Button variant="outline">
            <Icons.SaveIcon className="h-4 w-4 mr-2" />
            Save as Program
          </Button>
          <div className="flex rounded-md overflow-hidden">
            <Button
              variant={view === "1 Week" ? "default" : "outline"}
              onClick={() => setView("1 Week")}
              className="rounded-none"
            >
              1 Week
            </Button>
            <Button
              variant={view === "2 Week" ? "default" : "outline"}
              onClick={() => setView("2 Week")}
              className="rounded-none border-l-0 border-r-0"
            >
              2 Week
            </Button>
            <Button
              variant={view === "4 Week" ? "default" : "outline"}
              onClick={() => setView("4 Week")}
              className="rounded-none"
            >
              4 Week
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map((day, i) => (
          <div key={day} className="space-y-4">
            <div className="text-center">
              <div className="text-sm font-medium">{day}</div>
              <div className="text-2xl">{dates[i]}</div>
            </div>
            {workouts[day]?.map((workout) => (
              <Card key={workout.id} className={workout.completed ? "bg-muted" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm font-medium mb-1">{workout.name}</div>
                      {workout.completed && (
                        <div className="flex items-center text-xs text-green-600">
                          <Icons.CheckIcon className="h-3 w-3 mr-1" />
                          Completed
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Icons.MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  {workout.exercises.map((exercise, i) => (
                    <div key={i} className="mb-2 last:mb-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">{exercise.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {exercise.sets} {exercise.weight || exercise.reps}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingCalendar; 