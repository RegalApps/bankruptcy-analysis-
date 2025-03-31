
import { toast } from "@/hooks/use-toast";

/**
 * Generate a sharing link for a specific meeting
 */
export const generateMeetingLink = (meetingId: string): string => {
  // In a real app, this would likely generate a unique URL with authentication tokens
  // For now, we'll create a simple link to the notes page with the meeting ID as a parameter
  const baseUrl = window.location.origin;
  return `${baseUrl}/meetings/notes-standalone?meeting=${meetingId}`;
};

/**
 * Share meeting details via email (template)
 */
export const shareMeetingViaEmail = (
  meetingId: string,
  meetingTitle: string,
  recipientEmails: string[]
): void => {
  // In a production app, this would connect to an email API
  // For now, we'll open the default email client with a pre-populated template
  const subject = encodeURIComponent(`Meeting Invitation: ${meetingTitle}`);
  const meetingLink = generateMeetingLink(meetingId);
  const body = encodeURIComponent(
    `You've been invited to join the following meeting:\n\n` +
    `${meetingTitle}\n\n` +
    `Access meeting details here: ${meetingLink}\n\n` +
    `This link provides access to meeting notes and agenda items.`
  );
  
  const mailtoLink = `mailto:${recipientEmails.join(',')}?subject=${subject}&body=${body}`;
  
  // Open the default email client
  window.open(mailtoLink);
  
  toast({
    description: "Email client opened with meeting details",
  });
};

/**
 * Copy meeting link to clipboard
 */
export const copyMeetingLink = (meetingId: string, meetingTitle: string): void => {
  const link = generateMeetingLink(meetingId);
  
  navigator.clipboard.writeText(link).then(() => {
    toast({
      description: `Link to "${meetingTitle}" copied to clipboard`,
    });
  }).catch(err => {
    console.error('Failed to copy link:', err);
    toast({
      description: "Failed to copy link. Please try again.",
      variant: "destructive",
    });
  });
};
