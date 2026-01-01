import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = position === 'top' 
    ? 'bottom-full mb-2' 
    : 'top-full mt-2';

  const arrowClasses = position === 'top'
    ? 'top-full border-t-slate-900 dark:border-t-slate-700'
    : 'bottom-full border-b-slate-900 dark:border-b-slate-700';

  return (
    <div 
      className="relative flex items-center z-40"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium text-white bg-slate-900 dark:bg-slate-700 rounded shadow-lg whitespace-nowrap pointer-events-none animate-fade-in ${positionClasses}`}>
          {content}
          <div className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${arrowClasses}`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;