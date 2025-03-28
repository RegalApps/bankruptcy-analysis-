
import { Client } from "../../../types";

export const createClientData = (
  id: string,
  name: string,
  status: string = 'active',
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
