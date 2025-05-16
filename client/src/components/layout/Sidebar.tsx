import { Link, useRoute } from "wouter";
import { cn } from "@/lib/utils";
import * as Icons from "@/lib/icons";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  alert?: boolean;
}

const navigationItems: NavItem[] = [
  {
    name: "Smart Alerts",
    href: "/",
    icon: <Icons.BellIcon className="h-5 w-5" />,
    alert: true,
  },
  {
    name: "Clients",
    href: "/clients",
    icon: <Icons.UsersIcon className="h-5 w-5" />,
  },
  {
    name: "Nutrition Plans",
    href: "/nutrition-plans",
    icon: <Icons.UtensilsIcon className="h-5 w-5" />,
  },
  {
    name: "Fitness Plans",
    href: "/fitness-plans",
    icon: <Icons.DumbbellIcon className="h-5 w-5" />,
  },
  {
    name: "Plan Library",
    href: "/plans",
    icon: <Icons.ClipboardIcon className="h-5 w-5" />,
  },
  {
    name: "Notes & Logs",
    href: "/notes",
    icon: <Icons.ScrollIcon className="h-5 w-5" />,
  },
  {
    name: "Branding",
    href: "/branding",
    icon: <Icons.PaintbrushIcon className="h-5 w-5" />,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: <Icons.CreditCardIcon className="h-5 w-5" />,
  },
];

const secondaryNavItems: NavItem[] = [
  {
    name: "Log out",
    href: "/logout",
    icon: <Icons.LogOutIcon className="h-5 w-5" />,
  },
];

const Sidebar: React.FC = () => {
  return (
    <div className="fixed inset-y-0 left-0 w-16 md:w-64 bg-white dark:bg-slate-800 shadow-lg z-30 transition-all duration-300 ease-in-out">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center px-4 py-5 border-b border-gray-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120"
              alt="Trainer profile"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="hidden md:block">
            <h1 className="font-semibold text-lg">FitProDash</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              info@fitprodash.com
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 overflow-y-auto scrollbar-thin">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => (
              <NavItem
                key={item.name}
                href={item.href}
                icon={item.icon}
                name={item.name}
              />
            ))}
          </ul>

          {/* Divider */}
          <div className="border-t my-6 border-gray-200 dark:border-gray-700"></div>

          {/* Secondary Navigation */}
          <ul className="space-y-1 px-2">
            {secondaryNavItems.map((item) => (
              <NavItem
                key={item.name}
                href={item.href}
                icon={item.icon}
                name={item.name}
                alert={item.alert}
              />
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  name: string;
  alert?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, name, alert }) => {
  const [isActive] = useRoute(href === "/" ? href : `${href}/*`);

  return (
    <li>
      <Link href={href}>
        <div
          className={cn(
            "flex items-center px-3 py-3 rounded-lg transition",
            isActive
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
          )}
        >
          <span className="flex items-center justify-center w-8 h-8 relative">
            {icon}
            {alert && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
            )}
          </span>
          <span className="hidden md:inline ml-3">{name}</span>
        </div>
      </Link>
    </li>
  );
};

export default Sidebar;
