import { PinkStock } from '../types';

export function formatTickersList(stocks: PinkStock[], format: 'comma' | 'space' | 'newline' | 'tradingview' | 'thinkorswim'): string {
  if (stocks.length === 0) return '';
  const tickers = stocks.map(s => s.ticker);

  switch (format) {
    case 'comma':
      return tickers.join(', ');
    case 'space':
      return tickers.join(' ');
    case 'newline':
      return tickers.join('\n');
    case 'tradingview':
      return tickers.map(t => `OTC:${t}`).join(', ');
    case 'thinkorswim':
      return tickers.join(';');
    default:
      return tickers.join(', ');
  }
}

export function exportToCSV(stocks: PinkStock[], filename = 'pinkscan_otc_stocks.csv'): void {
  const headers = [
    'Ticker',
    'Official Company Name',
    'SEC CIK',
    'Tier',
    'Operating Status',
    'Price',
    'Change %',
    'Market Cap',
    'Volume',
    '52W Low',
    '52W High',
    'SEC EDGAR URL',
    'OTC Markets URL',
    'Yahoo Finance URL',
    'Corporate Website'
  ];

  const rows = stocks.map(s => [
    `"${s.ticker}"`,
    `"${s.name.replace(/"/g, '""')}"`,
    `"${s.cik}"`,
    `"${s.tier}"`,
    `"${s.operatingStatus}"`,
    s.price,
    s.changePercent,
    s.marketCap,
    s.volume,
    s.low52w,
    s.high52w,
    `"${s.secEdgarUrl || `https://www.sec.gov/edgar/browse/?CIK=${s.cik}`}"`,
    `"${s.otcMarketsUrl || `https://www.otcmarkets.com/stock/${s.ticker}/overview`}"`,
    `"${s.yahooFinanceUrl || `https://finance.yahoo.com/quote/${s.ticker}`}"`,
    `"${s.website || ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(stocks: PinkStock[], filename = 'pinkscan_otc_data.json'): void {
  const jsonContent = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stocks, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', jsonContent);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
