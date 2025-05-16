import { useLocation } from "wouter";
import { useTheme } from "@/context/ThemeContext";
import * as Icons from "@/lib/icons";
import { Button } from "@/components/ui/button";

const TopBar: React.FC = () => {
  const [location] = useLocation();
  const { toggleTheme, theme } = useTheme();

  // Format the page title based on the current location
  const getPageTitle = () => {
    const path = location.split("/")[1];
    
    if (path === "") return "Dashboard / Home";
    
    const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);
    return `Dashboard / ${formattedPath}`;
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-xl font-semibold">{getPageTitle()}</h2>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
          >
            {theme === "dark" ? (
              <Icons.SunIcon className="h-5 w-5" />
            ) : (
              <Icons.MoonIcon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 relative"
          >
            <Icons.BellIcon className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary-600 rounded-full"></span>
          </Button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-200 dark:border-primary-800">
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120"
              alt="User profile"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
