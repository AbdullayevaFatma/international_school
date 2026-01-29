import { Ellipsis } from "lucide-react";
import EventList from "./EventList";
import EventCalendar from "./EventCalendar";

export const EventCalendarContainer = async ({ searchParams }) => {
  const { date } = (await searchParams) || {};
  return (
    <div className="bg-white p-4 rounded-md">
      <EventCalendar />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Ellipsis width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        <EventList dateParam={date} />
      </div>
    </div>
  );
};
