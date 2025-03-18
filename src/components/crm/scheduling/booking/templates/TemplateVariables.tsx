
import React from "react";

export const TemplateVariables = () => {
  return (
    <div className="text-xs text-muted-foreground mt-4">
      <p className="mb-2">Available Variables:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>{"{{clientName}}"} - Client's full name</li>
        <li>{"{{bookingLink}}"} - Self-booking portal link</li>
        <li>{"{{caseType}}"} - Type of insolvency case</li>
        <li>{"{{appointmentDate}}"} - Scheduled date</li>
        <li>{"{{appointmentTime}}"} - Scheduled time</li>
        <li>{"{{trusteeName}}"} - Assigned trustee</li>
        <li>{"{{officeAddress}}"} - Office location</li>
      </ul>
    </div>
  );
};
