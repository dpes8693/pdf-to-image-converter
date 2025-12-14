# PDF to Image Converter

一個在瀏覽器端運行的 PDF 轉圖片工具，將 PDF 文件安全地轉換為高品質的 PNG 或 JPG 圖片。

## ✨ 功能特色

- 🔒 **隱私優先** - 所有處理皆在瀏覽器中完成，不會上傳至任何伺服器
- 🖼️ **高品質輸出** - 支援 PNG 和 JPG 格式，可調整輸出品質
- 📄 **多頁支援** - 自動處理多頁 PDF，可單頁或批次下載
- 🎨 **現代化介面** - 簡潔美觀的使用者介面，支援拖放上傳
- ⚡ **快速轉換** - 使用 PDF.js 進行高效能轉換
- 📱 **響應式設計** - 支援桌面和行動裝置

## 🛠️ 技術架構

- **前端框架**: React 19
- **開發語言**: TypeScript
- **建構工具**: Vite
- **PDF 處理**: PDF.js (CDN)
- **圖示庫**: Lucide React
- **樣式**: Tailwind CSS

## 🚀 快速開始

### 環境需求

- Node.js 18+
- pnpm (推薦) 或 npm

### 本地開發

1. 複製專案

   ```bash
   git clone https://github.com/dpes8693/pdf-to-image-converter.git
   cd pdf-to-image-converter
   ```

2. 安裝依賴

   ```bash
   pnpm install
   # 或
   npm install
   ```

3. 啟動開發伺服器

   ```bash
   pnpm dev
   # 或
   npm run dev
   ```

4. 開啟瀏覽器訪問 `http://localhost:5173`

### 建構生產版本

```bash
pnpm build
# 或
npm run build
```

## 📖 使用方式

1. 開啟網頁應用程式
2. 點擊上傳區域或拖放 PDF 檔案
3. 等待 PDF 處理完成
4. 選擇輸出格式 (PNG/JPG) 和品質
5. 點擊單張下載或批次下載所有頁面

## 📁 專案結構

```
pdf-to-image-converter/
├── components/
│   └── PDFConverter.tsx   # 主要轉換元件
├── App.tsx                # 應用程式入口
├── index.tsx              # React 掛載點
├── index.html             # HTML 模板
├── types.ts               # TypeScript 型別定義
├── vite.config.ts         # Vite 設定
├── tsconfig.json          # TypeScript 設定
└── package.json           # 專案依賴
```

## 📄 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 文件
