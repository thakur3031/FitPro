import React, { useState } from "react";
import { ClientSchedule } from "./ClientSchedule";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import ClientManagementCard from "@/components/dashboard/ClientManagementCard";
import NutritionOverviewCard from "@/components/dashboard/NutritionOverviewCard";
import UpcomingWeekAppointments from "@/components/dashboard/PeriodTrackingCard";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Edit2, Flag } from "lucide-react";

export function ClientDashboard({ clientId }: { clientId: number }) {
  const [range, setRange] = useState("week");

  // Simulated data for week/month
  const weightDataWeek = [
    { date: "May 2", value: 74.5 },
    { date: "May 5", value: 74.7 },
    { date: "May 8", value: 74.6 },
    { date: "May 12", value: 74.8 },
    { date: "May 15", value: 74.4 },
    { date: "May 18", value: 74.3 },
    { date: "May 22", value: 74.4 },
  ];
  const weightDataMonth = [
    ...weightDataWeek,
    { date: "May 25", value: 74.2 },
    { date: "May 28", value: 74.1 },
    { date: "May 30", value: 74.0 },
  ];
  const heartRateDataWeek = [
    { date: "May 2", value: 68 },
    { date: "May 5", value: 67 },
    { date: "May 8", value: 66 },
    { date: "May 12", value: 67 },
    { date: "May 15", value: 66 },
    { date: "May 18", value: 66 },
    { date: "May 22", value: 66 },
  ];
  const heartRateDataMonth = [
    ...heartRateDataWeek,
    { date: "May 25", value: 65 },
    { date: "May 28", value: 65 },
    { date: "May 30", value: 64 },
  ];
  const sleepDataWeek = [
    { date: "May 2", value: 7 },
    { date: "May 5", value: 6.5 },
    { date: "May 8", value: 7.2 },
    { date: "May 12", value: 6.8 },
    { date: "May 15", value: 7 },
    { date: "May 18", value: 6.9 },
    { date: "May 22", value: 6.98 },
  ];
  const sleepDataMonth = [
    ...sleepDataWeek,
    { date: "May 25", value: 7.1 },
    { date: "May 28", value: 6.7 },
    { date: "May 30", value: 7.0 },
  ];
  const stepsDataWeek = [
    { date: "Fri", value: 7000 },
    { date: "Sat", value: 9000 },
    { date: "Sun", value: 12000 },
    { date: "Mon", value: 11000 },
    { date: "Tue", value: 8000 },
    { date: "Wed", value: 7500 },
    { date: "Thu", value: 7000 },
  ];
  const stepsDataMonth = [
    ...stepsDataWeek,
    { date: "Fri2", value: 8000 },
    { date: "Sat2", value: 9500 },
    { date: "Sun2", value: 10000 },
    { date: "Mon2", value: 10500 },
    { date: "Tue2", value: 9000 },
    { date: "Wed2", value: 8500 },
    { date: "Thu2", value: 8000 },
  ];

  const weightData = range === "week" ? weightDataWeek : weightDataMonth;
  const heartRateData = range === "week" ? heartRateDataWeek : heartRateDataMonth;
  const sleepData = range === "week" ? sleepDataWeek : sleepDataMonth;
  const stepsData = range === "week" ? stepsDataWeek : stepsDataMonth;

  // Dummy goal and countdown
  const goal = {
    title: "Run a marathon without stopping to walk",
    event: "10km City2Surf Fun Run in under 50m",
    daysLeft: 35,
  };

  // Dummy check-in status for metrics (simulate checked-in for last 7 days)
  const checkedIn = [true, true, true, false, true, false, true];

  const dummyNotes = [
    { text: "Need program while traveling for 2 weeks", date: "May 10" },
  ];
  const RANGE_OPTIONS = [
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-[#faf9f8]">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 mt-8 px-2 md:px-0">
        {/* Sidebar */}
        <div className="w-full md:w-72 flex flex-col gap-6 shrink-0">
          {/* Only show other clients as small cards */}
          <ClientManagementCard currentClientId={clientId} />
          {/* Goal & Countdown */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Flag className="h-4 w-4 text-yellow-500" /> Goal & Countdown</h3>
            <div className="mb-2">
              <div className="text-xs text-gray-400 mb-1">General Goal</div>
              <div className="font-medium text-sm mb-2">{goal.title}</div>
              <div className="flex items-center gap-2 bg-yellow-50 rounded px-2 py-1 text-xs font-medium text-yellow-700 w-fit mb-2">
                <Flag className="h-4 w-4" /> {goal.event}
                <span className="ml-2 bg-yellow-200 text-yellow-800 rounded px-2 py-0.5 font-bold">{goal.daysLeft} Days</span>
              </div>
            </div>
          </div>
          {/* Notes */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Notes</h3>
              <button className="text-gray-400 hover:text-blue-500" title="Edit notes"><Edit2 className="h-4 w-4" /></button>
            </div>
            <ul className="text-sm text-gray-700 dark:text-gray-300">
              {dummyNotes.map((note, i) => (
                <li key={i} className="mb-1 flex items-center gap-2">
                  <span>{note.text}</span>
                  <span className="text-xs text-gray-400 ml-2">{note.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6 items-center">
          {/* Training Summary */}
          <div className="bg-[#fcfbfa] rounded-2xl border border-[#f2efed] px-6 pt-4 pb-2 mb-2 w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-lg text-gray-700">Training</span>
              <button className="text-sm text-gray-400 hover:text-blue-500 font-medium">Open Calendar</button>
            </div>
            <div className="flex divide-x divide-gray-200">
              <div className="flex-1 flex flex-col items-center py-4">
                <div className="text-xs text-gray-400 mb-1">LAST 7 DAYS</div>
                <div className="text-3xl font-bold text-slate-700">3/3</div>
                <div className="text-sm text-green-500 font-medium">Tracked</div>
              </div>
              <div className="flex-1 flex flex-col items-center py-4">
                <div className="text-xs text-gray-400 mb-1">LAST 30 DAYS</div>
                <div className="text-3xl font-bold text-slate-700">4/4</div>
                <div className="text-sm text-green-500 font-medium">Tracked</div>
              </div>
              <div className="flex-1 flex flex-col items-center py-4">
                <div className="text-xs text-gray-400 mb-1">NEXT WEEK</div>
                <div className="text-3xl font-bold text-slate-700">2</div>
                <div className="text-sm text-green-500 font-medium">Assigned</div>
              </div>
            </div>
          </div>
          {/* Metrics Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow border border-slate-200 dark:border-slate-700 w-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Body Metrics Overview</h2>
              <div className="flex gap-2 bg-slate-100 rounded-lg p-1 shadow-inner">
                {RANGE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`px-3 py-1 rounded transition font-medium text-sm ${range === opt.value ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:bg-slate-200'}`}
                    onClick={() => setRange(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Weight Card */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700 shadow flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-gray-500 text-sm font-medium">Weight</div>
                  <button className="text-gray-400 hover:text-blue-500" title="More options"><span className="text-lg">≡</span></button>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-2xl font-bold">74.4 <span className="text-base font-normal text-gray-400">kg</span></span>
                  <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">↓ 0.8%</span>
                </div>
                <div className="h-16 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData}>
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Check-in status */}
                <div className="flex gap-1 mt-1">
                  {checkedIn.map((checked, i) => (
                    <span key={i} className={`inline-block w-2 h-2 rounded-full ${checked ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  ))}
                </div>
              </div>
              {/* Heart Rate Card */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-red-200 dark:border-red-700 shadow flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-gray-500 text-sm font-medium">Resting Heart Rate</div>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-2xl font-bold">66 <span className="text-base font-normal text-gray-400">bpm</span></span>
                  <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">↓ 5.7%</span>
                </div>
                <div className="h-16 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={heartRateData}>
                      <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={false} />
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Sleep Card */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-cyan-200 dark:border-cyan-700 shadow flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-gray-500 text-sm font-medium">Sleep</div>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-2xl font-bold">6h 58min</span>
                </div>
                <div className="h-16 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sleepData}>
                      <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Steps Card */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-orange-200 dark:border-orange-700 shadow flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-gray-500 text-sm font-medium">Steps</div>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-2xl font-bold">7503</span>
                  <span className="text-xs text-gray-400 ml-2">Average last 7 days</span>
                </div>
                <div className="h-16 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stepsData}>
                      <Bar dataKey="value" fill="#f59e42" radius={[4, 4, 0, 0]} />
                      <XAxis dataKey="date" />
                      <YAxis hide />
                      <Tooltip />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          {/* Schedule Section */}
          <div className="w-full">
            <h2 className="text-lg font-semibold mb-3">Schedule</h2>
            <ClientSchedule clientId={clientId} />
          </div>
        </div>
      </div>
    </div>
  );
} 