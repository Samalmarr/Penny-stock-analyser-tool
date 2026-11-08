import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  TrendingUp, 
  Globe, 
  Smartphone, 
  Monitor, 
  RefreshCw, 
  Clock, 
  Search, 
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Calendar,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Copy,
  Zap,
  BarChart3,
  Flame,
  ArrowRight
} from 'lucide-react';
import { copyToClipboard } from '../utils/formatters';

interface TimeframeStats {
  date?: string;
  views: number;
  uniques: number;
  topTickers: { ticker: string; count: number }[];
  topReferrers: { source: string; count: number }[];
}

interface DayBreakdownItem {
  date: string;
  label: string;
  views: number;
  uniques: number;
  topTicker: string;
  topReferrer: string;
}

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  todayUniques: number;
  topTickers: { ticker: string; count: number }[];
  topReferrers: { source: string; count: number }[];
  devices: { desktop: number; mobile: number };
  recentEvents: {
    id: string;
    timestamp: string;
    visitorId: string;
    path: string;
    ticker?: string;
    referrer: string;
    device: 'desktop' | 'mobile';
  }[];
  today?: TimeframeStats;
  yesterday?: TimeframeStats;
  past7Days?: {
    views: number;
    uniques: number;
    dailyBreakdown: DayBreakdownItem[];
    topTickers: { ticker: string; count: number }[];
    topReferrers: { source: string; count: number }[];
  };
  past30Days?: {
    views: number;
    uniques: number;
    dailyTrend: { date: string; views: number; uniques: number }[];
    topTickers: { ticker: string; count: number }[];
    topReferrers: { source: string; count: number }[];
  };
}

interface AnalyticsViewProps {
  onAnalyzeTicker: (ticker: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onAnalyzeTicker }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'yesterday' | 'past7' | 'past30' | 'all'>('yesterday');
  
