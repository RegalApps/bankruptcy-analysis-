
export interface AnalysisProcessProps {
  setAnalysisStep: (step: string) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  toast: any;
  onAnalysisComplete?: () => void;
}

export interface AnalysisProcessContext extends AnalysisProcessProps {
  isForm76?: boolean;
}

export interface AnalysisResult {
  success: boolean;
  data?: any;
  error?: string;
}
