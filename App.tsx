import React from 'react';
import PDFConverter from './components/PDFConverter';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <PDFConverter />
      
      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} PDF Tool. All processing happens locally in your browser.</p>
      </footer>
    </div>
  );
}

export default App;