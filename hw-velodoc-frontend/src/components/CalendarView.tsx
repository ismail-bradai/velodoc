// components/Calendar/CalendarView.tsx

import React from 'react';
import { calendarData, WeeklyCalendarData } from './calendarData';

const hours = Array.from({ length: 16 }, (_, i) => i + 7); // 7 AM to 10 PM
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const getTimeInMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const CalendarView = () => {
  return (
      <div className="min-w-[1000px] bg-white border  rounded-xl overflow-hidden shadow-sm">
        {/* Day Header */}
        <div className="flex sticky top-0 z-10 bg-white border-b border-blue-200">
          <div className="w-[60px]" />
          {days.map(day => (
            <div key={day} className="flex-1 text-center text-sm font-medium py-3 border-r border-blue-200 text-blue-900">
              {day}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Time Labels */}
          <div className="w-[60px] border-r border-blue-200 text-xs text-gray-500 flex flex-col">
            {hours.map(hour => (
              <div key={hour} className="h-[60px] pl-1 pt-1">
                {hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 grid grid-cols-5 relative">
            {days.map(day => (
              <div key={day} className="relative border-r border-blue-200 h-[960px]"> {/* 16 * 60px = 960px */}
                {/* Hour lines */}
                {hours.map((_, i) => (
                  <div key={i} className="absolute left-0 right-0 border-t border-blue-50" style={{ top: `${i * 60}px` }} />
                ))}

                {/* Events */}
                {calendarData[day]?.map((event, index) => {
                  const start = getTimeInMinutes(event.startTime);
                  const end = getTimeInMinutes(event.endTime);
                  const top = ((start - 420) / 60) * 60; // offset from 7 AM (7*60 = 420)
                  const height = ((end - start) / 60) * 60;

                  return (
                    <div
                      key={event.name + index}
                      className="absolute left-2 right-2 bg-blue-100 text-blue-900 text-[11px] px-2 py-1 rounded-md shadow-sm"
                      style={{ top: `${top}px`, height: `${height}px` }}
                    >
                      {event.name}
                      <div className="text-[10px] text-gray-500">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
   
  );
};

export default CalendarView;
