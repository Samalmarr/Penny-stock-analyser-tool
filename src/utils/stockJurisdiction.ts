/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StockJurisdictionInfo {
  country: string;
  countryFlag: string;
  primaryExchange: string;
  listingType: 'US_DOMESTIC_OTC' | 'CANADIAN_DUAL_LISTED' | 'FOREIGN_ADR' | 'US_EXCHANGE_LISTED' | 'BANKRUPTCY_OTC';
  filingJurisdiction: 'SEC_EDGAR' | 'SEDAR_PLUS' | 'FOREIGN_DISCLOSURE';
  filingAuthorityName: string;
  regulatoryExemptionNote: string;
  homeMarketTicker?: string;
  links: {
    yahoo: string;
    otc: string;
    sec: string;
    sedar?: string;
    google: string;
    disclosure?: string;
  };
}

// Known foreign ordinary and dual-listed stock mappings
const KNOWN_FOREIGN_STOCKS: Record<string, Partial<StockJurisdictionInfo>> = {
  YOOIF: {
    country: 'Canada',
    countryFlag: '🇨🇦',
    primaryExchange: 'TSX Venture (TSX-V: YOO) · US OTC Dual-Listing',
    homeMarketTicker: 'TSX-V: YOO',
    listingType: 'CANADIAN_DUAL_LISTED',
    filingJurisdiction: 'SEDAR_PLUS',
    filingAuthorityName: 'Canadian SEDAR+ & OTC Markets Alternative Reporting',
    regulatoryExemptionNote: 'Headquartered in Toronto, Ontario. Primary regulatory filings (audited annuals, quarterlies, MD&A) are lodged on Canadian SEDAR+ (sedarplus.ca) and mirrored on OTC Markets under SEC Rule 12g3-2(b) exemption.'
  },
  POET: {
    country: 'Canada',
    countryFlag: '🇨🇦',
    primaryExchange: 'NASDAQ / TSX Venture Dual-Listing (TSX-V: PTK)',
    homeMarketTicker: 'TSX-V: PTK',
    listingType: 'CANADIAN_DUAL_LISTED',
    filingJurisdiction: 'DUAL_REPORTING' as any,
    filingAuthorityName: 'SEC EDGAR & Canadian SEDAR+',
    regulatoryExemptionNote: 'Dual-listed on NASDAQ and TSX Venture. Files dual disclosures with both US SEC EDGAR and Canadian SEDAR+.'
  },
  EEENF: {
    country: 'Australia',
    countryFlag: '🇦🇺',
    primaryExchange: 'ASX / US OTC Dual-Listing (ASX: 88E)',
    homeMarketTicker: 'ASX: 88E',
    listingType: 'CANADIAN_DUAL_LISTED',
    filingJurisdiction: 'FOREIGN_DISCLOSURE',
    filingAuthorityName: 'Australian Securities Exchange (ASX) & OTC Markets',
    regulatoryExemptionNote: 'Australian exploration entity trading as a foreign ordinary (F-suffix) in the US under Rule 12g3-2(b).'
  }
};

/**
 * Resolves country of origin, primary exchange, and regulatory filing jurisdiction
 * for any given stock symbol and exchange metadata.
 */
