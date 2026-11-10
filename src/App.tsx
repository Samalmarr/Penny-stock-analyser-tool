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
  Lock,
  Activity,
  Globe,
  Building2,
  Landmark,
  ShieldCheck
} from 'lucide-react';
import { GuidesView } from './components/GuidesView';
import { AdminDataView } from './components/AdminDataView';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { formatCurrency, formatLargeNumber, formatMarketCap, formatSignedCurrencyCompact } from './utils/formatters';
import { INITIAL_PINK_STOCKS } from './data/stocksData';
import { resolveStockJurisdiction, StockJurisdictionInfo } from './utils/stockJurisdiction';

interface StockAnalysisResult {
  success: boolean;
  symbol: string;
  companyName: string;
  country: string;
  countryFlag: string;
  primaryExchange: string;
  homeMarketTicker?: string;
  listingType: 'US_DOMESTIC_OTC' | 'CANADIAN_DUAL_LISTED' | 'FOREIGN_ADR' | 'US_EXCHANGE_LISTED' | 'BANKRUPTCY_OTC';
  filingJurisdiction: 'SEC_EDGAR' | 'SEDAR_PLUS' | 'FOREIGN_DISCLOSURE';
  filingAuthorityName: string;
  regulatoryExemptionNote?: string;
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
  annualFinancials?: {
    currency: string;
    source: string;
    years: {
      year: string;
      asOfDate: string;
      turnover: number | null;
      profit: number | null;
      debt: number | null;
    }[];
  } | null;
  links: {
    yahoo: string;
    otc: string;
    sec: string;
    sedar?: string;
    disclosure?: string;
    google: string;
  };
}

interface TrendingPennyItem {
  symbol: string;
  label: string;
  price?: number;
  volume?: number;
}

