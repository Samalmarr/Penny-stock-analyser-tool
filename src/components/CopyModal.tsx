import React, { useState } from 'react';
import { PinkStock } from '../types';
import { formatTickersList, exportToCSV, exportToJSON } from '../utils/exportTools';
import { copyToClipboard } from '../utils/formatters';
import { X, Check, Copy, Download, FileSpreadsheet, Code2 } from 'lucide-react';

interface CopyModalProps {
  stocks: PinkStock[];
  onClose: () => void;
}

export const CopyModal: React.FC<CopyModalProps> = ({ stocks, onClose }) => {
  const [format, setFormat] = useState<'comma' | 'space' | 'newline' | 'tradingview' | 'thinkorswim'>('comma');
  const [copied, setCopied] = useState(false);

  const formattedText = formatTickersList(stocks, format);

  const handleCopy = async () => {
    const success = await copyToClipboard(formattedText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-xl shadow-2xl p-5 text-slate-100 font-sans"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white">Copy & Export OTC Watchlist</h3>
            <p className="text-xs text-slate-400">Export {stocks.length} filtered pink sheet / OTC tickers into your broker or charting platform.</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="mt-4">
          <label className="text-xs text-slate-400 font-medium block mb-2">Watchlist Format</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setFormat('comma')}
              className={`p-2 rounded border text-left font-mono transition-colors ${
                format === 'comma' ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              Comma-Separated
              <span className="block text-[10px] text-slate-500 font-sans mt-0.5">ABC, DEF, GHI</span>
            </button>

            <button
              onClick={() => setFormat('tradingview')}
              className={`p-2 rounded border text-left font-mono transition-colors ${
                format === 'tradingview' ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              TradingView
              <span className="block text-[10px] text-slate-500 font-sans mt-0.5">OTC:ABC, OTC:DEF</span>
            </button>

            <button
              onClick={() => setFormat('thinkorswim')}
              className={`p-2 rounded border text-left font-mono transition-colors ${
                format === 'thinkorswim' ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              ThinkorSwim / Schwab
              <span className="block text-[10px] text-slate-500 font-sans mt-0.5">ABC;DEF;GHI</span>
            </button>

            <button
              onClick={() => setFormat('space')}
              className={`p-2 rounded border text-left font-mono transition-colors ${
                format === 'space' ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              Space-Separated
              <span className="block text-[10px] text-slate-500 font-sans mt-0.5">ABC DEF GHI</span>
            </button>

            <button
              onClick={() => setFormat('newline')}
              className={`p-2 rounded border text-left font-mono transition-colors ${
                format === 'newline' ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              Line-by-Line
              <span className="block text-[10px] text-slate-500 font-sans mt-0.5">One per line</span>
            </button>
          </div>
        </div>

        {/* Text Preview Box */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Preview ({stocks.length} tickers)</span>
            <span className="font-mono">{formattedText.length} characters</span>
          </div>
          <textarea
            readOnly
            value={formattedText}
            className="w-full h-32 p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none resize-none select-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => exportToCSV(stocks)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors w-full sm:w-auto"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              Download CSV
            </button>
            <button
              onClick={() => exportToJSON(stocks)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors w-full sm:w-auto"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              JSON
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors w-full sm:w-auto shadow-lg shadow-emerald-950"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Watchlist
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
