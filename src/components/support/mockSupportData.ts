
export const mockSupportData = {
  topics: [
    {
      id: "topic-1",
      title: "How to upload multi-page documents",
      category: "general",
      description: "Learn how to properly upload and process multi-page documents in the system for optimal analysis.",
      upvotes: 24,
      timestamp: "2 days ago",
      author: {
        name: "John Smith",
        avatar: ""
      },
      replies: [
        {
          id: "reply-1",
          author: "Anna Johnson",
          content: "You can upload multi-page PDFs directly. The system will automatically process each page.",
          timestamp: "1 day ago"
        },
        {
          id: "reply-2",
          author: "Support Team",
          content: "For best results, ensure your PDF is properly formatted and under 20MB in size.",
          timestamp: "12 hours ago"
        }
      ]
    },
    {
      id: "topic-2",
      title: "AI analysis not recognizing form fields correctly",
      category: "ai",
      description: "The AI seems to be missing key fields on my Form 47 documents. Is there a way to improve recognition?",
      upvotes: 18,
      timestamp: "3 days ago",
      author: {
        name: "Maria Garcia",
        avatar: ""
      },
      replies: [
        {
          id: "reply-3",
          author: "Technical Support",
          content: "We've recently improved our Form 47 recognition. Try re-uploading your document or use the manual field entry feature.",
          timestamp: "2 days ago"
        }
      ]
    },
    {
      id: "topic-3",
      title: "Best practices for organizing client documents",
      category: "general",
      description: "Looking for recommendations on how to efficiently organize large numbers of client documents in the system.",
      upvotes: 32,
      timestamp: "5 days ago",
      author: {
        name: "Robert Chen",
        avatar: ""
      },
      replies: [
        {
          id: "reply-4",
          author: "Emily Wilson",
          content: "I use client name folders with subfolders for document types. The AI folder recommendations feature is also helpful.",
          timestamp: "4 days ago"
        },
        {
          id: "reply-5",
          author: "Michael Brown",
          content: "Don't forget you can set up automated workflows to sort new documents as they come in.",
          timestamp: "3 days ago"
        },
        {
          id: "reply-6",
          author: "Support Team",
          content: "Check out our KB article on document organization: link-to-article",
          timestamp: "2 days ago"
        }
      ]
    },
    {
      id: "topic-4",
      title: "Compliance requirements for storing client financial data",
      category: "legal",
      description: "What are the key compliance requirements we need to follow when storing sensitive financial information?",
      upvotes: 41,
      timestamp: "1 week ago",
      author: {
        name: "Sarah Johnson",
        avatar: ""
      },
      replies: [
        {
          id: "reply-7",
          author: "Legal Team",
          content: "Our system is fully compliant with PIPEDA requirements. Make sure you're using the secured client folders feature.",
          timestamp: "6 days ago"
        }
      ]
    },
    {
      id: "topic-5",
      title: "Request for bulk document export feature",
      category: "feature",
      description: "It would be great to have a way to export multiple documents at once, especially for client file transfers.",
      upvotes: 29,
      timestamp: "2 weeks ago",
      author: {
        name: "Thomas Lee",
        avatar: ""
      },
      replies: [
        {
          id: "reply-8",
          author: "Product Team",
          content: "Thanks for the suggestion! We're currently working on a bulk export feature scheduled for release next quarter.",
          timestamp: "1 week ago"
        }
      ]
    },
    {
      id: "topic-6",
      title: "Integration with DocuSign best practices",
      category: "general",
      description: "Looking for tips on the most efficient workflow for sending documents for client signature via DocuSign.",
      upvotes: 15,
      timestamp: "3 days ago",
      author: {
        name: "Jessica Martinez",
        avatar: ""
      },
      replies: [
        {
          id: "reply-9",
          author: "William Turner",
          content: "I've found that setting up templates for common documents saves a ton of time in the long run.",
          timestamp: "2 days ago"
        }
      ]
    }
  ],
  faq: [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. Follow the instructions sent to your email address."
    },
    {
      question: "Can I share documents with clients directly from the platform?",
      answer: "Yes, you can share documents using the 'Share' button on any document. You can set permissions and expiration dates for shared links."
    },
    {
      question: "How secure is my data in the system?",
      answer: "We use industry-standard encryption and security protocols. All data is encrypted both in transit and at rest, and we perform regular security audits."
    }
  ]
};
