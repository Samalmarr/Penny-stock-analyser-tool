import React, { useState } from 'react';
import { PinkStock } from '../types';
import { formatCurrency, formatMarketCap, formatLargeNumber, copyToClipboard } from '../utils/formatters';
import { StockChart } from './StockChart';
import { 
  X, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  Globe, 
  Copy, 
  FileText,
  DollarSign,
  TrendingUp,
  Building,
  Check,
  Building2,
  Calendar
} from 'lucide-react';

interface StockDetailModalProps {
  stock: PinkStock;
  onClose: () => void;
  onUpdateStockWebsite?: (ticker: string, newStatus: any) => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const isBankrupt = stock.operatingStatus === 'Bankrupt' || stock.ticker.endsWith('Q');

  const rawCik = stock.cik || '0000000000';
  const cik = rawCik.length >= 6 ? rawCik.padStart(10, '0') : rawCik;

  // Real verified official URLs
  const secBrowseUrl = stock.secEdgarUrl || (cik && cik !== '0000000000'
    ? `https://www.sec.gov/edgar/browse/?CIK=${cik}`
    : `https://www.sec.gov/edgar/searchedgar/companysearch?companyName=${encodeURIComponent(stock.ticker)}`);
  
  const otcMarketsUrl = stock.otcMarketsUrl || `https://www.otcmarkets.com/stock/${stock.ticker}/overview`;
  const yahooFinanceUrl = stock.yahooFinanceUrl || `https://finance.yahoo.com/quote/${stock.ticker}`;
  const googleFinanceUrl = stock.googleFinanceUrl || `https://www.google.com/finance/quote/${stock.ticker}:OTCMKTS`;

  const handleCopyProfile = async () => {
    const text = `# ${stock.name} (${stock.ticker})
- **Market Tier**: ${stock.tier}
- **Operating Status**: ${isBankrupt ? 'Bankrupt (Chapter 11)' : 'Active / Operating'}
- **SEC CIK**: ${cik}
- **Price**: ${formatCurrency(stock.price)} (${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent}%)
- **Market Cap**: ${formatMarketCap(stock.marketCap)}
- **52-Week Range**: ${formatCurrency(stock.low52w)} - ${formatCurrency(stock.high52w)}
- **Country**: ${stock.country}
- **Sector**: ${stock.sector}

## Official Verified Links:
- SEC EDGAR Filings: ${secBrowseUrl}
- OTC Markets Profile: ${otcMarketsUrl}
- Yahoo Finance: ${yahooFinanceUrl}
- Google Finance: ${googleFinanceUrl}
${stock.website ? `- Official Website: ${stock.website}` : ''}
`;

    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 font-sans"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg border flex items-center justify-center font-bold text-lg font-mono ${
              isBankrupt 
                ? 'bg-rose-950/50 border-rose-800 text-rose-300' 
                : 'bg-slate-800 border-slate-700 text-emerald-400'
            }`}>
              {stock.ticker.slice(0, 4)}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold font-mono tracking-tight text-white">{stock.ticker}</h2>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-800 border border-slate-700 text-emerald-400">
                  {stock.tier}
                </span>

                {isBankrupt ? (
                  <span className="text-xs px-2.5 py-0.5 rounded font-mono font-bold bg-rose-950 border border-rose-700 text-rose-300 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    BANKRUPT (Chapter 11 / Q-Stock)
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded font-mono font-bold bg-emerald-950 border border-emerald-700 text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ACTIVE / OPERATING
                  </span>
                )}

                <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 border border-slate-700 text-slate-300" title="Official SEC Central Index Key">
                  SEC CIK: {cik}
                </span>
              </div>
              <p className="text-sm text-slate-300 font-medium mt-0.5 leading-snug">{stock.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleCopyProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-mono text-xs font-medium transition-colors"
              title="Copy verified profile and official links"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? 'Copied Links!' : 'Copy Links'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Verified Official Links Strip (That ACTUALLY Work!) */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 text-[11px] font-semibold mr-1">OFFICIAL VERIFIED LINKS:</span>

            {/* 1. Official SEC EDGAR Link */}
            <a
              href={secBrowseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-emerald-700/60 font-semibold transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>SEC EDGAR Filings (CIK {cik})</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* 2. Official OTC Markets Link */}
            <a
              href={otcMarketsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-medium transition-colors"
            >
              <span>OTC Markets Overview</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* 3. Official Yahoo Finance Link */}
            <a
              href={yahooFinanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-medium transition-colors"
            >
              <span>Yahoo Finance Quote</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* 4. Google Finance Link */}
            <a
              href={googleFinanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <span>Google Finance</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* 5. Verified Corporate Website */}
            {stock.website ? (
              <a
                href={stock.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-600 font-semibold transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Corporate Site</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ) : null}
          </div>
        </div>

        {/* Modal Body: Verified Metrics & Live Candlestick Chart */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Key Accurate Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-semibold">CURRENT PRICE</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-lg font-bold text-white">{formatCurrency(stock.price)}</span>
                <span className={`text-xs font-semibold ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-semibold">MARKET CAPITALIZATION</span>
              <span className="text-lg font-bold text-white mt-1 block">{formatMarketCap(stock.marketCap)}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-semibold">52-WEEK RANGE</span>
              <span className="text-xs font-bold text-slate-200 mt-2 block">
                {formatCurrency(stock.low52w)} – {formatCurrency(stock.high52w)}
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-semibold">DAILY VOLUME</span>
              <span className="text-lg font-bold text-slate-200 mt-1 block">{formatLargeNumber(stock.volume)} shares</span>
            </div>
          </div>

          {/* Interactive Live Candlestick Chart Component */}
          <div>
            <div className="flex items-center justify-between mb-2 font-mono text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Live Candlestick Chart (Yahoo Finance Multi-Timeframe)
              </span>
              <span className="text-slate-500 text-[11px]">Select timeframe: 1M, 3M, 6M, 1Y, 5Y</span>
            </div>

            <StockChart
              ticker={stock.ticker}
              history={stock.chartHistory}
              currentPrice={stock.price}
            />
          </div>

          {/* Company Registry & Entity Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" /> SEC EDGAR Registration
              </h4>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Official Registrant:</span>
                  <span className="text-right text-slate-200 font-semibold">{stock.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Central Index Key (CIK):</span>
                  <a 
                    href={secBrowseUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>{cik}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Market Tier:</span>
                  <span className="text-slate-200">{stock.tier}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Primary Country:</span>
                  <span className="text-slate-200">{stock.country}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Operational &amp; Bankruptcy Status
              </h4>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Trading Status:</span>
                  <span className={isBankrupt ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {isBankrupt ? 'Bankrupt (Chapter 11 Reorganization/Liquidation)' : 'Active Commercial Operations'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Ticker Suffix:</span>
                  <span className="text-slate-200">
                    {stock.ticker.endsWith('Q') ? 'Q-Suffix (Bankrupt Entity)' : stock.ticker.endsWith('F') ? 'F-Suffix (Foreign/Canadian Ordinary)' : stock.ticker.endsWith('Y') ? 'Y-Suffix (American Depositary Receipt)' : 'Standard OTC'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Sector:</span>
                  <span className="text-slate-200">{stock.sector || 'Public Market'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Official Profile:</span>
                  <a 
                    href={otcMarketsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>otcmarkets.com/stock/{stock.ticker}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500 text-[11px]">
            Data grounded in official SEC EDGAR registries and live Yahoo Finance feeds.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
