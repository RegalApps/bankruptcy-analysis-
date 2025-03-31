
export const feedbackQuestions = {
  technical: [
    {
      id: "application",
      question: "Which application did you use to attend your meeting today?",
      options: [
        "Zoom", 
        "Google Meet", 
        "Microsoft Teams", 
        "TeamViewer",
        "SecureFiles AI (internal video call)",
        "Phone call (voice only)",
        "Other"
      ],
      allowOther: true
    },
    {
      id: "quality",
      question: "How was the video/audio quality during your meeting?",
      options: [
        "Excellent (clear video/audio, no interruptions)",
        "Good (minor issues, but didn't affect understanding)",
        "Fair (occasional issues, somewhat distracting)",
        "Poor (frequent disruptions, difficult to follow)"
      ]
    }
  ],
  clarity: [
    {
      id: "understanding",
      question: "Did you clearly understand the information provided in today's meeting?",
      options: [
        "Completely clear",
        "Mostly clear",
        "Somewhat unclear",
        "Completely unclear"
      ]
    },
    {
      id: "questions_answered",
      question: "Were your questions answered to your satisfaction?",
      options: [
        "Completely",
        "Mostly",
        "Somewhat",
        "Not at all"
      ]
    },
    {
      id: "next_steps",
      question: "Did you feel well-informed about the next steps after today's meeting?",
      options: [
        "Extremely informed",
        "Adequately informed",
        "Slightly informed",
        "Not informed at all"
      ]
    }
  ],
  comfort: [
    {
      id: "sensitive_issues",
      question: "Did you feel comfortable discussing sensitive issues today?",
      options: [
        "Very comfortable",
        "Moderately comfortable",
        "Slightly uncomfortable",
        "Very uncomfortable"
      ]
    },
    {
      id: "trust",
      question: "Do you trust the trustee to handle your case professionally?",
      options: [
        "Completely trust",
        "Mostly trust",
        "Somewhat doubt",
        "Completely doubt"
      ]
    },
    {
      id: "approachability",
      question: "How approachable and friendly was your trustee during the meeting?",
      options: [
        "Very approachable",
        "Approachable",
        "Neutral",
        "Unapproachable"
      ]
    }
  ],
  professionalism: [
    {
      id: "knowledge",
      question: "How satisfied were you with the trustee's professional knowledge?",
      options: [
        "Extremely satisfied",
        "Satisfied",
        "Neutral",
        "Dissatisfied"
      ]
    },
    {
      id: "communication",
      question: "Did the trustee communicate clearly and effectively?",
      options: [
        "Extremely effectively",
        "Effectively",
        "Somewhat effectively",
        "Ineffectively"
      ]
    },
    {
      id: "respect",
      question: "Did you feel your trustee respected your opinions and concerns?",
      options: [
        "Highly respected",
        "Generally respected",
        "Somewhat ignored",
        "Completely ignored"
      ]
    }
  ],
  future: [
    {
      id: "confidence",
      question: "Do you feel more confident about your financial situation after this meeting?",
      options: [
        "Much more confident",
        "Slightly more confident",
        "No change",
        "Less confident"
      ]
    }
  ]
};
