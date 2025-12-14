export interface PDFPageImage {
  pageNum: number;
  canvas: HTMLCanvasElement;
  dataUrl: string;
  width: number;
  height: number;
}

// Extend the window interface to include pdfjsLib loaded from CDN
declare global {
  interface Window {
    pdfjsLib: any;
  }
}