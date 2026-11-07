import React from 'react';
import { FilterState, OtcTier } from '../types';
import { 
  Search, 
  RotateCcw, 
  Copy, 
  FileSpreadsheet, 
  Plus,
  ShieldAlert,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  Layers
} from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  onOpenCopyModal: () => void;
  onExportCsv: () => void;
  onOpenAddTickerModal?: () => void;
  totalFilteredCount: number;
  totalUniverseCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  onOpenCopyModal,
  onExportCsv,
  onOpenAddTickerModal,
  totalFilteredCount,
  totalUniverseCount
}) => {
  const handleMarketCapPreset = (min: string, max: string) => {
    onChange({
      ...filters,
      marketCapMin: min,
      marketCapMax: max
    });
  };

  const isCurrentCapPreset = (min: string, max: string) => {
    return filters.marketCapMin === min && filters.marketCapMax === max;
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200 select-none">
      {/* Top Bar: Bankrupt / Active Segmented Control + Quick Stats + Actions */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Bankrupt or Not Segmented Control */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-mono text-[11px] font-semibold tracking-wider flex items-center gap-1">
            STATUS:
          </span>
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 font-mono text-xs">
            <button
              onClick={() => onChange({ ...filters, bankruptFilter: 'ALL', excludeBankrupt: false })}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                filters.bankruptFilter === 'ALL' && !filters.excludeBankrupt
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              All Companies ({totalUniverseCount})
            </button>
            <button
              onClick={() => onChange({ ...filters, bankruptFilter: 'ACTIVE_ONLY', excludeBankrupt: true })}
              className={`px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                filters.bankruptFilter === 'ACTIVE_ONLY' || filters.excludeBankrupt
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active (Not Bankrupt)
            </button>
            <button
              onClick={() => onChange({ ...filters, bankruptFilter: 'BANKRUPT_ONLY', excludeBankrupt: false })}
              className={`px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                filters.bankruptFilter === 'BANKRUPT_ONLY'
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-rose-400 hover:text-rose-200 hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Bankrupt Only (Q-Stocks)
            </button>
          </div>

          <span className="text-slate-500 font-mono text-xs hidden lg:inline">
            Showing <strong className="text-emerald-400">{totalFilteredCount}</strong> matching registered SEC entities
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onOpenAddTickerModal && (
            <button
              onClick={onOpenAddTickerModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-600/50 rounded-md font-mono text-xs font-semibold transition-colors shadow-sm"
              title="Add or search a ticker or paste a Yahoo Finance URL"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add / Search Ticker</span>
            </button>
          )}

          <button
            onClick={onOpenCopyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-mono text-xs font-semibold transition-colors shadow-sm"
            title="Copy filtered tickers list to clipboard"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy ({totalFilteredCount})</span>
          </button>

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-md font-mono text-xs transition-colors"
            title="Download CSV file of all filtered stocks"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-md font-mono text-xs transition-colors"
            title="Reset all search parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Filter Section: Search + Market Cap Search + Quick Cap Presets + Tier */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs items-end">
        {/* 1. Universal Search Input */}
        <div className="md:col-span-5">
          <label className="text-slate-400 font-mono text-[11px] block mb-1">
            SEARCH TICKER / SEC CIK / COMPANY NAME
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={e => {
                const val = e.target.value;
                const urlMatch = val.match(/\/quote\/([A-Za-z0-9._-]+)/i);
                const query = urlMatch ? urlMatch[1].toUpperCase() : val;
                onChange({ ...filters, search: query });
              }}
              placeholder="e.g. YOOIF, Fannie Mae, 0001402280, SHLDQ, or Yahoo URL..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* 2. Market Cap Custom Min & Max */}
        <div className="md:col-span-4">
          <label className="text-slate-400 font-mono text-[11px] block mb-1">
            SEARCH BY MARKET CAP ($)
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-[11px]">$</span>
              <input
                type="number"
                placeholder="Min Cap"
                value={filters.marketCapMin}
                onChange={e => onChange({ ...filters, marketCapMin: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-6 pr-2 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-[11px]">$</span>
              <input
                type="number"
                placeholder="Max Cap"
                value={filters.marketCapMax}
                onChange={e => onChange({ ...filters, marketCapMax: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-6 pr-2 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. OTC Tier Filter */}
        <div className="md:col-span-3">
          <label className="text-slate-400 font-mono text-[11px] block mb-1">
            OTC MARKET TIER
          </label>
          <select
            value={filters.tier}
            onChange={e => onChange({ ...filters, tier: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="ALL">All Tiers (Pink, OTCQB, OTCQX, Grey)</option>
            <option value="Pink Current">Pink Current Information</option>
            <option value="OTCQB">OTCQB Venture Market</option>
            <option value="OTCQX">OTCQX Best Market</option>
            <option value="Pink Limited">Pink Limited Information</option>
            <option value="Pink No Information">Pink No Information (Dark / Q)</option>
            <option value="Grey Market">Grey Market</option>
          </select>
        </div>
      </div>

      {/* Market Cap Quick-Preset Buttons Bar */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
        <span className="text-slate-500 whitespace-nowrap mr-1 flex items-center gap-1">
          <DollarSign className="w-3 h-3 text-emerald-400" /> MARKET CAP PRESETS:
        </span>

        <button
          onClick={() => handleMarketCapPreset('', '')}
          className={`px-2.5 py-1 rounded border transition-colors whitespace-nowrap ${
            isCurrentCapPreset('', '')
              ? 'bg-emerald-950 border-emerald-600 text-emerald-300 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Any Cap
        </button>

        <button
          onClick={() => handleMarketCapPreset('', '1000000')}
          className={`px-2.5 py-1 rounded border transition-colors whitespace-nowrap ${
            isCurrentCapPreset('', '1000000')
              ? 'bg-emerald-950 border-emerald-600 text-emerald-300 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          &lt; $1M (Micro Shells)
        </button>

        <button
          onClick={() => handleMarketCapPreset('1000000', '10000000')}
          className={`px-2.5 py-1 rounded border transition-colors whitespace-nowrap ${
            isCurrentCapPreset('1000000', '10000000')
              ? 'bg-emerald-950 border-emerald-600 text-emerald-300 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          $1M – $10M (Nano Cap)
        </button>

        <button
          onClick={() => handleMarketCapPreset('10000000', '100000000')}
          className={`px-2.5 py-1 rounded border transition-colors whitespace-nowrap ${
            isCurrentCapPreset('10000000', '100000000')
              ? 'bg-emerald-950 border-emerald-600 text-emerald-300 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          $10M – $100M (Small Cap)
        </button>

        <button
          onClick={() => handleMarketCapPreset('100000000', '1000000000')}
          className={`px-2.5 py-1 rounded border transition-colors whitespace-nowrap ${
            isCurrentCapPreset('100000000', '1000000000')
              ? 'bg-emerald-950 border-emerald-600 text-emerald-300 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          $100M – $1B (Mid Cap)
        </button>

        <button
          onClick={() => handleMarketCapPreset('1000000000', '')}
          className={`px-2.5 py-1 rounded border transition-colors whitespace-nowrap ${
            isCurrentCapPreset('1000000000', '')
              ? 'bg-emerald-950 border-emerald-600 text-emerald-300 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          &gt; $1B (Mega / Fannie / ADRs)
        </button>
      </div>
    </div>
  );
};
