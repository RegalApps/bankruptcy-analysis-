declare module 'react-pdf' {
  import { ComponentType, ReactElement, ReactNode } from 'react';

  export interface DocumentProps {
    file: string | File | ArrayBuffer | { url: string; data: any };
    onLoadSuccess?: (pdf: { numPages: number }) => void;
    onLoadError?: (error: Error) => void;
    onSourceSuccess?: () => void;
    onSourceError?: (error: Error) => void;
    onPassword?: (callback: (password: string) => void) => void;
    options?: object;
    renderMode?: 'canvas' | 'svg' | 'none';
    rotate?: number;
    externalLinkTarget?: '_self' | '_blank' | '_parent' | '_top';
    loading?: ReactNode;
    noData?: ReactNode;
    className?: string;
    error?: ReactNode;
    inputRef?: React.Ref<HTMLElement>;
    children?: ReactNode;
  }

  export interface PageProps {
    canvasRef?: React.Ref<HTMLCanvasElement>;
    children?: ReactNode;
    className?: string;
    customTextRenderer?: (props: { str: string; itemIndex: number }) => ReactNode;
    error?: ReactNode;
    height?: number;
    inputRef?: React.Ref<HTMLElement>;
    loading?: ReactNode;
    noData?: ReactNode;
    onLoadError?: (error: Error) => void;
    onLoadSuccess?: () => void;
    onRenderError?: (error: Error) => void;
    onRenderSuccess?: () => void;
    onGetAnnotationsSuccess?: (annotations: any) => void;
    onGetAnnotationsError?: (error: Error) => void;
    onGetTextSuccess?: (items: any) => void;
    onGetTextError?: (error: Error) => void;
    pageIndex?: number;
    pageNumber?: number;
    renderAnnotationLayer?: boolean;
    renderInteractiveForms?: boolean;
    renderMode?: 'canvas' | 'svg' | 'none';
    renderTextLayer?: boolean;
    rotate?: number;
    scale?: number;
    width?: number;
  }

  export const Document: ComponentType<DocumentProps>;
  export const Page: ComponentType<PageProps>;
  export const Outline: ComponentType<any>;
  
  export const pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: string;
    };
    version: string;
  };
}
