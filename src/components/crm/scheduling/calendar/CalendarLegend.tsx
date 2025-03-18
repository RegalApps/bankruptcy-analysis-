
export const CalendarLegend = () => {
  return (
    <div>
      <h3 className="text-sm font-medium">Legend</h3>
      <div className="space-y-2 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-sm">High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500"></div>
          <span className="text-sm">Medium Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-sm">Regular Meetings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-sm">Self-booked Meetings</span>
        </div>
      </div>
    </div>
  );
};
