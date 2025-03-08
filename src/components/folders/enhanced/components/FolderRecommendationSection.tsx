
import { FolderRecommendation } from "../hooks/types/folderTypes";

interface FolderRecommendationSectionProps {
  showRecommendation: boolean;
  recommendation: FolderRecommendation | null;
  onAcceptRecommendation: () => Promise<void>;
  onDismissRecommendation: () => void;
}

export const FolderRecommendationSection = ({
  showRecommendation,
  recommendation,
  onAcceptRecommendation,
  onDismissRecommendation
}: FolderRecommendationSectionProps) => {
  if (!showRecommendation || !recommendation) {
    return null;
  }

  return (
    <div className="bg-muted/50 border rounded-md p-3 mb-4">
      <h3 className="font-medium text-sm mb-2">AI Recommendation</h3>
      <p className="text-sm mb-2">
        The document <span className="font-medium">{recommendation.documentTitle}</span> might 
        belong in folder: <span className="text-primary font-medium">
          {recommendation.folderPath.join(' > ')}
        </span>
      </p>
      <div className="flex gap-2 mt-3">
        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded-md text-sm"
          onClick={onAcceptRecommendation}
        >
          Accept
        </button>
        <button
          className="bg-muted hover:bg-muted/80 px-3 py-1 rounded-md text-sm"
          onClick={onDismissRecommendation}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
