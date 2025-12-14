import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Download, FileText, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { PDFPageImage } from '../types';

export default function PDFConverter() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [images, setImages] = useState<PDFPageImage[]>([]);
  const [format, setFormat] = useState<'png' | 'jpg'>('png');
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(0.95);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if script is already loaded
    if (window.pdfjsLib) {
      setPdfLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        setPdfLoaded(true);
      }
    };
    script.onerror = () => {
      setError("Failed to load PDF processor. Please check your internet connection.");
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      alert('請上傳 PDF 檔案');
      return;
    }

    if (!pdfLoaded) {
      alert('PDF 處理器還在載入中，請稍後再試');
      return;
    }
    
    setPdfFile(file);
    setImages([]);
    setError(null);
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const imageList: PDFPageImage[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        // Scale 2 for better quality
        const viewport = page.getViewport({ scale: 2 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not get canvas context");
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const dataUrl = canvas.toDataURL('image/png');
        imageList.push({
          pageNum: i,
          canvas: canvas,
          dataUrl: dataUrl,
          width: viewport.width,
          height: viewport.height
        });
      }

      setImages(imageList);
    } catch (error: any) {
      console.error('PDF 處理錯誤:', error);
      setError('PDF 處理失敗: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (img: PDFPageImage, index: number) => {
    const canvas = img.canvas;
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    // Quality only applies to jpeg
    const dataUrl = canvas.toDataURL(mimeType, format === 'jpg' ? quality : undefined);
    
    const link = document.createElement('a');
    link.download = `page_${index + 1}.${format}`;
    link.href = dataUrl;
    link.click();
  };

  const downloadAll = () => {
    images.forEach((img, index) => {
      // Stagger downloads to prevent browser blocking
      setTimeout(() => {
        downloadImage(img, index);
      }, index * 500);
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-6xl mx-auto border border-indigo-50">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-indigo-100 rounded-full">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">PDF 轉圖片工具</h1>
        </div>
        <p className="text-gray-600 max-w-lg mx-auto">
          將您的 PDF 文件安全地轉換為高品質的 PNG 或 JPG 圖片。
          所有處理皆在您的瀏覽器中完成，不會上傳至伺服器。
        </p>
        
        {!pdfLoaded && !error && (
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-indigo-600 bg-indigo-50 inline-flex px-4 py-2 rounded-full">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>正在初始化轉換引擎...</span>
          </div>
        )}
        
        {error && (
           <div className="flex items-center justify-center gap-2 mt-4 text-sm text-red-600 bg-red-50 inline-flex px-4 py-2 rounded-full">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div className="mb-10">
        <label 
          className={`group flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
            pdfLoaded && !loading
              ? 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400' 
              : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-75'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <div className={`p-4 rounded-full mb-4 transition-colors ${pdfLoaded ? 'bg-white text-indigo-500 group-hover:scale-110 duration-300 shadow-sm' : 'bg-gray-200 text-gray-400'}`}>
              <Upload className="w-8 h-8" />
            </div>
            <p className="mb-2 text-lg text-gray-700 font-semibold">
              {loading ? '處理中...' : pdfLoaded ? '點擊選擇或拖放 PDF 檔案' : '準備中...'}
            </p>
            <p className="text-sm text-gray-500">支援最大 100MB 的 PDF 文件</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileUpload}
            disabled={!pdfLoaded || loading}
          />
        </label>
        
        {pdfFile && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between animate-fade-in">
             <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-blue-900">{pdfFile.name}</span>
             </div>
             <span className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-100 rounded">PDF</span>
          </div>
        )}
      </div>

      {/* Control Panel */}
      {images.length > 0 && (
        <div className="mb-8 bg-gray-50 border border-gray-100 p-4 sm:p-6 rounded-xl animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">輸出格式:</span>
                <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                  <button
                    onClick={() => setFormat('png')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                      format === 'png' 
                        ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    PNG
                  </button>
                  <button
                    onClick={() => setFormat('jpg')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                      format === 'jpg' 
                        ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    JPG
                  </button>
                </div>
              </div>

              {format === 'jpg' && (
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                  <span className="text-sm font-semibold text-gray-700">品質:</span>
                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-24 sm:w-32 accent-indigo-600"
                  />
                  <span className="text-sm font-mono text-indigo-600 w-12 text-right">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={downloadAll}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg font-semibold active:scale-95"
            >
              <Download className="w-5 h-5" />
              下載全部 ({images.length} 張)
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">正在處理您的文件...</h3>
          <p className="text-gray-500 max-w-xs mt-1">如果您的 PDF 頁數較多，這可能需要一點時間。</p>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {images.map((img, index) => (
            <div key={index} className="group relative bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col">
              <div className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-3 border border-gray-200">
                <img
                  src={img.dataUrl}
                  alt={`Page ${img.pageNum}`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              
              <div className="flex items-center justify-between mt-auto px-1">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">
                    第 {img.pageNum} 頁
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                    {Math.round(img.width)} × {Math.round(img.height)} PX
                  </span>
                </div>
                <button
                  onClick={() => downloadImage(img, index)}
                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-indigo-600 hover:text-white text-gray-700 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold"
                  title="Download this page"
                >
                  <Download className="w-3.5 h-3.5" />
                  下載
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}