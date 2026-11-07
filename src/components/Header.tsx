import React, { useState } from 'react';
import { PinkStock } from '../types';
import { 
  Radar, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  Globe, 
  Plus,
  Play,
  Pause,
  Layers,
  Database,
  Terminal,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  allStocks: PinkStock[];
  onSelectStock: (stock: PinkStock) => void;
  onOpenAddTickerModal: () => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  excludeBankrupt: boolean;
  onToggleExcludeBankrupt: () => void;
  newlyDiscoveredTicker?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  allStocks,
  onSelectStock,
  onOpenAddTickerModal,
  isStreaming,
  onToggleStreaming,
  excludeBankrupt,
  onToggleExcludeBankrupt,
  newlyDiscoveredTicker
}) => {
  const [quickSearch, setQuickSearch] = useState('');

  const bankruptCount = allStocks.filter(s => s.operatingStatus === 'Bankrupt' || s.ticker.endsWith('Q')).length;
  const shellCount = allStocks.filter(s => s.operatingStatus === 'Shell Company').length;
  const deadWebCount = allStocks.filter(s => s.websiteStatus === 'Dead / 404' || s.websiteStatus === 'Parked / Domain For Sale').length;
  const caveatCount = allStocks.filter(s => s.hasCaveatEmptor).length;

  const handleQuickLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearch.trim()) return;

    let query = quickSearch.trim();
    const urlMatch = query.match(/\/quote\/([A-Za-z0-9._-]+)/i);
    if (urlMatch) {
      query = urlMatch[1];
    }
    const clean = query.toUpperCase();
    const found = allStocks.find(s => s.ticker === clean || s.name.toUpperCase().includes(clean));

    if (found) {
      onSelectStock(found);
      setQuickSearch('');
    } else {
      // Trigger scan and add for unlisted ticker with pre-filled query
      onOpenAddTickerModal();
    }
  };

  return (
    <header className="bg-slate-950 border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      {/* Top Banner & Quick stats */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-600/70 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-950 flex-shrink-0">
            <Radar className={`w-6 h-6 ${isStreaming ? 'animate-spin-slow text-emerald-300' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5 font-mono">
                PINKSCAN <span className="text-emerald-400 font-sans text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 font-semibold">1,200+ UNIVERSE</span>
              </h1>
              {newlyDiscoveredTicker && (
                <span className="animate-pulse px-2 py-0.5 rounded bg-emerald-900 border border-emerald-500 text-emerald-200 text-[10px] font-mono font-bold">
                  +NEW: {newlyDiscoveredTicker}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Official SEC EDGAR &amp; OTC Screener · Search by Market Cap &amp; Bankrupt Status · Verified Working Links
            </p>
          </div>
        </div>

        {/* Live Verified Counters */}
        <div className="hidden xl:flex items-center gap-2.5 font-mono text-xs">
          <div className="bg-slate-900 border border-emerald-800/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-emerald-300">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">SEC Universe:</span>
            <strong className="text-white">{allStocks.length} Companies</strong>
          </div>

          <div className="bg-slate-900 border border-emerald-800/60 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active:</span>
            <strong className="text-emerald-200">{allStocks.length - bankruptCount}</strong>
          </div>

          <div className="bg-slate-900 border border-rose-900/60 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-rose-300">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Bankrupt:</span>
            <strong className="text-rose-200">{bankruptCount}</strong>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Quick Bankrupt Toggle */}
          <button
            onClick={onToggleExcludeBankrupt}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
              excludeBankrupt 
                ? 'bg-rose-950 border-rose-600 text-rose-200 font-bold'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Toggle between hiding or showing bankrupt Chapter 11 / Q-stocks"
          >
            <span>{excludeBankrupt ? '🚫 Bankrupt: HIDDEN' : '👁️ Bankrupt: INCLUDED'}</span>
          </button>

          {/* Continuous Scanner Toggle */}
          <button
            onClick={onToggleStreaming}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors shadow-sm ${
              isStreaming 
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 animate-pulse'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
            }`}
            title="Automatically scan and add newly discovered OTC stocks constantly in real-time"
          >
            {isStreaming ? (
              <>
                <Pause className="w-3 h-3 text-emerald-400" />
                <span>Auto-Scan: <strong className="text-emerald-300">LIVE</strong></span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-400" />
                <span>Auto-Scan</span>
              </>
            )}
          </button>

          {/* Add Any Ticker Button */}
          <button
            onClick={onOpenAddTickerModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold font-mono transition-colors shadow-md shadow-emerald-950 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Ticker
          </button>

          {/* Quick Ticker Search Bar */}
          <form onSubmit={handleQuickLookup} className="relative hidden sm:block">
            <Terminal className="w-3 h-3 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickSearch}
              onChange={e => setQuickSearch(e.target.value)}
              placeholder="Ticker or Yahoo URL..."
              className="bg-slate-950 border border-slate-750 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono w-44 lg:w-52"
            />
          </form>
        </div>
      </div>
    </header>
  );
};
