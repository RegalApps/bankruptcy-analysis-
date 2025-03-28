
import { Client } from "../../../types";

export const createClientData = (
  id: string,
  name: string,
  status: 'active' | 'inactive' = 'active', // Fixed to use the correct type
  email?: string,
  phone?: string
): Client => {
  return {
    id,
    name,
    status,
    email,
    phone
  };
};
