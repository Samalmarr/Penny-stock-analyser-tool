import React, { useState } from 'react';
import { BLOG_POSTS, BLOG_PUBLISH_SCHEDULE, BlogPost } from '../data/blogPosts';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search,
  Share2,
  Check,
  Tag,
  Rss,
  Sparkles,
  CalendarDays
} from 'lucide-react';
import { copyToClipboard } from '../utils/formatters';

interface GuidesViewProps {
  onAnalyzeTicker: (ticker: string) => void;
}

export const GuidesView: React.FC<GuidesViewProps> = ({ onAnalyzeTicker }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showRssInfo, setShowRssInfo] = useState(false);

  const categories = ['ALL', 'Bankruptcy', 'Dilution', 'Due Diligence', 'Ticker Deep Dive', 'Corporate Actions'];

  const filteredPosts = BLOG_POSTS.filter(post => {
    if (categoryFilter !== 'ALL' && post.category !== categoryFilter) return false;
    return true;
  });

  const handleShareArticle = async (post: BlogPost) => {
    const url = `${window.location.origin}/guides/${post.slug}`;
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Article Detail View */}
      {selectedPost ? (
        <article className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-8 shadow-xl space-y-6 max-w-4xl mx-auto">
          {/* JSON-LD Schema.org Structured Data for this Blog Post */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                'headline': selectedPost.title,
                'description': selectedPost.description,
                'datePublished': selectedPost.date,
                'dateModified': selectedPost.date,
                'author': {
                  '@type': 'Organization',
                  'name': 'Penny Stock Analyser'
                },
                'publisher': {
                  '@type': 'Organization',
                  'name': 'Penny Stock Analyser'
                },
                'keywords': selectedPost.targetKeywords.join(', ')
              })
            }}
          />

          {/* Back Navigation & Meta */}
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800 text-xs font-mono">
            <button
              onClick={() => setSelectedPost(null)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              ← Back to Weekly Blog
            </button>

            <div className="flex items-center gap-3 text-slate-400">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                Week {selectedPost.weekNumber}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {selectedPost.readTime}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {selectedPost.date}
              </span>
            </div>
          </div>

          {/* Title & Category Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-mono font-semibold">
                {selectedPost.category}
              </span>
              {selectedPost.featuredTicker && (
                <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  Ticker Focus: ${selectedPost.featuredTicker}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-3xl font-bold text-white font-mono tracking-tight leading-snug">
              {selectedPost.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              {selectedPost.description}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleShareArticle(selectedPost)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Guide'}</span>
              </button>

              {selectedPost.featuredTicker && (
                <button
                  onClick={() => onAnalyzeTicker(selectedPost.featuredTicker!)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold transition-colors shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Analyze ${selectedPost.featuredTicker} Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Key Takeaways Box (SEO Rich Snippet target) */}
          <div className="p-4 sm:p-5 rounded-xl bg-emerald-950/40 border border-emerald-700/60 font-mono text-xs space-y-2.5">
            <h3 className="font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Diligence Takeaways
            </h3>
            <ul className="space-y-1.5 text-slate-200 leading-relaxed font-sans text-xs sm:text-sm">
              {selectedPost.content.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Article Sections */}
          <div className="space-y-6 pt-2">
            {selectedPost.content.sections.map((section, idx) => (
              <section key={idx} className="space-y-2.5">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-mono">
                  {section.heading}
                </h2>
                <div className="space-y-2 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {section.body.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* FAQ Accordion Section (Schema.org FAQPage Aligned) */}
          {selectedPost.content.faqs && selectedPost.content.faqs.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h3 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-400" /> Frequently Asked Questions
              </h3>

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-950 overflow-hidden text-xs">
                {selectedPost.content.faqs.map((faq, fIdx) => (
                  <div key={fIdx} className="p-3.5">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === fIdx ? null : fIdx)}
                      className="w-full text-left font-bold text-white flex items-center justify-between gap-2"
                    >
                      <span>{faq.question}</span>
                      {expandedFaq === fIdx ? (
                        <ChevronUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === fIdx && (
                      <p className="mt-2 text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center gap-2 flex-wrap font-mono text-[11px] text-slate-400">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <span>Search Keywords:</span>
            {selectedPost.targetKeywords.map(kw => (
              <span key={kw} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                {kw}
              </span>
            ))}
          </div>
        </article>
      ) : (
        /* Blog Catalog List */
        <div className="space-y-5">
          {/* Schedule Banner: 1 New Post Every Week */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-600/70 flex items-center justify-center text-emerald-400">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                    WEEKLY PENNY STOCK DILIGENCE BLOG
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/80 text-emerald-300 font-bold uppercase tracking-wider">
                      1 New Post / Week
                    </span>
                  </h2>
                  <p className="text-slate-400 text-xs font-sans mt-0.5">
                    Published every Friday. In-depth forensic analyses targeting high-intent retail trader searches.
                  </p>
                </div>
              </div>

              {/* RSS Feed Link & Helper */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <a
                  href="/rss.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 font-mono text-xs transition-colors"
                  title="View Styled RSS 2.0 Feed"
                >
                  <Rss className="w-3.5 h-3.5 text-amber-400" />
                  <span>RSS Feed</span>
                </a>
                <button
                  onClick={() => setShowRssInfo(!showRssInfo)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 underline font-mono cursor-pointer"
                  title="Learn what RSS is"
                >
                  {showRssInfo ? 'Hide Info' : 'What is RSS?'}
                </button>
              </div>
            </div>

            {/* Simple RSS Explanation Card */}
            {showRssInfo && (
              <div className="p-3 rounded-lg bg-slate-950 border border-amber-600/40 text-xs font-sans text-slate-300 space-y-1">
                <strong className="text-amber-300 font-mono flex items-center gap-1.5 text-xs">
                  <Rss className="w-3.5 h-3.5" /> What is an RSS Feed?
                </strong>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  <strong>RSS</strong> stands for <em>Really Simple Syndication</em>. It acts like an automated broadcaster: whenever we publish a new penny stock guide on Friday, this feed immediately notifies Google, Bing, and RSS feed readers so your new articles get discovered and indexed automatically—without you needing to do anything manually! Clicking the orange RSS button opens a styled, human-friendly reader page.
                </p>
              </div>
            )}

            {/* Upcoming Weekly Drop Teaser */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-400 font-semibold">NEXT WEEKLY DROP ({BLOG_PUBLISH_SCHEDULE.nextDropDate}):</span>
                <span className="text-slate-200 font-bold">{BLOG_PUBLISH_SCHEDULE.nextDropTopic}</span>
              </div>
              <span className="text-[11px] text-emerald-400">Week 46 Scheduled</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 font-mono text-xs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap text-xs ${
                    categoryFilter === cat
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat === 'ALL' ? 'All Weekly Posts' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPosts.map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className={`bg-slate-900 border rounded-xl p-5 shadow-lg flex flex-col justify-between cursor-pointer group transition-all ${
                  post.status === 'scheduled'
                    ? 'border-dashed border-slate-700/80 bg-slate-900/60'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60">
                        Week {post.weekNumber}
                      </span>
                      <span className="text-slate-400">{post.category}</span>
                    </div>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-500" /> {post.date}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors font-mono leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-400 font-sans line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs">
                  {post.featuredTicker ? (
                    <span className="text-slate-400 text-[11px]">
                      Case Study: <strong className="text-white">${post.featuredTicker}</strong>
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px]">{post.readTime}</span>
                  )}

                  <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-xs">
                    {post.status === 'scheduled' ? 'Preview Teaser' : 'Read Full Post'} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
