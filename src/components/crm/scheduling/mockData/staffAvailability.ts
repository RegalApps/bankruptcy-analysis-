
import { StaffAvailabilityItem } from '../StaffAvailability';

export const staffAvailability: StaffAvailabilityItem[] = [
  {
    id: 'staff-1',
    name: 'Dr. Emily Johnson',
    role: 'Senior Trustee',
    avatar: '/assets/avatars/emily.jpg',
    color: 'bg-indigo-500',
    schedule: [
      { day: 'Monday', busy: ['09:00-10:30', '14:00-16:00'] },
      { day: 'Tuesday', busy: ['11:00-12:30'] },
      { day: 'Wednesday', busy: ['09:00-11:00', '15:00-17:00'] },
      { day: 'Thursday', busy: [] },
      { day: 'Friday', busy: ['13:00-15:30'] }
    ]
  },
  {
    id: 'staff-2',
    name: 'Mark Wilson',
    role: 'Financial Advisor',
    avatar: '/assets/avatars/mark.jpg',
    color: 'bg-purple-500',
    schedule: [
      { day: 'Monday', busy: ['13:00-15:00'] },
      { day: 'Tuesday', busy: ['09:00-12:00', '16:00-17:00'] },
      { day: 'Wednesday', busy: [] },
      { day: 'Thursday', busy: ['10:00-12:30', '14:00-16:00'] },
      { day: 'Friday', busy: ['09:00-10:30'] }
    ]
  },
  {
    id: 'staff-3',
    name: 'Sarah Chen',
    role: 'Legal Consultant',
    avatar: '/assets/avatars/sarah.jpg',
    color: 'bg-emerald-500',
    schedule: [
      { day: 'Monday', busy: ['10:00-12:00', '16:00-17:30'] },
      { day: 'Tuesday', busy: [] },
      { day: 'Wednesday', busy: ['11:30-13:00'] },
      { day: 'Thursday', busy: ['09:00-11:00', '15:00-17:00'] },
      { day: 'Friday', busy: ['14:00-16:30'] }
    ]
  }
];
