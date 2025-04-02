import { format, formatDistanceToNow, isValid } from "date-fns";

/**
 * Formats a date string in a human-readable format
 * 
 * @param dateString ISO date string or any valid date format
 * @param showTime Whether to show the time in the formatted date
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, showTime = false): string => {
  try {
    const date = new Date(dateString);
    
    if (!isValid(date)) {
      return "Invalid date";
    }
    
    // If it's today, show relative time
    const isToday = new Date().toDateString() === date.toDateString();
    
    if (isToday) {
      return showTime 
        ? `Today at ${format(date, "h:mm a")}`
        : "Today";
    }
    
    // If it's within the last week, show relative time
    const isRecent = Date.now() - date.getTime() < 7 * 24 * 60 * 60 * 1000;
    
    if (isRecent) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    // Otherwise, show the actual date
    return showTime
      ? format(date, "MMM d, yyyy 'at' h:mm a")
      : format(date, "MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};
