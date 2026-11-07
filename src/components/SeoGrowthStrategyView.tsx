import React from 'react';
import { 
  Rocket, 
  Target, 
  Search, 
  Globe, 
  Share2, 
  CheckCircle2, 
  MessageSquare, 
  FileText, 
  ExternalLink,
  Flame,
  Zap,
  TrendingUp
} from 'lucide-react';

export const SeoGrowthStrategyView: React.FC = () => {
  return (
    <div className="space-y-6 font-mono text-xs max-w-4xl mx-auto">
      {/* Blueprint Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 shadow-xl space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-600/70 flex items-center justify-center text-emerald-400">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono">
              HOW TO GET 10–50+ DAILY ORGANIC VISITORS (SUBDOMAIN BLUEPRINT)
            </h2>
            <p className="text-slate-400 text-xs font-sans mt-0.5">
              Actionable, zero-cost blueprint to rank long-tail queries and attract organic penny stock traders.
            </p>
          </div>
        </div>
      </div>

      {/* 5-Step Action Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Target Zero-Competition Keywords */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Target className="w-4 h-4" /> 1. Target Long-Tail Zero-Competition Keywords
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            Large sites like Investopedia and Forbes rank for broad terms like "penny stocks". But they do NOT have dedicated pages for specific niche queries like:
          </p>
          <ul className="space-y-1.5 text-slate-400 text-[11px] bg-slate-950 p-3 rounded-lg border border-slate-800">
            <li>• <strong className="text-white">"Is [Ticker] bankrupt Chapter 11?"</strong> (e.g. BBBYQ, SHLDQ)</li>
            <li>• <strong className="text-white">"What does Q mean at end of penny stock?"</strong></li>
            <li>• <strong className="text-white">"[Ticker] dilution risk &amp; convertible debt"</strong></li>
            <li>• <strong className="text-white">"How to verify OTC transfer agent report"</strong></li>
          </ul>
          <p className="text-emerald-400 text-[11px]">
            ✓ Our Guides section and live ticker analyzer are custom-tailored to answer these exact queries.
          </p>
        </div>

        {/* Step 2: Google Search Console Setup */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Search className="w-4 h-4" /> 2. Submit Your Sitemap to Google
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            Subdomains rank perfectly well in Google once indexed. Google treats subdomains as unique web properties.
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 text-[11px]">
            <div>1. Go to <span className="text-emerald-400 font-bold">search.google.com/search-console</span></div>
            <div>2. Add your property URL: <code className="text-slate-300 text-[10px] bg-slate-900 px-1 py-0.5 rounded">https://ais-pre-...run.app</code></div>
            <div>3. Submit the auto-generated sitemap: <code className="text-emerald-300 text-[10px]">/sitemap.xml</code></div>
            <div className="text-slate-500 text-[10px] mt-1">Google will crawl your pages and guides within 48–72 hours.</div>
          </div>
        </div>

        {/* Step 3: Reddit Organic Community Answers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" /> 3. Reddit r/pennystocks Answers (15-30 Visitors/Day)
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            Subreddits like <strong className="text-white">r/pennystocks</strong>, <strong className="text-white">r/OTCstocks</strong>, and <strong className="text-white">r/Shortsqueeze</strong> have daily questions: <em>"Why did this stock crash?"</em> or <em>"Is this stock diluted?"</em>.
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <span className="text-emerald-400 font-bold block">The High-Conversion Strategy:</span>
            <p className="text-slate-400">
              Provide a genuinely helpful 2-sentence breakdown of the ticker's bankruptcy or dilution risk, then link: <em>"You can check the live bankruptcy and dilution risk on Penny Stock Analyser here: [link]"</em>.
            </p>
          </div>
        </div>

        {/* Step 4: X / Twitter Cashtag Radar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" /> 4. Twitter / X Cashtag Alerts ($Ticker)
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            Whenever an OTC stock runs 50%–100% in a single day, thousands of traders search its cashtag (e.g. <strong className="text-white">$AITX</strong>, <strong className="text-white">$FNMA</strong>, <strong className="text-white">$YOOIF</strong>).
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p>
              Post a screenshot of the dilution &amp; bankruptcy card with the ticker cashtag:
            </p>
            <p className="text-slate-200 font-sans italic">
              "Quick diligence check on $TICKER: Bankruptcy status is Active, but dilution risk is HIGH due to sub-penny noteholder conversions. Live report: [link]"
            </p>
          </div>
        </div>
      </div>

      {/* Target Milestone Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-emerald-400" /> Daily Traffic Milestone Breakdown (Goal: 10 Visitors/Day)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px]">1. Google Long-Tail Guides</span>
            <div className="text-lg font-bold text-emerald-400">4 – 8 visits/day</div>
            <p className="text-slate-400 text-[11px] font-sans">
              From traders searching Q-suffix meanings, convertible debt guides, and ticker analyses.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px]">2. Reddit &amp; Forum Answers</span>
            <div className="text-lg font-bold text-emerald-400">5 – 12 visits/day</div>
            <p className="text-slate-400 text-[11px] font-sans">
              1 or 2 helpful diligence comments per week in r/pennystocks threads.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px]">3. Twitter/X Cashtags</span>
            <div className="text-lg font-bold text-emerald-400">3 – 10 visits/day</div>
            <p className="text-slate-400 text-[11px] font-sans">
              Organic clicks from traders researching runner tickers.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-sans">
          <strong>Summary:</strong> By combining the 5 SEO blog guides, Schema.org metadata, and 1–2 weekly community comments, hitting 10–25 daily new organic visitors is completely achievable on a subdomain.
        </div>
      </div>
    </div>
  );
};