export function resolveStockJurisdiction(
  symbol: string,
  catalogCountry?: string,
  exchangeName?: string,
  fullExchangeName?: string
): StockJurisdictionInfo {
  const cleanSymbol = symbol.trim().toUpperCase();
  const isBankrupt = cleanSymbol.endsWith('Q');
  const isFiveLetterF = cleanSymbol.length === 5 && cleanSymbol.endsWith('F');
  const isFiveLetterY = cleanSymbol.length === 5 && cleanSymbol.endsWith('Y');

  // Check known lookup first
  if (KNOWN_FOREIGN_STOCKS[cleanSymbol]) {
    const known = KNOWN_FOREIGN_STOCKS[cleanSymbol];
    return {
      country: known.country || 'Canada',
      countryFlag: known.countryFlag || '🇨🇦',
      primaryExchange: known.primaryExchange || 'TSX Venture / US OTC Dual-Listing',
      homeMarketTicker: known.homeMarketTicker,
      listingType: known.listingType || 'CANADIAN_DUAL_LISTED',
      filingJurisdiction: known.filingJurisdiction || 'SEDAR_PLUS',
      filingAuthorityName: known.filingAuthorityName || 'Canadian SEDAR+ & OTC Markets',
      regulatoryExemptionNote: known.regulatoryExemptionNote || 'Primary disclosures are filed on SEDAR+.',
      links: {
        yahoo: `https://finance.yahoo.com/quote/${cleanSymbol}`,
        otc: `https://www.otcmarkets.com/stock/${cleanSymbol}/overview`,
        sec: `https://www.sec.gov/edgar/searchedgar/companysearch?companyName=${encodeURIComponent(cleanSymbol)}`,
        sedar: 'https://www.sedarplus.ca',
        disclosure: `https://www.otcmarkets.com/stock/${cleanSymbol}/disclosure`,
        google: `https://www.google.com/finance/quote/${cleanSymbol}:OTCMKTS`
      }
    };
  }

  // 1. Bankrupt OTC Q-suffix tickers
  if (isBankrupt) {
    return {
      country: catalogCountry || 'United States',
      countryFlag: '🇺🇸',
      primaryExchange: 'OTC Markets (Chapter 11 Bankruptcy Court)',
      listingType: 'BANKRUPTCY_OTC',
      filingJurisdiction: 'SEC_EDGAR',
      filingAuthorityName: 'US Federal Bankruptcy Court & SEC Form 8-K',
      regulatoryExemptionNote: 'Issuer is operating under Chapter 11/7 court bankruptcy protection. Reorganization filings are lodged with US Bankruptcy Courts (PACER) with monthly operating summaries via SEC Form 8-K.',
      links: {
        yahoo: `https://finance.yahoo.com/quote/${cleanSymbol}`,
        otc: `https://www.otcmarkets.com/stock/${cleanSymbol}/overview`,
        sec: `https://www.sec.gov/edgar/searchedgar/companysearch?companyName=${encodeURIComponent(cleanSymbol)}`,
        disclosure: `https://www.otcmarkets.com/stock/${cleanSymbol}/disclosure`,
        google: `https://www.google.com/finance/quote/${cleanSymbol}:OTCMKTS`
      }
    };
  }

  // 2. Canadian Dual-Listed F-Shares (or catalog specified Canada)
  if (isFiveLetterF || catalogCountry === 'Canada') {
    return {
      country: 'Canada',
      countryFlag: '🇨🇦',
      primaryExchange: 'TSX Venture / CSE · US OTC Foreign Ordinary (F-Share)',
      listingType: 'CANADIAN_DUAL_LISTED',
      filingJurisdiction: 'SEDAR_PLUS',
      filingAuthorityName: 'Canadian SEDAR+ & OTC Markets Alternative Reporting',
      regulatoryExemptionNote: 'Foreign Private Issuer (SEC Rule 12g3-2(b) Exemption): Because this company is primary-listed in Canada, its official audited annual financials, quarterly MD&As, and material filings are published on Canadian SEDAR+ (sedarplus.ca) and mirrored on OTC Markets, not US SEC EDGAR.',
      links: {
        yahoo: `https://finance.yahoo.com/quote/${cleanSymbol}`,
        otc: `https://www.otcmarkets.com/stock/${cleanSymbol}/overview`,
        sec: `https://www.sec.gov/edgar/searchedgar/companysearch?companyName=${encodeURIComponent(cleanSymbol)}`,
        sedar: 'https://www.sedarplus.ca',
        disclosure: `https://www.otcmarkets.com/stock/${cleanSymbol}/disclosure`,
        google: `https://www.google.com/finance/quote/${cleanSymbol}:OTCMKTS`
      }
    };
  }

  // 3. Foreign ADRs (5-letter tickers ending in Y)
  if (isFiveLetterY) {
    return {
      country: catalogCountry || 'International (ADR)',
      countryFlag: '🌐',
      primaryExchange: 'Foreign Ordinary / American Depositary Receipt (ADR)',
      listingType: 'FOREIGN_ADR',
      filingJurisdiction: 'FOREIGN_DISCLOSURE',
      filingAuthorityName: 'Depositary Bank & SEC Form 20-F / Rule 12g3-2(b)',
      regulatoryExemptionNote: 'American Depositary Receipt (ADR) issued against foreign ordinary shares held by a depositary bank. Primary disclosures are filed with the home international exchange and SEC Form 20-F.',
      links: {
        yahoo: `https://finance.yahoo.com/quote/${cleanSymbol}`,
        otc: `https://www.otcmarkets.com/stock/${cleanSymbol}/overview`,
        sec: `https://www.sec.gov/edgar/searchedgar/companysearch?companyName=${encodeURIComponent(cleanSymbol)}`,
        disclosure: `https://www.otcmarkets.com/stock/${cleanSymbol}/disclosure`,
        google: `https://www.google.com/finance/quote/${cleanSymbol}:OTCMKTS`
      }
    };
  }

  // 4. National Exchange Sub-$1 Penny Stocks (NASDAQ / NYSE)
  const isExchange = exchangeName?.includes('NAS') || 
                     exchangeName?.includes('NCM') || 
                     exchangeName?.includes('NYQ') || 
                     fullExchangeName?.toLowerCase().includes('nasdaq') || 
                     fullExchangeName?.toLowerCase().includes('nyse');

  if (isExchange) {
    return {
      country: 'United States',
      countryFlag: '🇺🇸',
      primaryExchange: fullExchangeName || 'NASDAQ Capital Market (Sub-$1 Micro-cap)',
      listingType: 'US_EXCHANGE_LISTED',
      filingJurisdiction: 'SEC_EDGAR',
      filingAuthorityName: 'SEC EDGAR (Forms 10-K, 10-Q, 8-K, Form 4)',
      regulatoryExemptionNote: 'National Exchange Listing. Subject to full SEC reporting and NASDAQ Rule 5810(c)(3)(A) minimum $1.00 bid price compliance notifications.',
      links: {
        yahoo: `https://finance.yahoo.com/quote/${cleanSymbol}`,
        otc: `https://www.otcmarkets.com/stock/${cleanSymbol}/overview`,
        sec: `https://www.sec.gov/edgar/searchedgar/companysearch?companyName=${encodeURIComponent(cleanSymbol)}`,
        disclosure: `https://www.otcmarkets.com/stock/${cleanSymbol}/disclosure`,
        google: `https://www.google.com/finance/quote/${cleanSymbol}:NASDAQ`
      }
    };
  }

  // 5. Default: Standard US Domestic OTC Penny Stock
  return {
    country: catalogCountry || 'United States',
    countryFlag: '🇺🇸',
    primaryExchange: fullExchangeName || exchangeName || 'OTC Markets (Pink Current / OTCQB)',
    listingType: 'US_DOMESTIC_OTC',
    filingJurisdiction: 'SEC_EDGAR',
    filingAuthorityName: 'SEC EDGAR (Forms 10-K, 10-Q, 8-K)',
    regulatoryExemptionNote: 'US Domestic Issuer subject to Section 12(g) / 15(d) of the Securities Exchange Act. Audited annual reports (Form 10-K) and quarterly reports (Form 10-Q) are filed on official SEC EDGAR.',
    links: {
      yahoo: `https://finance.yahoo.com/quote/${cleanSymbol}`,
      otc: `https://www.otcmarkets.com/stock/${cleanSymbol}/overview`,
      sec: `https://www.sec.gov/edgar/searchedgar/companysearch?companyName=${encodeURIComponent(cleanSymbol)}`,
      disclosure: `https://www.otcmarkets.com/stock/${cleanSymbol}/disclosure`,
      google: `https://www.google.com/finance/quote/${cleanSymbol}:OTCMKTS`
    }
  };
}