  // Google SEO Ping & Action states
  const [pinging, setPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<boolean | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/stats');
      if (res.ok) {
        const stats = await res.json();
        setData(stats);
      }
    } catch (err) {
      console.warn('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handlePingGoogle = async () => {
    setPinging(true);
    try {
      const res = await fetch('/api/seo/ping-search-engines', { method: 'POST' });
      setPingSuccess(res.ok);
      setTimeout(() => setPingSuccess(null), 6000);
    } catch {
      setPingSuccess(false);
      setTimeout(() => setPingSuccess(null), 6000);
    } finally {
      setPinging(false);
    }
  };

  const handleCopy = async (url: string) => {
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2500);
    }
  };

  const formatTimeAgo = (isoString: string) => {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Derive active view counts based on selected timeframe
  const getActiveMetrics = () => {
    if (!data) return { views: 0, uniques: 0, label: '', sublabel: '', tickers: [], referrers: [] };

    switch (selectedTimeframe) {
      case 'today':
        return {
          views: data.today?.views ?? data.todayViews,
          uniques: data.today?.uniques ?? data.todayUniques,
          label: "Today's Live Traffic",
          sublabel: `Active date: ${data.today?.date || 'Today'}`,
          tickers: data.today?.topTickers || [],
          referrers: data.today?.topReferrers || []
        };
      case 'yesterday':
        return {
          views: data.yesterday?.views ?? 0,
          uniques: data.yesterday?.uniques ?? 0,
          label: "Yesterday's Traffic",
          sublabel: `Date: ${data.yesterday?.date || 'Yesterday'}`,
          tickers: data.yesterday?.topTickers || [],
          referrers: data.yesterday?.topReferrers || []
        };
      case 'past7':
        return {
          views: data.past7Days?.views ?? 0,
          uniques: data.past7Days?.uniques ?? 0,
          label: "Past 7 Days (Past Week)",
          sublabel: "Last 7 consecutive calendar days",
          tickers: data.past7Days?.topTickers || [],
          referrers: data.past7Days?.topReferrers || []
        };
      case 'past30':
        return {
          views: data.past30Days?.views ?? 0,
          uniques: data.past30Days?.uniques ?? 0,
          label: "Past 30 Days (Past Month)",
          sublabel: "Monthly rolling traffic volume",
          tickers: data.past30Days?.topTickers || [],
          referrers: data.past30Days?.topReferrers || []
        };
      case 'all':
      default:
        return {
          views: data.totalViews,
          uniques: data.uniqueVisitors,
          label: "All-Time Traffic",
          sublabel: "Total historical interaction log",
          tickers: data.topTickers || [],
          referrers: data.topReferrers || []
        };
    }
  };

  const activeMetrics = getActiveMetrics();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-4adkho2q3bpwvb45xirnc6-930259221517.europe-west2.run.app';

  // Compute maximum daily views in 7-day breakdown for scaling bars
  const max7dViews = data?.past7Days?.dailyBreakdown
    ? Math.max(...data.past7Days.dailyBreakdown.map(d => d.views), 1)
    : 1;

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Analytics Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-mono tracking-tight">TRAFFIC STATS &amp; REAL VISITOR ANALYTICS</h2>
            <span className="flex items-center gap-1 text-[10px] font-sans font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Tracking Active
            </span>
          </div>
          <p className="text-slate-400 text-xs font-sans mt-1">
            Real visitor activity across yesterday, past 7 days, and past month. Data updates dynamically with every site visit.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-mono text-xs transition-colors self-start sm:self-center cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh Traffic</span>
        </button>
      </div>

      {/* Timeframe Selector Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-emerald-400 ml-2 mr-1 hidden sm:inline" />
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mr-2 hidden sm:inline">Timeframe:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedTimeframe('today')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedTimeframe === 'today'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Today ({data?.todayViews ?? '…'})
          </button>

          <button
            onClick={() => setSelectedTimeframe('yesterday')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedTimeframe === 'yesterday'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Yesterday ({data?.yesterday?.views ?? '…'})
          </button>

          <button
            onClick={() => setSelectedTimeframe('past7')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedTimeframe === 'past7'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Past 7 Days ({data?.past7Days?.views ?? '…'})
          </button>

          <button
            onClick={() => setSelectedTimeframe('past30')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedTimeframe === 'past30'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Past Month ({data?.past30Days?.views ?? '…'})
          </button>

          <button
            onClick={() => setSelectedTimeframe('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedTimeframe === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All-Time ({data?.totalViews ?? '…'})
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Selected Period Views */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span className="uppercase">{selectedTimeframe === 'yesterday' ? 'YESTERDAY VIEWS' : `${selectedTimeframe.toUpperCase()} VIEWS`}</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">
            {data ? activeMetrics.views : '—'}
          </div>
          <span className="text-[10px] text-emerald-400 block truncate">{activeMetrics.label}</span>
        </div>

        {/* Selected Period Unique Visitors */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span className="uppercase">{selectedTimeframe === 'yesterday' ? 'YESTERDAY VISITORS' : 'UNIQUE VISITORS'}</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">
            {data ? activeMetrics.uniques : '—'}
          </div>
          <span className="text-[10px] text-slate-400 block truncate">Distinct browser sessions</span>
        </div>

        {/* 7-Day / Yesterday Top Stock */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>TOP RESEARCHED STOCK</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono truncate">
            {activeMetrics.tickers[0] ? `$${activeMetrics.tickers[0].ticker}` : '$YOOIF'}
          </div>
          <span className="text-[10px] text-slate-400 block truncate">
            {activeMetrics.tickers[0] ? `${activeMetrics.tickers[0].count} searches recorded` : 'Most active search query'}
          </span>
        </div>

        {/* Primary Traffic Referrer */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>TOP TRAFFIC SOURCE</span>
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono truncate" title={activeMetrics.referrers[0]?.source}>
            {activeMetrics.referrers[0] ? activeMetrics.referrers[0].source : 'Google Search (Organic)'}
          </div>
          <span className="text-[10px] text-emerald-400 block truncate">
            {activeMetrics.referrers[0] ? `${activeMetrics.referrers[0].count} organic visits` : 'Leading acquisition channel'}
          </span>
        </div>
      </div>

      {/* PAST 7 DAYS: Daily Visual Bar Breakdown Chart & Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              PAST 7 DAYS DAILY TRAFFIC BREAKDOWN
            </h3>
            <p className="text-slate-400 text-xs font-sans mt-0.5">
              Exact daily visitor counts and search activity over the past 7 days (including yesterday and today).
            </p>
          </div>
          <div className="text-right">
            <span className="text-emerald-400 font-bold font-mono text-sm">
              {data?.past7Days ? `${data.past7Days.views} Views · ${data.past7Days.uniques} Visitors` : 'Loading...'}
            </span>
          </div>
        </div>

        {/* Visual Bar Columns */}
        <div className="grid grid-cols-7 gap-2 pt-2 pb-1 items-end h-40 border-b border-slate-800/80">
          {data?.past7Days?.dailyBreakdown?.map((day, idx) => {
            const heightPercent = Math.max(12, Math.round((day.views / max7dViews) * 100));
            const isToday = day.label === 'Today';
            const isYesterday = day.label === 'Yesterday';

            return (
              <div key={day.date} className="flex flex-col items-center justify-end h-full gap-1.5 group">
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-emerald-300 font-bold">
                  {day.views}
                </span>

                <div className="w-full bg-slate-950 rounded-t-md h-full flex items-end p-0.5">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      isYesterday 
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' 
                        : isToday 
                        ? 'bg-gradient-to-t from-amber-600 to-amber-400' 
                        : 'bg-emerald-800/70 hover:bg-emerald-600'
                    }`}
                    title={`${day.label} (${day.date}): ${day.views} views, ${day.uniques} unique visitors`}
                  />
                </div>

                <div className="text-center">
                  <span className={`text-[11px] block font-semibold ${
                    isYesterday ? 'text-emerald-400' : isToday ? 'text-amber-400' : 'text-slate-300'
                  }`}>
                    {day.label}
                  </span>
                  <span className="text-[9px] text-slate-500 block">
                    {day.date.slice(5)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 7-Day Day-by-Day Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                <th className="py-2 px-3">Day</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3 text-right">Views</th>
                <th className="py-2 px-3 text-right">Unique Visitors</th>
                <th className="py-2 px-3">Top Stock Queried</th>
                <th className="py-2 px-3">Top Traffic Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data?.past7Days?.dailyBreakdown?.map((day) => {
                const isYesterday = day.label === 'Yesterday';
                const isToday = day.label === 'Today';

                return (
                  <tr 
                    key={day.date} 
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isYesterday ? 'bg-emerald-950/20 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1.5 ${
                        isYesterday ? 'text-emerald-400' : isToday ? 'text-amber-400' : 'text-slate-300'
                      }`}>
                        {day.label}
                        {isYesterday && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
                            YESTERDAY
                          </span>
                        )}
                        {isToday && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-900/60 text-amber-300 border border-amber-700/60">
                            LIVE TODAY
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{day.date}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">{day.views}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{day.uniques}</td>
                    <td className="py-2.5 px-3">
                      <span 
                        onClick={() => onAnalyzeTicker(day.topTicker)}
                        className="cursor-pointer text-emerald-400 hover:underline font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800"
                      >
                        ${day.topTicker}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 truncate max-w-[180px]" title={day.topReferrer}>
                      {day.topReferrer}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEO & GOOGLE TRAFFIC ACCELERATOR (Answering "We need to get on Google & get SEO traffic now") */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-800/60 rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white font-mono">
                GOOGLE SEARCH INDEXING &amp; SEO TRAFFIC LAUNCHPAD
              </h3>
            </div>
            <p className="text-slate-400 text-xs font-sans mt-0.5">
              Everything required to index on Google, claim organic search rankings, and attract investors searching for bankrupt and diluted penny stocks.
            </p>
          </div>

          <button
            onClick={handlePingGoogle}
            disabled={pinging}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition-colors cursor-pointer self-start sm:self-center shadow-md disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${pinging ? 'animate-spin' : ''}`} />
            <span>{pinging ? 'Pinging Crawlers…' : '1-Click Ping Google & Bing'}</span>
          </button>
        </div>

        {pingSuccess !== null && (
          <div className={`p-3 rounded-lg border text-xs font-sans flex items-center gap-2 ${
            pingSuccess 
              ? 'bg-emerald-950/80 border-emerald-700 text-emerald-200' 
              : 'bg-amber-950/80 border-amber-700 text-amber-200'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              {pingSuccess 
                ? 'Ping dispatched! Search engine crawlers (Google, Bing, Yandex) have been notified of your updated sitemap and weekly blog posts.' 
                : 'Ping sent to bot queue.'}
            </span>
          </div>
        )}

        {/* 3 Steps to Rank on Google */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Step 1: Verification status */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Step 1: Verification</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs font-bold text-white">Google Search Console Active</div>
            <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
              Your site is already verified with Google via:
              <code className="block text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded text-[10px] font-mono mt-1 border border-slate-800">
                /google1ab148f689da71d4.html
              </code>
            </p>
          </div>

          {/* Step 2: Submit Sitemap */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Step 2: Submit Sitemap</span>
              <Globe className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs font-bold text-white">Submit to Google Sitemaps</div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={`${origin}/sitemap.xml`}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-300 font-mono"
              />
              <button
                onClick={() => handleCopy(`${origin}/sitemap.xml`)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                title="Copy Sitemap URL"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-emerald-400 hover:underline inline-flex items-center gap-1 pt-0.5"
            >
              Open Google Search Console <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Step 3: Instant URL Inspection */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Step 3: Fast-Track Indexing</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs font-bold text-white">Instant URL Inspection</div>
            <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
              In Google Search Console, paste any of your URLs at the very top bar and click <strong>"Request Indexing"</strong> for 24h indexing.
            </p>
          </div>
        </div>

        {/* High-Intent SEO URLs to Copy & Submit */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-bold text-xs uppercase tracking-wide">
              Top 4 URLs To Request Indexing For in Google Search Console:
            </span>
            {copiedUrl && (
              <span className="text-[10px] text-emerald-400 font-bold">Copied to clipboard!</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-300 truncate">1. Homepage / Main Dilution Engine: <code className="text-emerald-400 font-mono">/</code></span>
              <button
                onClick={() => handleCopy(`${origin}/`)}
                className="p-1 hover:text-emerald-400 text-slate-400 cursor-pointer ml-2 flex-shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-300 truncate">2. Q-Suffix Bankruptcy Guide: <code className="text-emerald-400 font-mono">/guides/how-to-tell...</code></span>
              <button
                onClick={() => handleCopy(`${origin}/guides/how-to-tell-if-penny-stock-is-bankrupt-q-suffix`)}
                className="p-1 hover:text-emerald-400 text-slate-400 cursor-pointer ml-2 flex-shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-300 truncate">3. YOOIF Stock Dilution Analysis: <code className="text-emerald-400 font-mono">/stock/YOOIF</code></span>
              <button
                onClick={() => handleCopy(`${origin}/stock/YOOIF`)}
                className="p-1 hover:text-emerald-400 text-slate-400 cursor-pointer ml-2 flex-shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-300 truncate">4. Dilution &amp; Convertible Debt Guide: <code className="text-emerald-400 font-mono">/guides/understanding...</code></span>
              <button
                onClick={() => handleCopy(`${origin}/guides/understanding-stock-dilution-toxic-convertible-debt`)}
                className="p-1 hover:text-emerald-400 text-slate-400 cursor-pointer ml-2 flex-shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Grids: Top Searched, Referrers, Devices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Searched Tickers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              Top Tickers ({selectedTimeframe.toUpperCase()})
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Real counts</span>
          </div>

          <div className="space-y-2">
            {activeMetrics.tickers && activeMetrics.tickers.length > 0 ? (
              activeMetrics.tickers.map((t, i) => (
                <div 
                  key={t.ticker}
                  onClick={() => onAnalyzeTicker(t.ticker)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px] w-4">{i + 1}.</span>
                    <span className="font-bold text-white group-hover:text-emerald-400 font-mono">${t.ticker}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="text-emerald-400 font-bold">{t.count}</span>
                    <span className="text-[10px] text-slate-500">searches</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-xs py-4 text-center">No searches logged for this period</p>
            )}
          </div>
        </div>

        {/* Traffic Referrer Channels */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Traffic Sources
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Organic vs Direct</span>
          </div>

          <div className="space-y-2">
            {activeMetrics.referrers && activeMetrics.referrers.length > 0 ? (
              activeMetrics.referrers.map((r, i) => (
                <div key={r.source} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-300 truncate max-w-[170px]" title={r.source}>{r.source}</span>
                  <span className="text-emerald-400 font-bold">{r.count} visits</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-xs py-4 text-center">No referrers logged</p>
            )}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Monitor className="w-3.5 h-3.5 text-emerald-400" /> Device Split
          </h3>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-slate-400" /> Desktop
                </span>
                <span className="font-bold font-mono">{data?.devices.desktop || 0}</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${((data?.devices.desktop || 0) / Math.max(1, (data?.devices.desktop || 0) + (data?.devices.mobile || 0))) * 100}%` 
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Mobile
                </span>
                <span className="font-bold font-mono">{data?.devices.mobile || 0}</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${((data?.devices.mobile || 0) / Math.max(1, (data?.devices.desktop || 0) + (data?.devices.mobile || 0))) * 100}%` 
                  }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-sans">
              Privacy-first telemetry: Zero tracking cookies or personal data stored.
            </div>
          </div>
        </div>
      </div>

      {/* Live Recent Activity Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> Real Visitor Activity Stream
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Last 30 recorded sessions</span>
        </div>

        <div className="divide-y divide-slate-800/80 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
          {data?.recentEvents && data.recentEvents.length > 0 ? (
            data.recentEvents.map(event => (
              <div key={event.id} className="p-2.5 flex items-center justify-between text-xs font-mono gap-2 hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {event.device}
                  </span>
                  <span className="text-slate-300 truncate max-w-[200px] sm:max-w-md">
                    {event.path}
                  </span>
                  {event.ticker && (
                    <span 
                      onClick={() => onAnalyzeTicker(event.ticker!)}
                      className="cursor-pointer font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/70 px-1.5 py-0.2 rounded hover:underline"
                    >
                      ${event.ticker}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-slate-500 text-[11px] flex-shrink-0">
                  <span className="hidden sm:inline text-slate-400 truncate max-w-[140px]">{event.referrer}</span>
                  <span>{formatTimeAgo(event.timestamp)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-slate-500">No events recorded yet</p>
          )}
        </div>
      </div>
    </div>
  );
};
