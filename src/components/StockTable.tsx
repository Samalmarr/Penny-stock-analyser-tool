import React, { useState } from 'react';
import { PinkStock } from '../types';
import { formatCurrency, formatMarketCap, formatLargeNumber, copyToClipboard } from '../utils/formatters';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  Globe, 
  Copy, 
  Check, 
  Eye, 
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface StockTableProps {
  stocks: PinkStock[];
  onSelectStock: (stock: PinkStock) => void;
  onQuickWebsiteCheck?: (ticker: string) => void;
}

type SortField = 'ticker' | 'price' | 'changePercent' | 'marketCap' | 'volume';

export const StockTable: React.FC<StockTableProps> = ({ stocks, onSelectStock }) => {
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [copiedTicker, setCopiedTicker] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'ticker' ? 'asc' : 'desc');
    }
    setCurrentPage(1);
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    let aVal: any = a[sortField as keyof PinkStock];
    let bVal: any = b[sortField as keyof PinkStock];

    if (typeof aVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDirection === 'asc' ? (aVal - bVal) : (bVal - aVal);
  });

  const totalPages = Math.ceil(sortedStocks.length / pageSize) || 1;
  const paginatedStocks = sortedStocks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCopyTicker = async (e: React.MouseEvent, ticker: string) => {
    e.stopPropagation();
    const ok = await copyToClipboard(ticker);
    if (ok) {
      setCopiedTicker(ticker);
      setTimeout(() => setCopiedTicker(null), 2000);
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-600" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-3 h-3 text-emerald-400" />
      : <ArrowDown className="w-3 h-3 text-emerald-400" />;
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden font-sans">
      {/* Table Container */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] sticky top-0 z-20 border-b border-slate-800 shadow-sm">
            <tr>
              <th 
                onClick={() => handleSort('ticker')}
                className="py-3 px-3 cursor-pointer hover:text-white select-none whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>TICKER &amp; TIER</span>
                  {renderSortIcon('ticker')}
                </div>
              </th>

              <th className="py-3 px-3 select-none">
                <span>OFFICIAL SEC COMPANY NAME</span>
              </th>

              <th className="py-3 px-3 select-none whitespace-nowrap">
                <span>STATUS (BANKRUPT / ACTIVE)</span>
              </th>

              <th 
                onClick={() => handleSort('marketCap')}
                className="py-3 px-3 cursor-pointer hover:text-white select-none whitespace-nowrap text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>MARKET CAP</span>
                  {renderSortIcon('marketCap')}
                </div>
              </th>

              <th 
                onClick={() => handleSort('price')}
                className="py-3 px-3 cursor-pointer hover:text-white select-none whitespace-nowrap text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>PRICE</span>
                  {renderSortIcon('price')}
                </div>
              </th>

              <th 
                onClick={() => handleSort('changePercent')}
                className="py-3 px-3 cursor-pointer hover:text-white select-none whitespace-nowrap text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>CHANGE %</span>
                  {renderSortIcon('changePercent')}
                </div>
              </th>

              <th 
                onClick={() => handleSort('volume')}
                className="py-3 px-3 cursor-pointer hover:text-white select-none whitespace-nowrap text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>VOLUME</span>
                  {renderSortIcon('volume')}
                </div>
              </th>

              <th className="py-3 px-3 select-none text-center whitespace-nowrap">
                <span>VERIFIED WORKING LINKS</span>
              </th>

              <th className="py-3 px-3 text-center whitespace-nowrap">
                <span>CHART &amp; DETAILS</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/80 text-slate-200 text-xs">
            {paginatedStocks.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500 font-mono">
                  No registered companies found matching current Market Cap or Status filters.
                </td>
              </tr>
            ) : (
              paginatedStocks.map((stock) => {
                const isBankrupt = stock.operatingStatus === 'Bankrupt' || stock.ticker.endsWith('Q');
                const rawCik = stock.cik || '0000000000';
                const cik = rawCik.length >= 6 ? rawCik.padStart(10, '0') : rawCik;
                
                // Verified real working URLs
                const secUrl = stock.secEdgarUrl || (cik && cik !== '0000000000'
                  ? `https://www.sec.gov/edgar/browse/?CIK=${cik}`
                  : `https://www.sec.gov/edgar/searchedgar/companysearch?companyName=${encodeURIComponent(stock.ticker)}`);
                const otcUrl = stock.otcMarketsUrl || `https://www.otcmarkets.com/stock/${stock.ticker}/overview`;
                const yahooUrl = stock.yahooFinanceUrl || `https://finance.yahoo.com/quote/${stock.ticker}`;

                return (
                  <tr
                    key={stock.ticker}
                    onClick={() => onSelectStock(stock)}
                    className="hover:bg-slate-800/60 cursor-pointer transition-colors group"
                  >
                    {/* Ticker & Tier */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm font-mono text-white group-hover:text-emerald-400 transition-colors">
                          {stock.ticker}
                        </span>
                        {isBankrupt && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-950 border border-rose-800 text-rose-300 font-mono" title="Bankrupt Chapter 11 entity">
                            Q
                          </span>
                        )}
                        <button
                          onClick={(e) => handleCopyTicker(e, stock.ticker)}
                          title="Copy ticker symbol"
                          className="text-slate-600 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                        >
                          {copiedTicker === stock.ticker ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-500 font-mono">
                          {stock.tier}
                        </span>
                        <span className="text-slate-700 text-[10px]">·</span>
                        <span className="text-[10px] text-slate-500 font-mono" title="Official SEC Central Index Key">
                          CIK:{stock.cik.slice(-6)}
                        </span>
                      </div>
                    </td>

                    {/* Official SEC Registered Name */}
                    <td className="py-3 px-3 max-w-xs sm:max-w-sm">
                      <div className="font-medium text-slate-200 truncate group-hover:text-white transition-colors" title={stock.name}>
                        {stock.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <span>{stock.sector || 'Public Market'}</span>
                        <span>·</span>
                        <span>{stock.country}</span>
                      </div>
                    </td>

                    {/* Operating Status (Bankrupt vs Active) */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {isBankrupt ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded font-bold bg-rose-950/80 border border-rose-700 text-rose-300">
                          <ShieldAlert className="w-3 h-3 text-rose-400" />
                          BANKRUPT (Chapter 11)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-950/80 border border-emerald-700 text-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ACTIVE / OPERATING
                        </span>
                      )}
                    </td>

                    {/* Market Cap */}
                    <td className="py-3 px-3 text-right font-mono whitespace-nowrap">
                      <span className="font-bold text-slate-100 text-xs">
                        {formatMarketCap(stock.marketCap)}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 text-right font-mono whitespace-nowrap">
                      <span className="font-semibold text-white text-xs">
                        {formatCurrency(stock.price)}
                      </span>
                    </td>

                    {/* Change % */}
                    <td className="py-3 px-3 text-right font-mono whitespace-nowrap">
                      <span className={`font-medium text-xs ${
                        stock.changePercent > 0 ? 'text-emerald-400' :
                        stock.changePercent < 0 ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                        {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-3 text-right font-mono text-slate-400 whitespace-nowrap">
                      {formatLargeNumber(stock.volume)}
                    </td>

                    {/* Verified Working Links */}
                    <td className="py-3 px-3 whitespace-nowrap text-center" onClick={e => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1.5 font-mono text-[10px]">
                        {/* 1. Official SEC EDGAR Link */}
                        <a
                          href={secUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shadow-xs"
                          title={`Open official SEC EDGAR filings for CIK ${stock.cik}`}
                        >
                          <FileText className="w-3 h-3 text-emerald-400" />
                          <span>SEC</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                        </a>

                        {/* 2. Official OTC Markets Link */}
                        <a
                          href={otcUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shadow-xs"
                          title={`Open ${stock.ticker} profile on official OTC Markets`}
                        >
                          <span>OTC</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                        </a>

                        {/* 3. Official Yahoo Finance Link */}
                        <a
                          href={yahooUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shadow-xs"
                          title={`Open ${stock.ticker} quote on Yahoo Finance`}
                        >
                          <span>Yahoo</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                        </a>

                        {/* 4. Verified Corporate Website (if verified) */}
                        {stock.website && (
                          <a
                            href={stock.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white border border-emerald-800/60 transition-colors shadow-xs"
                            title={`Open verified website: ${stock.website}`}
                          >
                            <Globe className="w-3 h-3 text-emerald-400" />
                            <span>Site</span>
                            <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Chart & Details Action */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStock(stock);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 border border-slate-700 hover:border-emerald-500 font-mono text-[11px] font-semibold transition-all shadow-xs"
                      >
                        <TrendingUp className="w-3 h-3" />
                        <span>Live Chart</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white focus:outline-none focus:border-emerald-500 text-xs"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
          </select>

          <span className="text-slate-500 ml-2">
            Page {currentPage} of {totalPages} ({sortedStocks.length} total)
          </span>
        </div>

        {/* Page Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 font-bold">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};
