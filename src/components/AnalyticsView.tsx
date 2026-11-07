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
  Activity
} from 'lucide-react';

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
}

interface AnalyticsViewProps {
  onAnalyzeTicker: (ticker: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onAnalyzeTicker }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

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

  const formatTimeAgo = (isoString: string) => {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-mono">SITE TRAFFIC &amp; VISITOR ANALYTICS</h2>
          </div>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Real-time tracking of page visits, unique visitors, searched tickers, and organic traffic sources.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-mono text-xs transition-colors self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh Stats</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>TODAY'S VISITORS</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {data ? data.todayUniques : '—'}
          </div>
          <span className="text-[10px] text-emerald-400">Unique visitors today</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>TODAY'S VIEWS</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {data ? data.todayViews : '—'}
          </div>
          <span className="text-[10px] text-slate-400">Total requests logged</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>ALL-TIME UNIQUES</span>
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {data ? data.uniqueVisitors : '—'}
          </div>
          <span className="text-[10px] text-slate-400">Distinct browser sessions</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>TOTAL PAGEVIEWS</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {data ? data.totalViews : '—'}
          </div>
          <span className="text-[10px] text-slate-400">All recorded interactions</span>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Searched Tickers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-emerald-400" /> Top Searched Tickers
          </h3>

          <div className="space-y-2">
            {data?.topTickers && data.topTickers.length > 0 ? (
              data.topTickers.map((t, i) => (
                <div 
                  key={t.ticker}
                  onClick={() => onAnalyzeTicker(t.ticker)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px] w-4">{i + 1}.</span>
                    <span className="font-bold text-white group-hover:text-emerald-400 font-mono">{t.ticker}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span>{t.count} searches</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-xs py-4 text-center">No searches logged yet</p>
            )}
          </div>
        </div>

        {/* Traffic Referrer Channels */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-emerald-400" /> Traffic Sources
          </h3>

          <div className="space-y-2">
            {data?.topReferrers && data.topReferrers.length > 0 ? (
              data.topReferrers.map((r, i) => (
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
                <span className="font-bold">{data?.devices.desktop || 0}</span>
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
                <span className="font-bold">{data?.devices.mobile || 0}</span>
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
              Privacy-friendly: no tracking cookies or personal data stored.
            </div>
          </div>
        </div>
      </div>

      {/* Live Recent Activity Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5 uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-emerald-400" /> Live Visitor Activity Stream
        </h3>

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
                  <span className="hidden sm:inline text-slate-400 truncate max-w-[120px]">{event.referrer}</span>
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
