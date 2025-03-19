
export interface Author {
  id: string;
  name: string;
  avatar: string;
}

export interface Reply {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
  upvotes: number;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: string;
  upvotes: number;
  author: Author;
  replies: Reply[];
  status: "open" | "resolved";
}

export const mockSupportData = {
  topics: [
    {
      id: "1",
      title: "Unable to upload PDF files larger than 10MB",
      description: "I'm trying to upload a 12MB PDF file but keep getting an error message. The system says there's a 25MB limit, but I can't seem to get past 10MB. Has anyone else encountered this issue?",
      category: "general",
      timestamp: "2 hours ago",
      upvotes: 12,
      author: {
        id: "user1",
        name: "John Doe",
        avatar: "",
      },
      replies: [
        {
          id: "r1",
          author: {
            id: "user2",
            name: "Admin User",
            avatar: "",
          },
          content: "We're aware of this issue and our team is working on a fix. As a temporary workaround, you can try splitting the PDF into smaller files or compressing it before uploading.",
          timestamp: "1 hour ago",
          upvotes: 5,
        },
        {
          id: "r2",
          author: {
            id: "user3",
            name: "Sarah Connor",
            avatar: "",
          },
          content: "I had the same problem and found that using a different browser solved it for me. Chrome worked when Firefox didn't.",
          timestamp: "30 minutes ago",
          upvotes: 3,
        },
      ],
      status: "open",
    },
    {
      id: "2",
      title: "AI analysis not recognizing form fields correctly",
      description: "The AI seems to be missing several fields when analyzing Form 76. It's consistently misreading the debtor information section. Is this a known issue?",
      category: "ai",
      timestamp: "1 day ago",
      upvotes: 8,
      author: {
        id: "user4",
        name: "Robert Johnson",
        avatar: "",
      },
      replies: [
        {
          id: "r3",
          author: {
            id: "user5",
            name: "AI Support Team",
            avatar: "",
          },
          content: "This is a known issue with certain Form 76 templates. We're training our AI to better recognize these fields. In the meantime, you can manually enter this information, and our system will learn from your corrections.",
          timestamp: "20 hours ago",
          upvotes: 4,
        },
      ],
      status: "open",
    },
    {
      id: "3",
      title: "Need help with BIA compliance for bankruptcy forms",
      description: "I'm unsure if our generated forms are fully compliant with the latest BIA regulations. Are there any specific settings I should be aware of?",
      category: "legal",
      timestamp: "3 days ago",
      upvotes: 15,
      author: {
        id: "user6",
        name: "Jane Smith",
        avatar: "",
      },
      replies: [
        {
          id: "r4",
          author: {
            id: "user7",
            name: "Legal Team",
            avatar: "",
          },
          content: "All forms generated through our platform are automatically updated to comply with the latest BIA regulations. The most recent update was on April 15, 2023. You can verify this in the document footer which should show the compliance version number.",
          timestamp: "2 days ago",
          upvotes: 7,
        },
        {
          id: "r5",
          author: {
            id: "user8",
            name: "Compliance Officer",
            avatar: "",
          },
          content: "To add to what the Legal Team mentioned, you can also run a compliance check on any document by clicking the 'Verify Compliance' button in the document viewer. This will highlight any potential issues.",
          timestamp: "2 days ago",
          upvotes: 6,
        },
      ],
      status: "resolved",
    },
    {
      id: "4",
      title: "Request for batch upload feature",
      description: "It would be very helpful if we could upload multiple files at once, especially when dealing with large cases that require many supporting documents.",
      category: "feature",
      timestamp: "5 days ago",
      upvotes: 27,
      author: {
        id: "user9",
        name: "Michael Chen",
        avatar: "",
      },
      replies: [
        {
          id: "r6",
          author: {
            id: "user10",
            name: "Product Manager",
            avatar: "",
          },
          content: "Thanks for the suggestion! We're actually working on a batch upload feature right now, which should be available in our next update. It will include folder uploads and multiple file selection.",
          timestamp: "4 days ago",
          upvotes: 15,
        },
      ],
      status: "open",
    },
    {
      id: "5",
      title: "Dark mode implementation issues",
      description: "The dark mode looks great, but I've noticed some text fields become hard to read. The contrast seems off in certain areas of the application.",
      category: "general",
      timestamp: "2 days ago",
      upvotes: 6,
      author: {
        id: "user11",
        name: "Emily Rodriguez",
        avatar: "",
      },
      replies: [
        {
          id: "r7",
          author: {
            id: "user12",
            name: "UX Designer",
            avatar: "",
          },
          content: "Thank you for bringing this to our attention! Could you please specify which sections are causing issues? Screenshots would be very helpful. We're committed to making dark mode fully accessible.",
          timestamp: "1 day ago",
          upvotes: 2,
        },
      ],
      status: "open",
    },
  ],
};
