/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  FileText, 
  Loader2, 
  History, 
  Sparkles,
  ArrowRight,
  Info,
  BookOpen,
  Lock
} from 'lucide-react';
import { StockChart } from './components/StockChart';
import { GuidesView } from './components/GuidesView';
import { AdminDataView } from './components/AdminDataView';
import { formatCurrency, formatLargeNumber, formatMarketCap } from './utils/formatters';

interface StockAnalysisResult {
  success: boolean;
  symbol: string;
  companyName: string;
  isBankrupt: boolean;
  bankruptcyStatus: string;
  bankruptcyDetails: string;
  hasLiveQuote: boolean;
  price: number | null;
  changePercent: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  volume: number | null;
  currency: string;
  exchange: string;
  fullExchangeName: string;
  dilutionRisk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  dilutionReason: string;
  chart: any[] | null;
  links: {
    yahoo: string;
    otc: string;
    sec: string;
    google: string;
  };
}

const POPULAR_SUGGESTIONS = [
  { symbol: 'YOOIF', label: 'YOOIF (YANGAROO Inc.)' },
  { symbol: 'FNMA', label: 'FNMA (Fannie Mae)' },
  { symbol: 'AITX', label: 'AITX (Artificial Intelligence Tech)' },
  { symbol: 'POET', label: 'POET (POET Technologies)' },
  { symbol: 'CYDY', label: 'CYDY (CytoDyn Inc.)' },
  { symbol: 'VNUE', label: 'VNUE (VNUE Inc.)' },
  { symbol: 'BBBYQ', label: 'BBBYQ (Bed Bath - Bankrupt)' },
  { symbol: 'SHLDQ', label: 'SHLDQ (Sears - Bankrupt)' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyser' | 'guides' | 'admin'>('analyser');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StockAnalysisResult | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('psa_recent_searches');
      return saved ? JSON.parse(saved) : ['YOOIF', 'FNMA', 'AITX', 'BBBYQ'];
    } catch {
      return ['YOOIF', 'FNMA', 'AITX', 'BBBYQ'];
    }
  });

  const trackVisit = (path: string, ticker?: string) => {
    try {
      let visitorId = localStorage.getItem('psa_visitor_id');
      if (!visitorId) {
        visitorId = 'v_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('psa_visitor_id', visitorId);
      }
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          ticker,
          referrer: document.referrer || 'direct',
          device: window.innerWidth < 768 ? 'mobile' : 'desktop',
          visitorId,
        }),
      }).catch(() => {});
    } catch {}
  };

  const performAnalysis = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    const cleanQuery = query.trim().toUpperCase();
    trackVisit(`/stock/${cleanQuery}`, cleanQuery);

    try {
      const res = await fetch(`/api/analyze-stock?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || `Could not find live market data for "${query}". Check ticker spelling.`);
        setResult(null);
        setLoading(false);
        return;
      }

      setResult(data);

      // Save to recent searches
      const upperSym = data.symbol.toUpperCase();
      setRecentSearches(prev => {
        const next = [upperSym, ...prev.filter(s => s !== upperSym)].slice(0, 8);
        try {
          localStorage.setItem('psa_recent_searches', JSON.stringify(next));
        } catch {}
        return next;
      });
    } catch (err: any) {
      setError('Network error while connecting to live exchange feed. Please retry.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performAnalysis(searchInput);
  };

  // Initial load tracking & default ticker
  useEffect(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    if (path.startsWith('/guides')) {
      setActiveTab('guides');
    } else if (path.startsWith('/admin') || search.includes('admin=true') || search.includes('tab=admin')) {
      setActiveTab('admin');
    }
    trackVisit(path || '/');
    performAnalysis('YOOIF');
  }, []);

  const handleTabChange = (tab: 'analyser' | 'guides' | 'admin') => {
    setActiveTab(tab);
    trackVisit(`/${tab}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Header: Simple and Public */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div 
            className="flex items-center gap-2.5 cursor-pointer" 
            onClick={() => {
              handleTabChange('analyser');
              performAnalysis('YOOIF');
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-600/60 flex items-center justify-center font-bold font-mono text-emerald-400 text-sm shadow-sm">
              PSA
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white font-mono flex items-center gap-1.5">
                PENNY STOCK ANALYSER
              </h1>
              <p className="text-[10px] text-slate-400 font-mono -mt-0.5">
                Live OTC Dilution, Bankruptcy &amp; Real Exchange Feeds
              </p>
            </div>
          </div>

          {/* Public Navigation Tabs */}
          <nav className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => handleTabChange('analyser')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'analyser'
                  ? 'bg-emerald-950 border border-emerald-600/80 text-emerald-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Stock Analyser</span>
            </button>

            <button
              onClick={() => handleTabChange('guides')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'guides'
                  ? 'bg-emerald-950 border border-emerald-600/80 text-emerald-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Weekly Diligence Blog</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Render Diligence Guides & Weekly Blog */}
        {activeTab === 'guides' && (
          <GuidesView
            onAnalyzeTicker={(ticker) => {
              setActiveTab('analyser');
              setSearchInput(ticker);
              performAnalysis(ticker);
            }}
          />
        )}

        {/* Render Admin Data (Real Analytics & Strategy) */}
        {activeTab === 'admin' && (
          <AdminDataView
            onAnalyzeTicker={(ticker) => {
              setActiveTab('analyser');
              setSearchInput(ticker);
              performAnalysis(ticker);
            }}
            onBackToApp={() => setActiveTab('analyser')}
          />
        )}

        {/* Render Core Stock Analyser Engine */}
        {activeTab === 'analyser' && (
          <>
            {/* Search Engine Centerpiece */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
              Search Penny Stock Ticker or Yahoo Finance Link
            </label>

            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Enter ticker (e.g. YOOIF, FNMA, AITX, BBBYQ) or paste https://finance.yahoo.com/quote/..."
                className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-emerald-500 rounded-xl pl-11 pr-32 py-3.5 text-sm sm:text-base text-white placeholder-slate-500 font-mono focus:outline-none transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={loading || !searchInput.trim()}
                className="absolute right-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white rounded-lg font-mono text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>Analyze</span>
              </button>
            </div>
          </form>

          {/* Quick-Try Suggestions & Recent Searches */}
          <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500 text-[11px] font-semibold mr-1">QUICK PICKS:</span>
              {POPULAR_SUGGESTIONS.map(item => (
                <button
                  key={item.symbol}
                  onClick={() => {
                    setSearchInput(item.symbol);
                    performAnalysis(item.symbol);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
                >
                  {item.symbol}
                </button>
              ))}
            </div>

            {recentSearches.length > 0 && (
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] flex-wrap">
                <History className="w-3 h-3 text-slate-400" />
                <span>Recent:</span>
                {recentSearches.slice(0, 4).map(sym => (
                  <button
                    key={sym}
                    onClick={() => {
                      setSearchInput(sym);
                      performAnalysis(sym);
                    }}
                    className="hover:text-emerald-400 text-slate-400 underline decoration-slate-700"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs font-mono flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-100">Analysis Error</p>
              <p className="mt-0.5 text-rose-300">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-xl">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
            <p className="font-mono text-sm text-slate-200 font-semibold">
              Connecting to live exchange feeds &amp; analyzing dilution risk...
            </p>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Checking real market prices, court bankruptcy records, and share structure
            </p>
          </div>
        )}

        {/* Single Stock Analysis Result Card */}
        {result && !loading && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Header: Company & Verified Working Links */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
                      {result.symbol}
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded font-mono font-semibold bg-slate-800 border border-slate-700 text-emerald-400">
                      {result.fullExchangeName || result.exchange}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono text-slate-400 bg-slate-950 border border-slate-800">
                      Currency: {result.currency}
                    </span>
                  </div>
                  <p className="text-base font-medium text-slate-300 mt-1">
                    {result.companyName}
                  </p>
                </div>

                {/* Working External Action Links (Yahoo, OTC, SEC, Google) */}
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={result.links.yahoo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-mono text-xs font-semibold transition-colors shadow-xs"
                    title={`Open ${result.symbol} live quote on Yahoo Finance`}
                  >
                    <span>Yahoo Finance</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  <a
                    href={result.links.otc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-mono text-xs font-semibold transition-colors shadow-xs"
                    title={`Open ${result.symbol} profile on official OTC Markets`}
                  >
                    <span>OTC Markets</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  <a
                    href={result.links.sec}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-mono text-xs font-semibold transition-colors shadow-xs"
                    title={`Search official SEC EDGAR filings for ${result.symbol}`}
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SEC EDGAR</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  <a
                    href={result.links.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-mono text-xs transition-colors shadow-xs"
                    title={`View ${result.symbol} on Google Finance`}
                  >
                    <span>Google</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* 3 Core Metric Cards: Bankrupt Status, Market Cap / Live Price, Dilution Risk */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                {/* 1. BANKRUPT OR NOT */}
                <div className={`p-4 rounded-xl border font-mono ${
                  result.isBankrupt 
                    ? 'bg-rose-950/50 border-rose-700/80' 
                    : 'bg-emerald-950/40 border-emerald-700/70'
                }`}>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    1. BANKRUPTCY STATUS
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {result.isBankrupt ? (
                      <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    )}
                    <span className={`text-sm sm:text-base font-bold ${
                      result.isBankrupt ? 'text-rose-300' : 'text-emerald-300'
                    }`}>
                      {result.isBankrupt ? 'BANKRUPT (Chapter 11)' : 'NOT BANKRUPT'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {result.bankruptcyDetails}
                  </p>
                </div>

                {/* 2. REAL MARKET PRICE & CAP */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    2. MARKET CAP &amp; LIVE QUOTE
                  </span>

                  <div className="flex items-baseline gap-2 mt-0.5">
                    {result.price !== null ? (
                      <>
                        <span className="text-xl sm:text-2xl font-bold text-white">
                          {formatCurrency(result.price)}
                        </span>
                        {result.changePercent !== null && (
                          <span className={`text-xs font-semibold ${
                            result.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {result.changePercent >= 0 ? '+' : ''}{result.changePercent.toFixed(2)}%
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-rose-400">
                        Delisted / Suspended by Exchange
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>52-Week Range:</span>
                      <strong className="text-slate-200">
                        {result.fiftyTwoWeekLow !== null && result.fiftyTwoWeekHigh !== null 
                          ? `${formatCurrency(result.fiftyTwoWeekLow)} – ${formatCurrency(result.fiftyTwoWeekHigh)}` 
                          : 'N/A'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Trading Volume:</span>
                      <strong className="text-slate-200">
                        {result.volume !== null ? `${formatLargeNumber(result.volume)} shares` : 'Zero volume'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 3. STOCK DILUTION RISK */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    3. STOCK DILUTION RISK
                  </span>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wide ${
                      result.dilutionRisk === 'CRITICAL' ? 'bg-rose-950 border border-rose-600 text-rose-300' :
                      result.dilutionRisk === 'HIGH' ? 'bg-amber-950 border border-amber-600 text-amber-300' :
                      result.dilutionRisk === 'MODERATE' ? 'bg-yellow-950 border border-yellow-600 text-yellow-300' :
                      'bg-emerald-950 border border-emerald-600 text-emerald-300'
                    }`}>
                      {result.dilutionRisk} RISK
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {result.dilutionReason}
                  </p>
                </div>
              </div>
            </div>

            {/* Real Interactive Candlestick Chart (NO FAKE CHARTS) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Real Market Candlestick Chart (Yahoo Finance Feed)
                </span>
                <span className="text-slate-500 text-[11px]">No simulated data</span>
              </div>

              <StockChart
                ticker={result.symbol}
                history={result.chart || []}
                currentPrice={result.price}
              />
            </div>

            {/* Dilution & Diligence Checklist */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono text-xs space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400" />
                Penny Stock Dilution Verification Guide for {result.symbol}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
                  <span className="text-emerald-400 font-bold block">1. Check Convertible Debt Notes</span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Open SEC Form 10-Q / 8-K disclosures and search for promissory notes with 25%–50% variable discounts to the market price.
                  </p>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
                  <span className="text-emerald-400 font-bold block">2. Verify Active Transfer Agent</span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Visit the OTC Markets link above to confirm whether the company transfer agent has reported recent verified share counts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )}

        {/* Sponsored Partner Advertisement Banner */}
        <section className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1.5 px-1">
            <span className="uppercase tracking-wider text-slate-400">Sponsored Partner · Free Web Class</span>
            <span className="text-slate-600">Advertisement</span>
          </div>
          <a
            href="https://millionairepartnership.com/webclass-d24#aff=Earnliketate"
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => trackVisit('/ad/affiliate-banner', 'AFF_CLICK')}
            className="block rounded-xl overflow-hidden border border-slate-800 hover:border-amber-500/60 shadow-lg hover:shadow-amber-500/10 transition-all duration-200 group bg-slate-900"
            title="Click to register for Free Web Class"
          >
            <img
              src="/assets/aistudio/image_f9e09ace.png"
              alt="Free Limited-Time Web Class - How To Make An Additional $1,000 - $3,000 Per Day In Passive Income"
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-200"
              loading="lazy"
            />
          </a>
        </section>
      </main>

      {/* Minimal Footer with Small Discrete Admin Data Link */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-3.5 font-mono text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px]">
            <span>Penny Stock Analyser · Live Market Feeds</span>
            <span>·</span>
            <span>Verified Links to Yahoo, OTC &amp; SEC</span>
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-400 transition-colors"
            >
              RSS Feed
            </a>
            <span className="text-slate-800">·</span>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-400 transition-colors"
            >
              Sitemap
            </a>
            <span className="text-slate-800">·</span>
            <button
              onClick={() => handleTabChange('admin')}
              className="text-slate-600 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
              title="Restricted admin visitor analytics & SEO controls"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>Admin Data</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
