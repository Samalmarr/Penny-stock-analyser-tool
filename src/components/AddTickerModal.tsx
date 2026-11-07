import React, { useState, useEffect } from 'react';
import { PinkStock, OtcTier, OperatingStatus } from '../types';
import { 
  X, 
  Plus, 
  Search, 
  Server, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Loader2,
  Globe,
  DollarSign,
  Building,
  Check
} from 'lucide-react';

interface AddTickerModalProps {
  onAddStock: (stock: PinkStock) => void;
  onClose: () => void;
  existingTickers: string[];
  initialTicker?: string;
}

// Helper to extract ticker symbol from either raw ticker or Yahoo Finance URL
function parseSymbolFromInput(input: string): string {
  if (!input) return '';
  let str = input.trim();
  const urlMatch = str.match(/\/quote\/([A-Za-z0-9._-]+)/i);
  if (urlMatch) {
    return urlMatch[1].toUpperCase();
  }
  if (str.includes('/quote/')) {
    const parts = str.split('/quote/');
    if (parts[1]) {
      return parts[1].split('/')[0].split('?')[0].toUpperCase();
    }
  }
  return str.replace(/[^A-Za-z0-9._-]/g, '').toUpperCase();
}

export const AddTickerModal: React.FC<AddTickerModalProps> = ({ 
  onAddStock, 
  onClose, 
  existingTickers,
  initialTicker = ''
}) => {
  const [tickerInput, setTickerInput] = useState(initialTicker);
  const [selectedTier, setSelectedTier] = useState<OtcTier>('Pink Current');
  const [selectedStatus, setSelectedStatus] = useState<OperatingStatus>('Still Operating');
  const [companyName, setCompanyName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [probingAutoData, setProbingAutoData] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cleanSymbol = parseSymbolFromInput(tickerInput);
  const isYahooUrl = tickerInput.includes('yahoo.com/quote/') || tickerInput.includes('/quote/');

  // Preset suggestions (authentic OTC & Canadian interlisted stocks)
  const popularSuggestions = [
    { ticker: 'YOOIF', name: 'YANGAROO Inc. (TSX-V: YOO.V)', tier: 'Pink Current', status: 'Still Operating' },
    { ticker: 'POETF', name: 'POET Technologies Inc.', tier: 'OTCQX', status: 'Still Operating' },
    { ticker: 'WELLF', name: 'WELL Health Technologies', tier: 'OTCQX', status: 'Still Operating' },
    { ticker: 'AITX', name: 'Artificial Intelligence Tech', tier: 'Pink Current', status: 'Still Operating' },
    { ticker: 'VNUE', name: 'VNUE Inc.', tier: 'Pink Current', status: 'Still Operating' },
    { ticker: 'PRTYQ', name: 'Party City Holdco', tier: 'Pink No Information', status: 'Bankrupt' },
    { ticker: 'TGGI', name: 'Trans Global Group', tier: 'Pink Current', status: 'Shell Company' },
  ];

  // Auto-detect when ticker or Yahoo Finance URL changes
  useEffect(() => {
    if (!cleanSymbol) return;

    if (cleanSymbol.endsWith('Q')) {
      setSelectedStatus('Bankrupt');
      setSelectedTier('Pink No Information');
    }

    if (cleanSymbol === 'YOOIF' || cleanSymbol === 'YOO.V') {
      setSelectedTier('Pink Current');
      setSelectedStatus('Still Operating');
      setCompanyName('YANGAROO Inc.');
      setWebsiteUrl('https://yangaroo.com');
      setCustomPrice(cleanSymbol === 'YOO.V' ? '0.09' : '0.021');
    } else if (cleanSymbol === 'POETF') {
      setSelectedTier('OTCQX');
      setSelectedStatus('Still Operating');
      setCompanyName('POET Technologies Inc.');
      setWebsiteUrl('https://poet-technologies.com');
      setCustomPrice('3.45');
    } else if (cleanSymbol === 'WELLF') {
      setSelectedTier('OTCQX');
      setSelectedStatus('Still Operating');
      setCompanyName('WELL Health Technologies Corp.');
      setWebsiteUrl('https://well.company');
      setCustomPrice('3.20');
    } else if (cleanSymbol === 'AITX') {
      setSelectedTier('Pink Current');
      setSelectedStatus('Still Operating');
      setCompanyName('Artificial Intelligence Technology Solutions');
      setWebsiteUrl('https://aitx.ai');
      setCustomPrice('0.0028');
    } else if (cleanSymbol === 'VNUE') {
      setSelectedTier('Pink Current');
      setSelectedStatus('Still Operating');
      setCompanyName('VNUE, Inc.');
      setWebsiteUrl('https://vnue.com');
      setCustomPrice('0.0004');
    }
  }, [cleanSymbol]);

  // If a full Yahoo Finance URL is pasted, auto-trigger live quote probe
  useEffect(() => {
    if (isYahooUrl && cleanSymbol && !probingAutoData) {
      handleAutoDetectFromApi();
    }
  }, [isYahooUrl, cleanSymbol]);

  const handleAutoDetectFromApi = async () => {
    if (!cleanSymbol) return;
    setProbingAutoData(true);
    setStatusMessage(`Scanning Yahoo Finance & OTC databases for ${cleanSymbol}...`);
    setError(null);

    try {
      // 1. Try real live Yahoo Finance quote first
      const yahooRes = await fetch(`/api/yahoo/quote?symbol=${encodeURIComponent(cleanSymbol)}`);
      if (yahooRes.ok) {
        const yahooData = await yahooRes.json();
        if (yahooData.success && yahooData.quote) {
          const q = yahooData.quote;
          if (q.longName) setCompanyName(q.longName);
          if (q.price) setCustomPrice(String(q.price));
          if (q.exchangeName === 'PNK') setSelectedTier('Pink Current');
          
          if (cleanSymbol === 'YOOIF' || cleanSymbol === 'YOO.V') {
            setCompanyName('YANGAROO Inc.');
            setWebsiteUrl('https://yangaroo.com');
          }
          setStatusMessage(`Live Yahoo Finance Data loaded for ${q.symbol} ($${q.price})`);
          setProbingAutoData(false);
          return;
        }
      }

      // 2. Fallback to discover-ticker endpoint
      const res = await fetch('/api/otc/discover-ticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ticker: cleanSymbol,
          preferredTier: selectedTier,
          preferredStatus: selectedStatus
        })
      });
      const data = await res.json();
      if (data.success && data.stock) {
        setCompanyName(data.stock.name);
        setWebsiteUrl(data.stock.website);
        setCustomPrice(String(data.stock.price));
        setSelectedTier(data.stock.tier);
        setSelectedStatus(data.stock.operatingStatus);
        setStatusMessage(`Auto-detected: ${data.stock.name} (${data.stock.tier})`);
      }
    } catch {
      setStatusMessage('Auto-detect complete with local defaults.');
    } finally {
      setProbingAutoData(false);
    }
  };

  const handleScanAndAdd = async () => {
    if (!cleanSymbol) {
      setError('Please enter a ticker symbol.');
      return;
    }

    if (existingTickers.includes(cleanSymbol)) {
      setError(`${cleanSymbol} is already in your active screener table.`);
      return;
    }

    setError(null);
    setLoading(true);
    setStatusMessage(`Scanning & configuring ${cleanSymbol} on ${selectedTier}...`);

    try {
      const res = await fetch('/api/otc/discover-ticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ticker: cleanSymbol,
          preferredTier: selectedTier,
          preferredStatus: selectedStatus,
          customName: companyName.trim() || undefined,
          customWebsite: websiteUrl.trim() || undefined,
          customPrice: customPrice ? parseFloat(customPrice) : undefined
        })
      });

      const data = await res.json();
      if (data.success && data.stock) {
        // Enforce user's explicit tier and status choice
        const finalStock: PinkStock = {
          ...data.stock,
          tier: selectedTier,
          operatingStatus: selectedStatus,
          name: companyName.trim() || data.stock.name,
          website: websiteUrl.trim() || data.stock.website,
          price: customPrice ? parseFloat(customPrice) : data.stock.price
        };

        onAddStock(finalStock);
        setStatusMessage(`Successfully added ${cleanSymbol} on ${selectedTier}!`);
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setError('Failed to scan ticker. Please try again.');
      }
    } catch (err: any) {
      setError('Connection error while adding ticker.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-xl shadow-2xl p-5 text-slate-100 font-sans"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-600 flex items-center justify-center text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Add &amp; Configure OTC / Pink Ticker</h3>
              <p className="text-xs text-slate-400">Choose Pink vs OTC tiers, operating status, and corporate details.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); handleScanAndAdd(); }} className="mt-4 space-y-4">
          {/* Ticker Input & Auto-Detect Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-slate-300 font-bold block">
                TICKER SYMBOL OR YAHOO FINANCE URL
              </label>
              {cleanSymbol && (
                <button
                  type="button"
                  onClick={handleAutoDetectFromApi}
                  disabled={probingAutoData}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {probingAutoData ? 'Probing...' : 'Auto-Fetch Yahoo & OTC Data'}
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tickerInput}
                onChange={e => setTickerInput(e.target.value)}
                placeholder="e.g. YOOIF or https://finance.yahoo.com/quote/YOOIF (supports Canadian YOO.V)"
                disabled={loading}
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Yahoo URL indicator badge */}
            {isYahooUrl && cleanSymbol && (
              <div className="mt-1.5 flex items-center justify-between bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded text-[11px] text-emerald-300 font-mono">
                <span>🌐 Yahoo Finance URL detected: Extracted <strong>{cleanSymbol}</strong></span>
                <span className="text-[10px] text-emerald-400 font-bold">Auto-Resolving Live</span>
              </div>
            )}
          </div>

          {/* Quick Select Candidates */}
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              {popularSuggestions.map(item => (
                <button
                  key={item.ticker}
                  type="button"
                  onClick={() => {
                    setTickerInput(item.ticker);
                    setSelectedTier(item.tier as OtcTier);
                    setSelectedStatus(item.status as OperatingStatus);
                    setCompanyName(item.name);
                  }}
                  className={`px-2 py-1 rounded border text-[11px] transition-colors ${
                    cleanSymbol === item.ticker
                      ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {item.ticker} <span className="text-[9px] text-slate-500">({item.tier})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Card: Tier, Status, Company Details */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-3 text-xs">
            <div className="text-xs font-bold text-slate-200 border-b border-slate-800/80 pb-2 flex items-center justify-between">
              <span>TIER &amp; STATUS OPTIONS</span>
              <span className="text-[10px] font-mono text-emerald-400 font-normal">
                Configuring: {cleanSymbol || 'TICKER'}
              </span>
            </div>

            {/* Market Tier Selector & Quick Pills */}
            <div>
              <label className="text-slate-400 font-mono text-[11px] block mb-1">
                MARKET TIER (SELECT PINK VS OTC)
              </label>

              {/* 1-Click Quick Pills */}
              <div className="flex flex-wrap gap-1 mb-2">
                {(['Pink Current', 'Pink Limited', 'Pink No Information', 'OTCQB', 'OTCQX'] as OtcTier[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTier(t)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                      selectedTier === t
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Tier Dropdown */}
              <select
                value={selectedTier}
                onChange={e => setSelectedTier(e.target.value as OtcTier)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="Pink Current">Pink Current Information (OTC Pink Standard)</option>
                <option value="Pink Limited">Pink Limited Information (Limited Disclosures)</option>
                <option value="Pink No Information">Pink No Information (Dark / Delinquent)</option>
                <option value="OTCQB">OTCQB Venture Market</option>
                <option value="OTCQX">OTCQX Best Market</option>
                <option value="Grey Market">Grey Market (Unsolicited)</option>
                <option value="Expert Market">Expert Market (Broker-Dealer Quote Only)</option>
              </select>
            </div>

            {/* Operating Status Dropdown */}
            <div>
              <label className="text-slate-400 font-mono text-[11px] block mb-1">
                OPERATING STATUS
              </label>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value as OperatingStatus)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="Still Operating">Still Operating (Active Commercial Operations)</option>
                <option value="Bankrupt">Bankrupt / Chapter 11 Liquidation (Q-Stocks)</option>
                <option value="Shell Company">Shell Company / Custodianship Candidate</option>
                <option value="Defunct / Zombie">Defunct / Zombie / Abandoned Shell</option>
                <option value="Dormant">Dormant (No Active Operations)</option>
              </select>
            </div>

            {/* Company Name & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <label className="text-slate-400 font-mono text-[10px] block mb-1">COMPANY NAME</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Yooma Wellness Inc."
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono text-[10px] block mb-1">PRICE ($)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={customPrice}
                  onChange={e => setCustomPrice(e.target.value)}
                  placeholder="0.0012"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Corporate Website */}
            <div>
              <label className="text-slate-400 font-mono text-[10px] block mb-1">
                CORPORATE WEBSITE (FOR LIVE PING CHECK)
              </label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                  placeholder="https://yooma.ca"
                  className="w-full bg-slate-900 border border-slate-800 rounded pl-8 pr-2.5 py-1 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Status Message / Error */}
          {statusMessage && (
            <div className="p-2.5 rounded bg-slate-950 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 font-mono">
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />}
              <span>{statusMessage}</span>
            </div>
          )}

          {error && (
            <div className="p-2.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <span className="text-xs text-slate-400 font-mono">
              Tier: <strong className="text-emerald-400">{selectedTier}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !cleanSymbol}
                className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold font-mono transition-colors shadow-lg shadow-emerald-950"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Scanning &amp; Ingesting...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add {cleanSymbol || 'Ticker'} on {selectedTier.split(' ')[0]}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
