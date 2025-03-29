
import { Client } from "../../../types";

/**
 * Creates a new client data object with the given properties
 */
export const createClientData = (
  id: string,
  name: string,
  status: 'active' | 'inactive' | 'pending',
  email?: string,
  phone?: string,
  lastInteraction?: string,
  engagementScore?: number
): Client => {
  return {
    id,
    name,
    status,
    email,
    phone,
    last_interaction: lastInteraction || new Date().toISOString(),
    engagement_score: engagementScore || 85
  };
};
