import React from 'react';
import PDFConverter from './components/PDFConverter';

function App() {
  const baseUrl = import.meta.env.BASE_URL;
  
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-4xl mx-auto mb-6 flex gap-4 justify-center">
        <a 
          href={baseUrl} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          📄 PDF 轉圖片
        </a>
        <a 
          href={`${baseUrl}pdf-mask.html`} 
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          🎭 PDF 遮罩工具
        </a>
      </nav>
      <PDFConverter />
      
      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} PDF Tool. All processing happens locally in your browser.</p>
      </footer>
    </div>
  );
}

export default App;