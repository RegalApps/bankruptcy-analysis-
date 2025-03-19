
export const getRiskLevelExplanation = (level: 'low' | 'medium' | 'high') => {
  switch (level) {
    case 'low':
      return "The client demonstrates strong financial stability with manageable debt levels and consistent income. Their documents are well-organized and compliant with regulatory requirements. Regular monitoring is still recommended but there are no immediate concerns.";
    case 'medium':
      return "The client shows some financial pressure points with moderately elevated debt-to-income ratio. There may be minor documentation issues or compliance gaps that require attention. Closer monitoring and proactive intervention is recommended to prevent escalation to high risk.";
    case 'high':
      return "The client exhibits significant financial distress with high debt levels relative to income. There are notable documentation deficiencies or compliance violations that require immediate attention. Urgent intervention is recommended to mitigate legal and financial risks.";
  }
};

export const getRiskScoreExplanation = (score: number) => {
  if (score < 30) {
    return "Score indicates minimal risk with strong compliance adherence and financial stability. The client maintains proper documentation and follows required procedures.";
  } else if (score < 60) {
    return "Score indicates moderate risk factors present. Some documentation may require updates or financial indicators show potential pressure points that should be monitored.";
  } else {
    return "Score indicates significant risk factors that require immediate attention. Serious compliance issues or financial distress indicators are present that could lead to regulatory or legal consequences if not addressed promptly.";
  }
};

export const getComplianceExplanation = (status: 'compliant' | 'issues' | 'critical') => {
  switch (status) {
    case 'compliant':
      return "All regulatory requirements are being met. Documentation is complete, accurate, and up-to-date. The client is adhering to all applicable legal and regulatory obligations.";
    case 'issues':
      return "There are minor compliance gaps or documentation issues that need to be addressed. While not critical, these issues could escalate if left unattended and should be resolved according to regulatory timeframes.";
    case 'critical':
      return "Serious compliance violations or documentation deficiencies exist that require immediate attention. These issues pose significant legal or regulatory risks and must be addressed as a top priority to avoid penalties or other consequences.";
  }
};