const DEFAULT_MOST_VIEWED_PENNY_STOCKS: TrendingPennyItem[] = [
  { symbol: 'PLUG', label: 'PLUG (Plug Power, Inc.)' },
  { symbol: 'GRAB', label: 'GRAB (Grab Holdings)' },
  { symbol: 'NIO', label: 'NIO (NIO Inc.)' },
  { symbol: 'AMC', label: 'AMC (AMC Entertainment)' },
  { symbol: 'ACHR', label: 'ACHR (Archer Aviation)' },
  { symbol: 'DNN', label: 'DNN (Denison Mines)' },
  { symbol: 'AITX', label: 'AITX (Artificial Intelligence Tech)' },
  { symbol: 'FNMA', label: 'FNMA (Fannie Mae)' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyser' | 'guides' | 'admin'>('analyser');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StockAnalysisResult | null>(null);
  const [isExampleResult, setIsExampleResult] = useState(true);
  const [mostViewedStocks, setMostViewedStocks] = useState<TrendingPennyItem[]>(DEFAULT_MOST_VIEWED_PENNY_STOCKS);
  const [mostViewedSource, setMostViewedSource] = useState<string>('Yahoo Finance & StockAnalysis');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('psa_recent_searches');
      return saved ? JSON.parse(saved) : ['PLUG', 'NIO', 'AMC', 'AITX'];
    } catch {
      return ['PLUG', 'NIO', 'AMC', 'AITX'];
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

  const updateRecentSearches = (symbol: string) => {
    const upperSym = symbol.toUpperCase();
    setRecentSearches(prev => {
      const next = [upperSym, ...prev.filter(s => s !== upperSym)].slice(0, 8);
      try {
        localStorage.setItem('psa_recent_searches', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const analyzeStockClientFallback = (rawInput: string): StockAnalysisResult => {
    let cleanSymbol = rawInput.trim().toUpperCase();
    if (cleanSymbol.includes('/QUOTE/')) {
      const match = cleanSymbol.match(/\/QUOTE\/([A-Z0-9._-]+)/i);
      if (match) cleanSymbol = match[1].toUpperCase();
    } else {
      cleanSymbol = cleanSymbol.replace(/[^A-Z0-9._-]/g, '');
    }

    const catalogStock = INITIAL_PINK_STOCKS.find(s => s.ticker.toUpperCase() === cleanSymbol);
    const isBankrupt = cleanSymbol.endsWith('Q') || catalogStock?.operatingStatus === 'Bankrupt';
    
    let dilutionRisk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' = 'MODERATE';
    let dilutionReason = 'Live market feed unavailable. Check official filings and Yahoo Finance before trading.';

    if (isBankrupt) {
      dilutionRisk = 'CRITICAL';
      dilutionReason = 'Ticker holds a Q-suffix or Chapter 11 bankruptcy status. Old pre-petition common equity is at extreme risk of total cancellation without distribution.';
    }

    const jurisdictionInfo = resolveStockJurisdiction(
      cleanSymbol,
      catalogStock?.country,
      catalogStock?.tier,
      'OTC Markets Group'
    );

    return {
      success: true,
      symbol: cleanSymbol,
      companyName: catalogStock?.name || `${cleanSymbol}`,
      country: jurisdictionInfo.country,
      countryFlag: jurisdictionInfo.countryFlag,
      primaryExchange: jurisdictionInfo.primaryExchange,
      homeMarketTicker: jurisdictionInfo.homeMarketTicker,
      listingType: jurisdictionInfo.listingType,
      filingJurisdiction: jurisdictionInfo.filingJurisdiction,
      filingAuthorityName: jurisdictionInfo.filingAuthorityName,
      regulatoryExemptionNote: jurisdictionInfo.regulatoryExemptionNote,
      isBankrupt,
      bankruptcyStatus: isBankrupt ? 'BANKRUPT (Chapter 11 Proceedings / Q-Ticker)' : 'NOT BANKRUPT (Active Entity)',
      bankruptcyDetails: isBankrupt
        ? 'The Q-suffix denotes an issuer in Chapter 11/7 bankruptcy proceedings. In almost all public reorganizations, existing common shares are cancelled for total loss.'
        : 'This stock trades without a bankruptcy Q-suffix and is an active trading entity.',
      hasLiveQuote: false,
      price: null,
      changePercent: null,
      fiftyTwoWeekHigh: null,
      fiftyTwoWeekLow: null,
      volume: null,
      currency: 'USD',
      exchange: jurisdictionInfo.primaryExchange || catalogStock?.tier || 'OTC Markets',
      fullExchangeName: jurisdictionInfo.primaryExchange || 'OTC Markets Group',
      dilutionRisk,
      dilutionReason,
      chart: null,
      annualFinancials: null,
      links: jurisdictionInfo.links
    };
  };

  const performAnalysis = async (query: string, isExample = false) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setIsExampleResult(isExample);

    const cleanQuery = query.trim().toUpperCase();
    trackVisit(`/stock/${cleanQuery}`, cleanQuery);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(`/api/analyze-stock?query=${encodeURIComponent(query.trim())}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          setResult(data);
          if (!isExample) updateRecentSearches(data.symbol);
          setLoading(false);
          return;
        }
      }

      // Gracefully fall back to built-in diligence analysis
      const fallback = analyzeStockClientFallback(query);
      setResult(fallback);
      if (!isExample) updateRecentSearches(fallback.symbol);
    } catch (err: any) {
      // In case of any network timeout or serverless cold-start, seamlessly render client dilution audit
      try {
        const fallback = analyzeStockClientFallback(query);
        setResult(fallback);
        if (!isExample) updateRecentSearches(fallback.symbol);
      } catch (innerErr) {
        setError('Could not analyze ticker. Please verify symbol formatting.');
        setResult(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performAnalysis(searchInput, false);
  };

  // Initial load tracking, live most-viewed penny stocks & default top-searched example
  useEffect(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    if (path.startsWith('/guides')) {
      setActiveTab('guides');
    } else if (path.startsWith('/admin') || path.startsWith('/traffic') || path.startsWith('/analytics') || search.includes('admin=true') || search.includes('tab=admin')) {
      setActiveTab('admin');
    }
    trackVisit(path || '/');
    performAnalysis('PLUG', true);

    fetch('/api/trending-penny-stocks')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.stocks && Array.isArray(data.stocks) && data.stocks.length > 0) {
          setMostViewedStocks(data.stocks);
          if (data.source) setMostViewedSource(data.source);
        }
      })
      .catch(() => {});
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
              performAnalysis(mostViewedStocks[0]?.symbol || 'PLUG', true);
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
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
                placeholder="Enter ticker (e.g. PLUG, NIO, AITX, BBBYQ) or paste https://finance.yahoo.com/quote/..."
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

          {/* Most Viewed Penny Stocks & Recent Searches */}
          <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="text-emerald-400 text-[11px] font-bold mr-1 flex items-center gap-1"
                title={`Sourced live from ${mostViewedSource}`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                MOST VIEWED PENNY STOCKS:
              </span>
              {mostViewedStocks.map(item => (
                <button
                  key={item.symbol}
                  onClick={() => {
                    setSearchInput(item.symbol);
                    performAnalysis(item.symbol, false);
                  }}
                  title={item.price ? `${item.label} · $${item.price}` : item.label}
                  className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-600/60 text-slate-300 hover:text-white transition-colors text-[11px] flex items-center gap-1"
                >
                  <span className="font-semibold">{item.symbol}</span>
                  {item.price !== undefined && (
                    <span className="text-[10px] text-slate-500">${item.price.toFixed(2)}</span>
                  )}
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
                    {isExampleResult && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[11px] font-bold uppercase tracking-wider bg-amber-950/80 border border-amber-600/70 text-amber-300">
                        Example · Top Searched
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
                      {result.symbol}
                    </h2>
                    {/* Country of Origin Badge */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-mono text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-200">
                      <span className="text-sm">{result.countryFlag || '🌐'}</span>
                      <span>{result.country || 'International'}</span>
                    </span>
                    {/* Primary Exchange Badge */}
                    <span className="text-xs px-2.5 py-0.5 rounded font-mono font-semibold bg-emerald-950/70 border border-emerald-700/60 text-emerald-400">
                      {result.primaryExchange || result.fullExchangeName || result.exchange}
                    </span>
                    {result.homeMarketTicker && (
                      <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60">
                        Home: {result.homeMarketTicker}
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded font-mono text-slate-400 bg-slate-950 border border-slate-800">
                      Currency: {result.currency}
                    </span>
                  </div>
                  <p className="text-base font-medium text-slate-300 mt-1">
                    {result.companyName}
                  </p>
                </div>

                {/* Working External Action Links (Yahoo, OTC, SEDAR+/SEC, Google) */}
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

                  {/* Dynamic Filings Link: Canadian SEDAR+ vs US SEC EDGAR */}
                  {result.filingJurisdiction === 'SEDAR_PLUS' ? (
                    <>
                      <a
                        href={result.links.sedar || 'https://www.sedarplus.ca'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-200 hover:text-white border border-rose-700/70 font-mono text-xs font-semibold transition-colors shadow-xs"
                        title={`Open official Canadian SEDAR+ regulatory filings for ${result.symbol}`}
                      >
                        <span className="text-xs">🇨🇦</span>
                        <span>SEDAR+ (Canada)</span>
                        <ExternalLink className="w-3 h-3 text-rose-400" />
                      </a>

                      <a
                        href={result.links.disclosure || result.links.otc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-mono text-xs font-semibold transition-colors shadow-xs"
                        title={`View OTC alternative disclosure filings for ${result.symbol}`}
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>OTC Filings</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </>
                  ) : (
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
                  )}

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

              {/* Jurisdiction & Regulatory Filing Authority Banner */}
              <div className="mt-4 p-3.5 rounded-xl border bg-slate-950/80 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-slate-800">
                <div className="flex items-start sm:items-center gap-2.5">
                  <span className="text-2xl shrink-0">{result.countryFlag || '🌐'}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">
                        {result.country} · {result.primaryExchange}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {result.filingAuthorityName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-sans">
                      {result.regulatoryExemptionNote}
                    </p>
                  </div>
                </div>
                {result.filingJurisdiction === 'SEDAR_PLUS' ? (
                  <a
                    href={result.links.sedar || 'https://www.sedarplus.ca'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-950/90 hover:bg-rose-900 border border-rose-700 text-rose-200 text-xs font-bold transition-colors shadow-xs"
                  >
                    <span>Search SEDAR+ Filings</span>
                    <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                  </a>
                ) : (
                  <a
                    href={result.links.sec}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-colors shadow-xs"
                  >
                    <span>Search SEC EDGAR</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}
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
                      <a
                        href={result.links.yahoo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 underline decoration-amber-600/60"
                      >
                        {result.hasLiveQuote ? 'Delisted / Suspended by Exchange' : 'Live Quote Unavailable — View on Yahoo Finance →'}
                      </a>
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

            {/* Official Live Charts & Financial Filings Hub */}
         <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl font-mono text-xs space-y-4">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
             <div>
               <span className="font-bold text-sm text-white flex items-center gap-2">
                 <TrendingUp className="w-4 h-4 text-emerald-400" />
                 Official Live Charts & Financial Filings for {result.symbol}
               </span>
               <p className="text-slate-400 text-[11px] mt-0.5">
                 Real-time exchange candlesticks, technical depth, and verified balance sheets are hosted directly on official market sources.
               </p>
             </div>
             <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 self-start sm:self-center">
               OFFICIAL DATA FEEDS
             </span>
           </div>

           {/* 3-Year Annual Financials (Turnover, Profit & Debt) */}
           <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80 mb-3">
               <div className="flex items-center gap-2">
                 <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                 <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                   Past 3 Years Financials (Turnover, Profit &amp; Debt)
                 </h3>
               </div>
               {result.annualFinancials && (
                 <span className="text-[10px] text-slate-400">
                   Currency: <strong className="text-slate-200">{result.annualFinancials.currency}</strong> · Source: {result.annualFinancials.source}
                 </span>
               )}
             </div>

             {result.annualFinancials && result.annualFinancials.years.length > 0 ? (
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse text-xs">
                   <thead>
                     <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400">
                       <th className="py-2 pr-4 font-semibold">Fiscal Year</th>
                       <th className="py-2 px-4 font-semibold">Turnover (Revenue)</th>
                       <th className="py-2 px-4 font-semibold">Profit / (Loss)</th>
                       <th className="py-2 pl-4 font-semibold">Total Debt</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800/60">
                     {result.annualFinancials.years.map(fy => {
                       const cur = result.annualFinancials?.currency || 'USD';
                       return (
                         <tr key={fy.asOfDate} className="hover:bg-slate-900/60 transition-colors">
                           <td className="py-2.5 pr-4 font-bold text-white whitespace-nowrap">
                             FY {fy.year}{' '}
                             <span className="text-[10px] font-normal text-slate-500">({fy.asOfDate})</span>
                           </td>
                           <td className="py-2.5 px-4 text-slate-200 font-semibold whitespace-nowrap">
                             {formatSignedCurrencyCompact(fy.turnover, cur)}
                           </td>
                           <td
                             className={`py-2.5 px-4 font-semibold whitespace-nowrap ${
                               fy.profit === null
                                 ? 'text-slate-500'
                                 : fy.profit >= 0
                                 ? 'text-emerald-400'
                                 : 'text-rose-400'
                             }`}
                           >
                             {formatSignedCurrencyCompact(fy.profit, cur)}
                           </td>
                           <td className="py-2.5 pl-4 text-amber-300 font-semibold whitespace-nowrap">
                             {formatSignedCurrencyCompact(fy.debt, cur)}
                           </td>
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
               </div>
             ) : (
               <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                 Reported 3-year annual turnover, profit, and debt statements are unavailable in live feeds for this ticker (common for delinquent, dark, or bankrupt shells). Check{' '}
                 <a
                   href={result.filingJurisdiction === 'SEDAR_PLUS' ? result.links.sedar || 'https://www.sedarplus.ca' : result.links.sec}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-emerald-400 underline hover:text-emerald-300"
                 >
                   {result.filingJurisdiction === 'SEDAR_PLUS' ? 'Canadian SEDAR+' : 'SEC EDGAR'}
                 </a>{' '}
                 or{' '}
                 <a
                   href={result.links.yahoo}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-emerald-400 underline hover:text-emerald-300"
                 >
                   Yahoo Finance
                 </a>{' '}
                 directly.
               </p>
             )}
           </div>

           {/* Real Financial & Chart Portals Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
             {/* Yahoo Finance Live Chart */}
             <a
               href={result.links.yahoo}
               target="_blank"
               rel="noopener noreferrer"
               className="flex flex-col justify-between p-3.5 bg-slate-950 hover:bg-slate-800/80 rounded-lg border border-slate-800 hover:border-emerald-500/50 transition-all group"
             >
               <div>
                 <div className="flex items-center justify-between mb-1.5">
                   <span className="font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-xs">
                     Yahoo Finance
                   </span>
                   <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                 </div>
                 <p className="text-[11px] text-slate-400 leading-relaxed">
                   Live real-time candlestick charts, multi-timeframe technical indicators, Level 2 bids, and community board.
                 </p>
               </div>
               <span className="text-[10px] text-emerald-400 font-bold mt-3 flex items-center gap-1">
                 Open Yahoo Live Chart →
               </span>
             </a>

             {/* Google Finance */}
             <a
               href={result.links.google}
               target="_blank"
               rel="noopener noreferrer"
               className="flex flex-col justify-between p-3.5 bg-slate-950 hover:bg-slate-800/80 rounded-lg border border-slate-800 hover:border-emerald-500/50 transition-all group"
             >
               <div>
                 <div className="flex items-center justify-between mb-1.5">
                   <span className="font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-xs">
                     Google Finance
                   </span>
                   <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                 </div>
                 <p className="text-[11px] text-slate-400 leading-relaxed">
                   Instant interactive price performance, day/year range metrics, and financial news stream.
                 </p>
               </div>
               <span className="text-[10px] text-emerald-400 font-bold mt-3 flex items-center gap-1">
                 Open Google Finance →
               </span>
             </a>

             {/* OTC Markets */}
             <a
               href={result.links.otc}
               target="_blank"
               rel="noopener noreferrer"
               className="flex flex-col justify-between p-3.5 bg-slate-950 hover:bg-slate-800/80 rounded-lg border border-slate-800 hover:border-emerald-500/50 transition-all group"
             >
               <div>
                 <div className="flex items-center justify-between mb-1.5">
                   <span className="font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-xs">
                     OTC Markets Group
                   </span>
                   <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                 </div>
                 <p className="text-[11px] text-slate-400 leading-relaxed">
                   Official tier verification (Pink / OTCQB), transfer-agent verified share structure, and Caveat Emptor audit.
                 </p>
               </div>
               <span className="text-[10px] text-emerald-400 font-bold mt-3 flex items-center gap-1">
                 View OTC Markets Quote →
               </span>
             </a>

             {/* Dynamic Regulatory Filing Card: SEDAR+ for Canada vs SEC EDGAR for US */}
             {result.filingJurisdiction === 'SEDAR_PLUS' ? (
               <a
                 href={result.links.sedar || 'https://www.sedarplus.ca'}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex flex-col justify-between p-3.5 bg-slate-950 hover:bg-slate-800/80 rounded-lg border border-slate-800 hover:border-rose-500/50 transition-all group"
               >
                 <div>
                   <div className="flex items-center justify-between mb-1.5">
                     <span className="font-bold text-white group-hover:text-rose-400 transition-colors flex items-center gap-1.5 text-xs">
                       <span>🇨🇦</span>
                       <span>SEDAR+ Filings (Canada)</span>
                     </span>
                     <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400 transition-colors" />
                   </div>
                   <p className="text-[11px] text-slate-400 leading-relaxed">
                     Canadian audited annual financials, quarterly MD&As, and securities commission filings (SEC Rule 12g3-2(b)).
                   </p>
                 </div>
                 <span className="text-[10px] text-rose-400 font-bold mt-3 flex items-center gap-1">
                   Search Canadian SEDAR+ →
                 </span>
               </a>
             ) : (
               <a
                 href={result.links.sec}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex flex-col justify-between p-3.5 bg-slate-950 hover:bg-slate-800/80 rounded-lg border border-slate-800 hover:border-emerald-500/50 transition-all group"
               >
                 <div>
                   <div className="flex items-center justify-between mb-1.5">
                     <span className="font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-xs">
                       SEC EDGAR Filings
                     </span>
                     <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                   </div>
                   <p className="text-[11px] text-slate-400 leading-relaxed">
                     Audited Form 10-K balance sheets, 10-Q quarterlies, 8-K material events, and Chapter 11 bankruptcy filings.
                   </p>
                 </div>
                 <span className="text-[10px] text-emerald-400 font-bold mt-3 flex items-center gap-1">
                   Search SEC Disclosures →
                 </span>
               </a>
             )}
           </div>

           {/* Informational Transparency Note */}
           <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
             <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
             <p className="leading-relaxed">
               <strong>Zero Synthetic Data Guarantee:</strong> Real-time candlestick charting, Level 2 order book depth, and audited balance sheet reports are officially hosted on <strong>Yahoo Finance</strong> and <strong>Google Finance</strong>. We never display simulated or estimated chart graphs.
             </p>
           </div>
         </div>

            {/* Dilution & Diligence Checklist */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono text-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-400" />
                  Penny Stock Dilution Verification Guide for {result.symbol}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Origin: {result.countryFlag} {result.country} ({result.primaryExchange})
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                {result.filingJurisdiction === 'SEDAR_PLUS' ? (
                  <>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
                      <span className="text-rose-400 font-bold block">1. Check SEDAR+ & OTC Filings for Warrants & Unit Offerings</span>
                      <p className="text-slate-400 leading-relaxed text-[11px]">
                        Review Canadian MD&A and OTC alternative disclosures for flow-through shares, private placement warrants, and unit financings.
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
                      <span className="text-emerald-400 font-bold block">2. Dual-Listing CAD vs USD Arbitrage Check</span>
                      <p className="text-slate-400 leading-relaxed text-[11px]">
                        Compare volume and price on the Canadian home exchange (TSX-V in CAD) against US OTC (in USD) to detect cross-border dumping.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    )}

        {/* Non-Financial Advice & Due Diligence Statement */}
        <section className="rounded-xl border border-amber-700/50 bg-amber-950/25 p-4 sm:p-5 font-mono text-xs space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Not Financial Advice · Do Your Own Research</span>
          </div>
          <p className="text-slate-200 font-sans text-xs sm:text-sm leading-relaxed">
            This tool is for informational and educational purposes only and is <strong>not financial advice</strong>. Never gamble money you cannot afford to lose. Always spend <strong>at least 1 hour investigating a stock</strong> (filings, cash runway, debt, and share dilution) before you buy. Remember: <strong>only 1 in 100 penny stocks are worth buying</strong> — don&apos;t be impulsive.
          </p>
        </section>

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
      {typeof window !== 'undefined' &&
        !window.location.hostname.includes('run.app') &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1' && <VercelAnalytics />}
    </div>
  );
}
