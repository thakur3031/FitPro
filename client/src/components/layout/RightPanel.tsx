import { useState } from 'react';
import { Button } from '@/components/ui/button';
import * as Icons from '@/lib/icons';

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const RightPanel: React.FC<RightPanelProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-slate-800 shadow-lg z-20 border-l border-gray-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-thin">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <Icons.XIcon className="h-5 w-5" />
          </Button>
        </div>
        
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{description}</p>
        )}
        
        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
