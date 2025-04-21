
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
  isForm47?: boolean;
  isForm31?: boolean;
  documentText?: string;
}

export interface AnalysisResult {
  success: boolean;
  data?: any;
  error?: string;
}
