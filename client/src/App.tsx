import { Switch, Route, useLocation } from "wouter";
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
import Login from "@/pages/login";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import ClientProfilePage from "./pages/ClientProfilePage";

// Protected route wrapper
const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const [location] = useLocation();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated && location !== "/login") {
    return <Login />;
  }

  return <Component {...rest} />;
};

function Router() {
  const [location] = useLocation();
  const isLoginPage = location === "/login";

  if (isLoginPage) {
    return <Login />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200">
      <Sidebar />
      <div className="flex-1 ml-16 md:ml-64">
        <TopBar />
        <main className="p-6">
          <Switch>
            <Route path="/" component={(props: any) => <ProtectedRoute component={Dashboard} {...props} />} />
            <Route path="/clients" component={(props: any) => <ProtectedRoute component={Clients} {...props} />} />
            <Route path="/client/:id" component={(props: any) => <ProtectedRoute component={ClientProfilePage} {...props} />} />
            <Route path="/plans" component={(props: any) => <ProtectedRoute component={Plans} {...props} />} />
            <Route path="/nutrition-plans" component={(props: any) => <ProtectedRoute component={NutritionPlans} {...props} />} />
            <Route path="/fitness-plans" component={(props: any) => <ProtectedRoute component={FitnessPlans} {...props} />} />
            <Route path="/notes" component={(props: any) => <ProtectedRoute component={Notes} {...props} />} />
            <Route path="/payments" component={(props: any) => <ProtectedRoute component={Payments} {...props} />} />
            <Route path="/branding" component={(props: any) => <ProtectedRoute component={Branding} {...props} />} />
            <Route path="/alerts" component={(props: any) => <ProtectedRoute component={Alerts} {...props} />} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
