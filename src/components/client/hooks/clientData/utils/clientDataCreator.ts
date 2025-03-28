
import { Client } from "../../../types";

/**
 * Creates standardized client data object
 */
export const createClientData = (
  id: string,
  name: string,
  status?: string,
  email?: string,
  phone?: string,
  engagementScore?: number
): Client => {
  return {
    id,
    name,
    status: status || 'active',
    email,
    phone,
    engagement_score: engagementScore || 5.0,
    last_interaction: new Date().toISOString()
  };
};
