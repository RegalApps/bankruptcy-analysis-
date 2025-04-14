
import { toast } from 'sonner';

export interface AnalysisProcessProps {
  setAnalysisStep: (step: string) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  setProcessingStage: (stage: string) => void;
  toast?: any;
  onAnalysisComplete?: (id: string) => void;
}

export interface AnalysisProcessContext extends AnalysisProcessProps {
  isForm76?: boolean;
}
