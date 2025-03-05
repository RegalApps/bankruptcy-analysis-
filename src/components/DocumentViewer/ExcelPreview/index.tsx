
import { ExcelPreviewContainer } from "./components/ExcelPreviewContainer";

interface ExcelPreviewProps {
  storagePath: string;
  title?: string;
}

export const ExcelPreview: React.FC<ExcelPreviewProps> = ({ storagePath, title }) => {
  return <ExcelPreviewContainer storagePath={storagePath} title={title} />;
};
