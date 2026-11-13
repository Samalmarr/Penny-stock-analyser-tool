import { PinkStock } from '../types';

export function formatCurrency(value: number): string {
  if (value === 0) return '$0.00';
  if (value < 0.001) return `$${value.toFixed(4)}`;
  if (value < 0.01) return `$${value.toFixed(4)}`;
  if (value < 1) return `$${value.toFixed(3)}`;
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatLargeNumber(num: number): string {
  if (num === 0) return '0';
  const absNum = Math.abs(num);
  if (absNum >= 1_000_000_000_000) {
    return `${(num / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (absNum >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (absNum >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (absNum >= 1_000) {
    return `${(num / 1_000).toFixed(1)}k`;
  }
  return num.toLocaleString();
}

export function formatMarketCap(mc: number): string {
  if (mc === 0) return '$0';
  if (mc < 0) return `-$${formatLargeNumber(Math.abs(mc))}`;
  return `$${formatLargeNumber(mc)}`;
}

export function formatSignedCurrencyCompact(val: number | null | undefined, currency = 'USD'): string {
  if (val === null || val === undefined || Number.isNaN(val)) return 'N/A';
  const prefix = currency === 'CAD' ? 'CA$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
  if (val === 0) return `${prefix}0`;
  const sign = val < 0 ? '-' : '';
  return `${sign}${prefix}${formatLargeNumber(Math.abs(val))}`;
}

export const PUBLIC_SITE_ORIGIN = 'https://pennystockanalysertool.vercel.app';

export function getPublicSiteOrigin(): string {
  if (typeof window === 'undefined') return PUBLIC_SITE_ORIGIN;
  const host = window.location.hostname;
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.run.app')
  ) {
    return PUBLIC_SITE_ORIGIN;
  }
  return window.location.origin;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall back to textarea copy inside restricted iframes
    }
  }
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    document.body.removeChild(textArea);
    return false;
  }
}

export function generateDueDiligenceMarkdown(stock: PinkStock): string {
  return `### 🔍 PINKSCAN FORENSIC DUE DILIGENCE: ${stock.ticker} (${stock.name})
- **Exchange Tier:** ${stock.tier} | **Operating Status:** ${stock.operatingStatus}
- **Price:** ${formatCurrency(stock.price)} (${stock.changePercent > 0 ? '+' : ''}${stock.changePercent}%)
- **Market Cap:** ${formatMarketCap(stock.marketCap)} | **Volume:** ${formatLargeNumber(stock.volume)}
- **CIK:** ${stock.cik || 'N/A'} | **State:** ${stock.management.stateOfIncorporation}

#### 🌐 Corporate Website Health:
- **URL:** ${stock.website}
- **Status:** ${stock.websiteStatus} (HTTP Code: ${stock.websiteHttpCode})
- **Last Verified:** ${stock.websiteLastChecked}

#### ⚠️ Forensic Risk Score: ${stock.redFlagScore}/100
- **Caveat Emptor:** ${stock.hasCaveatEmptor ? '🚨 YES (CE Active)' : 'No'}
- **DTC Chill:** ${stock.hasDtcChill ? '🚨 YES (DTC Chill Active)' : 'No'}
- **Reverse Split History:** ${stock.hasReverseSplits ? stock.reverseSplitHistory?.join(', ') || 'Yes' : 'None'}
- **Key Warnings:**
${stock.redFlags.length > 0 ? stock.redFlags.map(rf => `  * [${rf.severity.toUpperCase()}] ${rf.title}: ${rf.description}`).join('\n') : '  * No major critical flags detected.'}

#### 👥 Management & Insiders:
- **CEO / Executive:** ${stock.management.ceo}
- **Insider Ownership:** ${stock.management.insiderOwnershipPct}%
- **Transfer Agent:** ${stock.shareStructure.transferAgent} (Verified: ${stock.shareStructure.transferAgentVerified ? 'YES' : 'NO'})
${stock.management.trackRecordWarning ? `- **Insider Warning:** ${stock.management.trackRecordWarning}` : ''}

#### 📊 Share Structure:
- **Authorized Shares:** ${formatLargeNumber(stock.shareStructure.authorizedShares)}
- **Outstanding Shares:** ${formatLargeNumber(stock.shareStructure.outstandingShares)}
- **Estimated Float:** ${formatLargeNumber(stock.shareStructure.floatShares)}

#### 💰 Financials & Runway:
- **Annual Revenue:** ${formatLargeNumber(stock.financials.revenueAnnual)}
- **Net Income:** ${formatLargeNumber(stock.financials.netIncomeAnnual)}
- **Cash & Equivalents:** ${formatLargeNumber(stock.financials.cashAndEquivalents)}
- **Total Debt:** ${formatLargeNumber(stock.financials.totalDebt)}
- **Estimated Runway:** ${stock.financials.cashRunwayMonths}
- **Going Concern Opinion:** ${stock.financials.hasGoingConcernOpinion ? 'YES (Auditor going concern warning)' : 'No'}

*Report generated by PinkScan OTC Forensic Screener.*
`;
}
