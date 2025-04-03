
import { AISuggestion } from '../AIRecommendations';

export const aiSuggestions: AISuggestion[] = [
  {
    id: 'suggestion-1',
    message: 'Client Sarah Johnson has 3 meetings scheduled in the same week. Consider consolidating to reduce travel burden.',
    priority: 'medium',
    actionable: true
  },
  {
    id: 'suggestion-2',
    message: 'Michael Chen has not provided required financial statements ahead of tomorrow\'s meeting.',
    priority: 'high',
    actionable: true
  },
  {
    id: 'suggestion-3',
    message: 'Your Thursday afternoon has multiple back-to-back meetings. Consider adding short breaks between sessions.',
    priority: 'low',
    actionable: false
  },
  {
    id: 'suggestion-4',
    message: 'Based on client history, morning appointments have 28% higher engagement rates than afternoon sessions.',
    priority: 'low',
    actionable: false
  }
];
