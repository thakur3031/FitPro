import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./context/ThemeContext";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import Plans from "@/pages/Plans";
import NutritionPlans from "@/pages/NutritionPlans";
import FitnessPlans from "@/pages/FitnessPlans";
import Notes from "@/pages/Notes";
import Payments from "@/pages/Payments";
import Branding from "@/pages/Branding";
import Alerts from "@/pages/Alerts";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

function Router() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200">
      <Sidebar />
      <div className="flex-1 ml-16 md:ml-64">
        <TopBar />
        <main className="p-6">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/clients" component={Clients} />
            <Route path="/plans" component={Plans} />
            <Route path="/nutrition-plans" component={NutritionPlans} />
            <Route path="/fitness-plans" component={FitnessPlans} />
            <Route path="/notes" component={Notes} />
            <Route path="/payments" component={Payments} />
            <Route path="/branding" component={Branding} />
            <Route path="/alerts" component={Alerts} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
