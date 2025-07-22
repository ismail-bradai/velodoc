// components/Calendar/calendarData.ts

export interface CalendarEvent {
  name: string;
  startTime: string; // format "HH:MM"
  endTime: string;   // format "HH:MM"
}

export type WeeklyCalendarData = {
  [day: string]: CalendarEvent[];
};

export const calendarData: WeeklyCalendarData = {
  Monday: [
    { name: "Yousef Al Amiri", startTime: "09:00", endTime: "10:00" },
    { name: "Fatima Al Mansoori", startTime: "11:30", endTime: "13:00" },
    { name: "Ali Yamamoto", startTime: "14:00", endTime: "15:00" },
    { name: "Samira Khan", startTime: "16:00", endTime: "17:30" }
  ],
  Tuesday: [
    { name: "Layla Al Zarouni", startTime: "08:30", endTime: "10:30" },
    { name: "Omar Al Suwaidi", startTime: "12:00", endTime: "13:00" },
    { name: "Chen Wei", startTime: "14:30", endTime: "16:30" }
  ],
  Wednesday: [
    { name: "Tariq Smith", startTime: "09:00", endTime: "11:00" },
    { name: "Reem Patel", startTime: "13:00", endTime: "14:00" },
    { name: "Aisha Al Qasimi", startTime: "15:00", endTime: "17:00" }
  ],
  Thursday: [
    { name: "Huda Khan", startTime: "08:00", endTime: "09:30" },
    { name: "Hassan Al Remeithi", startTime: "10:00", endTime: "12:00" },
    { name: "Mohammed Al Falasi", startTime: "14:00", endTime: "15:30" }
  ],
  Friday: [
    { name: "Maha Al Mehairi", startTime: "09:30", endTime: "11:00" },
    { name: "Imran Siddiqui", startTime: "11:30", endTime: "13:30" },
    { name: "Latifa Al Shamsi", startTime: "14:30", endTime: "16:00" }
  ]
};
