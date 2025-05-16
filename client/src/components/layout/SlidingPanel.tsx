import { useState, useEffect } from "react";
import * as Icons from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SlidingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const SlidingPanel: React.FC<SlidingPanelProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);
  
  if (!isVisible && !isOpen) {
    return null;
  }
  
  const getSizeClass = () => {
    switch(size) {
      case 'sm':
        return 'w-full sm:w-[300px]';
      case 'lg':
        return 'w-full sm:w-[600px]';
      case 'md':
      default:
        return 'w-full sm:w-[450px]';
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/30 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={cn(
          "h-full overflow-auto bg-white dark:bg-slate-800 shadow-xl transition-transform duration-300 transform border-l border-gray-200 dark:border-gray-700",
          getSizeClass(),
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <h2 className="font-semibold text-lg">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icons.XIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SlidingPanel;