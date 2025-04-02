
import { toast } from "sonner";

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
  
  toast("Email client opened with meeting details");
};

/**
 * Copy meeting link to clipboard
 */
export const copyMeetingLink = (meetingId: string, meetingTitle: string): void => {
  const link = generateMeetingLink(meetingId);
  
  navigator.clipboard.writeText(link).then(() => {
    toast(`Link to "${meetingTitle}" copied to clipboard`);
  }).catch(err => {
    console.error('Failed to copy link:', err);
    toast("Failed to copy link. Please try again.");
  });
};

// Add functions for generating and sharing feedback form links
export const generateFeedbackFormLink = (meetingId: string, meetingTitle: string, clientName?: string): string => {
  const baseUrl = window.location.origin;
  const queryParams = new URLSearchParams();
  
  queryParams.set('id', meetingId);
  if (meetingTitle) queryParams.set('title', encodeURIComponent(meetingTitle));
  if (clientName) queryParams.set('client', encodeURIComponent(clientName));
  
  return `${baseUrl}/meetings/feedback-standalone?${queryParams.toString()}`;
};

export const shareFeedbackFormViaEmail = (
  meetingId: string,
  meetingTitle: string,
  clientName: string,
  recipientEmail: string,
  customMessage?: string
): void => {
  const subject = encodeURIComponent(`Your feedback is important to us: ${meetingTitle}`);
  const feedbackLink = generateFeedbackFormLink(meetingId, meetingTitle, clientName);
  
  const defaultMessage = `Dear ${clientName},\n\n` +
    `Thank you for attending our recent meeting regarding "${meetingTitle}".\n\n` +
    `We value your feedback and would appreciate if you could take a moment to share your thoughts with us:\n\n` +
    `${feedbackLink}\n\n` +
    `Your input helps us improve our services and ensure we're meeting your needs.\n\n` +
    `Thank you for your time,\n` +
    `Your Trustee`;
    
  const body = encodeURIComponent(customMessage || defaultMessage);
  
  const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
  
  // Open the default email client
  window.open(mailtoLink);
};

export const copyFeedbackFormLink = (meetingId: string, meetingTitle: string, clientName?: string): void => {
  const link = generateFeedbackFormLink(meetingId, meetingTitle, clientName);
  
  navigator.clipboard.writeText(link).then(() => {
    toast("Feedback form link copied to clipboard");
  }).catch(err => {
    console.error('Failed to copy link:', err);
    toast("Failed to copy link. Please try again.");
  });
};
