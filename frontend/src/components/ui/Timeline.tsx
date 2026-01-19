import React from 'react';

export interface TimelineItem {
  id: string | number;
  title: string;
  date?: string;
  status: 'pending' | 'funded' | 'completed';
  description?: string;
  amount?: { current: number; total: number };
}

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {items.map((item, itemIdx) => (
          <li key={item.id}>
            <div className="relative pb-8">
              {itemIdx !== items.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                    item.status === 'completed' ? 'bg-green-500' : 
                    item.status === 'funded' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                     {item.status === 'completed' ? '✓' : 
                      item.status === 'funded' ? '$' : '•'}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {item.title} 
                      {item.date && <span className="ml-2 font-medium text-gray-900">{item.date}</span>}
                    </p>
                    {item.description && <p className="mt-1 text-sm text-gray-600">{item.description}</p>}
                  </div>
                  {item.amount && (
                     <div className="text-right text-sm whitespace-nowrap text-gray-500">
                       <span className={item.amount.current >= item.amount.total ? 'text-green-600 font-bold' : ''}>
                         ${item.amount.current}
                       </span> / ${item.amount.total}
                     </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
