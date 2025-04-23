import { FC } from 'react';

export interface DocumentPreviewProps {
  documentUrl: string;
  documentType: string;
  documentTitle: string;
}

export declare const DocumentPreview: FC<DocumentPreviewProps>;
