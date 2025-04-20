
export interface AnalysisProcessProps {
  setAnalysisStep: (step: string) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  setProcessingStage: (stage: string) => void;
  toast: any;
  onAnalysisComplete?: () => void;
}

export interface AnalysisProcessContext extends AnalysisProcessProps {
  isForm76?: boolean;
  isForm47?: boolean; // Added the isForm47 property
}

export interface AnalysisResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface DocumentRecord {
  id: string;
  title: string;
  storage_path: string;
  metadata: any;
  ai_processing_status: string;
  [key: string]: any;
}
