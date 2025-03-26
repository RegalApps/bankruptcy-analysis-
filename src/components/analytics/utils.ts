
export const getTabDescription = (tabId: string): string => {
  switch (tabId) {
    case "client":
      return "Insights into client acquisition, retention, and case progression metrics";
    case "operations":
      return "Analytics on staff productivity, workflow efficiency, and process performance";
    case "compliance":
      return "Tracking regulatory compliance, risk assessments, and audit performance";
    case "documents":
      return "Document processing metrics, accuracy rates, and management performance";
    case "marketing":
      return "Lead generation analytics, conversion rates, and channel effectiveness";
    case "predictive":
      return "AI-powered forecasting for future trends and proactive decision making";
    case "trustees":
      return "Performance metrics for trustees and staff members";
    case "usage":
      return "Platform usage patterns, feature adoption, and user engagement";
    case "geographic":
      return "Regional performance metrics and location-based analysis";
    case "health":
      return "System reliability, performance metrics, and technical diagnostics";
    default:
      return "";
  }
};

export const getMockDocumentData = () => {
  return {
    taskVolume: [
      { month: "Jan", tasks: 120 },
      { month: "Feb", tasks: 150 },
      { month: "Mar", tasks: 180 },
      { month: "Apr", tasks: 170 },
      { month: "May", tasks: 190 },
      { month: "Jun", tasks: 210 }
    ],
    timeSaved: [
      { month: "Jan", hours: 45 },
      { month: "Feb", hours: 50 },
      { month: "Mar", hours: 65 },
      { month: "Apr", hours: 70 },
      { month: "May", hours: 85 },
      { month: "Jun", hours: 95 }
    ],
    errorReduction: [
      { month: "Jan", errors: 30 },
      { month: "Feb", errors: 25 },
      { month: "Mar", errors: 20 },
      { month: "Apr", errors: 15 },
      { month: "May", errors: 12 },
      { month: "Jun", errors: 8 }
    ]
  };
};
