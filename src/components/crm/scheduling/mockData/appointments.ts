
import { Appointment } from '../AppointmentsList';
import { addDays, setHours, setMinutes } from 'date-fns';

const today = new Date();

// Generate dates for the next few days
const tomorrow = addDays(today, 1);
const dayAfterTomorrow = addDays(today, 2);
const inThreeDays = addDays(today, 3);
const inFourDays = addDays(today, 4);
const inFiveDays = addDays(today, 5);

// Create sample appointments
export const appointments: Appointment[] = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    type: 'Initial Consultation',
    time: '09:30',
    date: setMinutes(setHours(today, 9), 30),
    priority: 'high',
    status: 'confirmed',
    documents: 'incomplete',
    alert: 'Missing financial statements',
    color: 'bg-indigo-500'
  },
  {
    id: '2',
    clientName: 'Michael Chen',
    type: 'Financial Planning',
    time: '11:00',
    date: setMinutes(setHours(today, 11), 0),
    priority: 'medium',
    status: 'confirmed',
    documents: 'complete',
    alert: null,
    color: 'bg-purple-500'
  },
  {
    id: '3',
    clientName: 'Emma Williams',
    type: 'Document Review',
    time: '14:30',
    date: setMinutes(setHours(today, 14), 30),
    priority: 'normal',
    status: 'self-booked',
    documents: 'pending',
    alert: null,
    color: 'bg-blue-500'
  },
  {
    id: '4',
    clientName: 'James Lee',
    type: 'Follow-up Meeting',
    time: '10:00',
    date: setMinutes(setHours(tomorrow, 10), 0),
    priority: 'high',
    status: 'confirmed',
    documents: 'complete',
    alert: null,
    color: 'bg-green-500'
  },
  {
    id: '5',
    clientName: 'Aisha Patel',
    type: 'Initial Consultation',
    time: '13:00',
    date: setMinutes(setHours(tomorrow, 13), 0),
    priority: 'medium',
    status: 'pending',
    documents: 'incomplete',
    alert: 'Waiting for ID verification',
    color: 'bg-rose-500'
  },
  {
    id: '6',
    clientName: 'Robert Garcia',
    type: 'Document Review',
    time: '15:45',
    date: setMinutes(setHours(dayAfterTomorrow, 15), 45),
    priority: 'normal',
    status: 'confirmed',
    documents: 'complete',
    alert: null,
    color: 'bg-amber-500'
  },
  {
    id: '7',
    clientName: 'Julia Martinez',
    type: 'Financial Planning',
    time: '11:30',
    date: setMinutes(setHours(inThreeDays, 11), 30),
    priority: 'high',
    status: 'confirmed',
    documents: 'incomplete',
    alert: 'Missing tax returns',
    color: 'bg-teal-500'
  },
  {
    id: '8',
    clientName: 'David Wilson',
    type: 'Follow-up Meeting',
    time: '09:15',
    date: setMinutes(setHours(inFourDays, 9), 15),
    priority: 'medium',
    status: 'self-booked',
    documents: 'complete',
    alert: null,
    color: 'bg-cyan-500'
  },
  {
    id: '9',
    clientName: 'Sophia Kim',
    type: 'Initial Consultation',
    time: '14:00',
    date: setMinutes(setHours(inFourDays, 14), 0),
    priority: 'normal',
    status: 'confirmed',
    documents: 'pending',
    alert: null,
    color: 'bg-indigo-500'
  },
  {
    id: '10',
    clientName: 'Thomas Brown',
    type: 'Document Review',
    time: '16:30',
    date: setMinutes(setHours(inFiveDays, 16), 30),
    priority: 'high',
    status: 'pending',
    documents: 'incomplete',
    alert: 'Urgent review needed before deadline',
    color: 'bg-purple-500'
  }
];
