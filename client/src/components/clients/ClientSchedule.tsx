import React, { useState } from "react";
import { useClientSchedule } from "@/hooks/use-clients";
import { startOfWeek, addDays, format, addWeeks } from "date-fns";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const VIEW_OPTIONS = [
  { label: "1 Week", value: 1 },
  { label: "2 Week", value: 2 },
  { label: "4 Week", value: 4 },
];

export function ClientSchedule({ clientId }: { clientId: number }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [numWeeks, setNumWeeks] = useState(2);
  const [copiedDay, setCopiedDay] = useState<any>(null);
  const [editModal, setEditModal] = useState<{ open: boolean, date: string | null, data: any }>({ open: false, date: null, data: null });
  const today = new Date();
  const { toast } = useToast();
  // Start from the current week's Monday, then add offset in increments
  const startDate = addWeeks(startOfWeek(today, { weekStartsOn: 1 }), weekOffset * numWeeks);
  const totalDays = numWeeks * 7;
  const allDates = Array.from({ length: totalDays }, (_, i) => addDays(startDate, i));
  const dateStrings = allDates.map(date => format(date, "yyyy-MM-dd"));

  const { data: schedule, isLoading } = useClientSchedule(clientId, dateStrings[0], dateStrings[totalDays - 1]);

  // Map schedule by date
  const scheduleByDate: Record<string, any[]> = {};
  (schedule || []).forEach((session: any) => {
    if (!scheduleByDate[session.date]) scheduleByDate[session.date] = [];
    scheduleByDate[session.date].push(session);
  });

  // Split dates into weeks
  const weeks: Date[][] = [];
  for (let i = 0; i < allDates.length; i += 7) {
    weeks.push(allDates.slice(i, i + 7));
  }

  // Helper to get all data for a day
  const getDayData = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    return scheduleByDate[key] || [];
  };

  // Handler for copy
  const handleCopyDay = (date: Date) => {
    setCopiedDay({ date: format(date, "yyyy-MM-dd"), data: getDayData(date) });
    toast({ title: "Day copied!", description: `Copied all workouts and plans for ${format(date, "MMM d")}` });
  };
  // Handler for paste
  const handlePasteDay = (date: Date) => {
    // For now, just show a toast and update UI state
    // TODO: Implement backend mutation
    toast({ title: "Paste Day", description: `Would paste data to ${format(date, "MMM d")}` });
  };
  // Handler for edit/add
  const handleEditDay = (date: Date, data: any) => {
    setEditModal({ open: true, date: format(date, "yyyy-MM-dd"), data });
  };
  // Handler for delete
  const handleDeleteDay = (date: Date) => {
    toast({ title: "Delete Day", description: `Would delete all data for ${format(date, "MMM d")}` });
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Navigation and View Toggle */}
      <div className="flex items-center justify-between mb-2">
        <button
          className="px-2 py-1 rounded bg-gray-200 text-xs hover:bg-gray-300"
          onClick={() => setWeekOffset((w) => w - 1)}
        >
          &lt; Prev {numWeeks} Week{numWeeks > 1 ? 's' : ''}
        </button>
        <div className="flex gap-2">
          {VIEW_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`px-3 py-1 rounded transition font-medium text-xs ${numWeeks === opt.value ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:bg-slate-200'}`}
              onClick={() => { setNumWeeks(opt.value); setWeekOffset(0); }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="text-sm font-semibold text-gray-700">
          {format(startDate, "MMM d")} - {format(addDays(startDate, totalDays - 1), "MMM d, yyyy")}
        </div>
        <button
          className="px-2 py-1 rounded bg-gray-200 text-xs hover:bg-gray-300"
          onClick={() => setWeekOffset((w) => w + 1)}
        >
          Next {numWeeks} Week{numWeeks > 1 ? 's' : ''} &gt;
        </button>
      </div>
      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px] w-full bg-gray-100 rounded-lg p-2 shadow-inner">
          {/* Header Row */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className="text-xs text-gray-500 font-semibold text-center py-1">{day}</div>
            ))}
          </div>
          {/* Week Rows */}
          {weeks.map((weekDates, wIdx) => (
            <div key={wIdx} className="grid grid-cols-7 gap-2 mb-2">
              {weekDates.map((date, dIdx) => {
                const dayData = getDayData(date);
                return (
                  <div key={dIdx} className="bg-white rounded-lg min-h-[120px] p-2 flex flex-col gap-2 border border-gray-200 w-40 shadow relative group">
                    {/* Context Menu Trigger */}
                    <div className="absolute top-2 right-2 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-60 group-hover:opacity-100"><span>⋮</span></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditDay(date, dayData)}>Add/Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyDay(date)}>Copy Day</DropdownMenuItem>
                          <DropdownMenuItem disabled={!copiedDay} onClick={() => handlePasteDay(date)}>Paste Day</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteDay(date)} className="text-red-500">Delete Day</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="text-xs text-gray-400 mb-1 flex items-center gap-1 font-semibold">
                      <span className="ml-auto">{format(date, "d MMM")}</span>
                    </div>
                    {dayData.length === 0 && (
                      <div className="text-xs text-gray-300 mt-4 text-center">No Session</div>
                    )}
                    {dayData.map((session: any, i: number) => (
                      <div key={i} className="bg-blue-50 rounded p-2 text-blue-900 border border-blue-200">
                        <div className="font-semibold text-blue-600 text-xs truncate mb-1">{session.workout_name}</div>
                        <ul className="text-xs">
                          {session.exercises && session.exercises.map((ex: any, j: number) => (
                            <li key={j}>{ex.name} {ex.sets}x{ex.reps}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Edit/Add Modal */}
      <Dialog open={editModal.open} onOpenChange={open => setEditModal(m => ({ ...m, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editModal.data && editModal.data.length > 0 ? 'Edit Day' : 'Add Workout/Plan'}</DialogTitle>
          </DialogHeader>
          {/* TODO: Add form for editing/adding workouts, exercises, meal plan, etc. */}
          <div className="text-sm text-gray-500">(Form UI goes here)</div>
          <DialogFooter>
            <Button onClick={() => setEditModal({ open: false, date: null, data: null })}>Close</Button>
            <Button variant="default">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 