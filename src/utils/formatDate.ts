
export function formatDate(dateString: string): string {
  if (!dateString) return "Unknown date";
  
  try {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    
    // Get current date for comparison
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format date part
    let datePart: string;
    
    if (date >= today) {
      datePart = "Today";
    } else if (date >= yesterday) {
      datePart = "Yesterday";
    } else {
      // Use locale date formatting
      datePart = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    // Format time part
    const timePart = date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${datePart} at ${timePart}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString || "Unknown date";
  }
}
