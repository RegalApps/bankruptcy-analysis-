
/**
 * Document record type from database
 */
export interface DocumentRecord {
  id: string;
  title: string;
  storage_path: string;
  metadata: {
    formType?: string;
    processing_stage?: string;
    processing_steps_completed?: string[];
    [key: string]: any;
  };
  ai_processing_status: string; // Changed from optional to required
  [key: string]: any;
}
