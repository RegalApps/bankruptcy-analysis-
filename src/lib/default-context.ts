
// Default context values for the application

export const defaultContext = {
  // Default user information
  user: {
    id: '',
    name: '',
    email: '',
    role: 'user'
  },
  
  // Default document context
  document: {
    id: '',
    title: 'Untitled Document',
    type: 'default'
  },
  
  // Default analysis settings
  analysis: {
    enabled: true,
    aiConfidenceThreshold: 0.7,
    showAllRisks: true
  }
};
