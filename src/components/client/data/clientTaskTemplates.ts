
import { Task } from "../types";
import { getDateFromDaysAgo } from "./clientDocumentHelpers";

// All static tasks for each client
export const getClientTasks = (clientId: string): Task[] => {
  switch (clientId) {
    case 'jane-smith':
      return [
        {
          id: "jane-task-1",
          title: "Review financial statement",
          dueDate: getDateFromDaysAgo(0),
          status: 'pending',
          priority: 'high'
        },
        {
          id: "jane-task-2",
          title: "Schedule quarterly meeting",
          dueDate: getDateFromDaysAgo(-7),
          status: 'pending',
          priority: 'medium'
        }
      ];
    case 'robert-johnson':
      return [
        {
          id: "robert-task-1",
          title: "Complete Form 32 processing",
          dueDate: getDateFromDaysAgo(2),
          status: 'overdue',
          priority: 'high'
        },
        {
          id: "robert-task-2",
          title: "Request updated bank statements",
          dueDate: getDateFromDaysAgo(-3),
          status: 'pending',
          priority: 'medium'
        },
        {
          id: "robert-task-3",
          title: "Prepare monthly report",
          dueDate: getDateFromDaysAgo(-10),
          status: 'pending',
          priority: 'low'
        }
      ];
    case 'maria-garcia':
      return [
        {
          id: "maria-task-1",
          title: "Follow up on missing documents",
          dueDate: getDateFromDaysAgo(1),
          status: 'pending',
          priority: 'high'
        },
        {
          id: "maria-task-2",
          title: "Process debt consolidation agreement",
          dueDate: getDateFromDaysAgo(-5),
          status: 'pending',
          priority: 'high'
        }
      ];
    default:
      return [];
  }
};
