export type OtcTier = 
  | 'OTCQX' 
  | 'OTCQB' 
  | 'Pink Current' 
  | 'Pink Limited' 
  | 'Pink No Information' 
  | 'Grey Market' 
  | 'Expert Market';

export type OperatingStatus = 
  | 'Still Operating' 
  | 'Bankrupt' 
  | 'Defunct / Zombie' 
  | 'Shell Company' 
  | 'Dormant';

export type WebsiteHealthStatus = 
  | 'Active & Verified' 
  | 'Dead / 404' 
  | 'Parked / Domain For Sale' 
  | 'Timed Out' 
  | 'No Website';

export interface RedFlagItem {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'Dilution' | 'Regulatory' | 'Governance' | 'Bankruptcy' | 'Operational' | 'Audit';
  description: string;
}

export interface ManagementProfile {
  ceo: string;
  cfo?: string;
  founder?: string;
  keyOfficers?: string[];
  boardMembers?: string[];
  pastAffiliations?: string;
  insiderOwnershipPct: number;
  trackRecordWarning?: string;
  stateOfIncorporation: string;
  registeredAgent?: string;
}

export interface ShareStructure {
  authorizedShares: number;
  outstandingShares: number;
  floatShares: number;
  restrictedShares: number;
  transferAgent: string;
  transferAgentVerified: boolean;
  sharesVerifiedDate?: string;
}

export interface FinancialsSummary {
  revenueAnnual: number;
  netIncomeAnnual: number;
  cashAndEquivalents: number;
  totalDebt: number;
  operatingCashFlow: number;
  monthlyBurnRate: number;
  cashRunwayMonths: string;
  hasGoingConcernOpinion: boolean;
  fiscalYear: string;
}

export interface HistoricalPricePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SecFiling {
  form: string;
  filingDate: string;
  description: string;
  url?: string;
}

export interface PinkStock {
  ticker: string;
  name: string;
  formerNames?: string[];
  cik: string;
  tier: OtcTier;
  operatingStatus: OperatingStatus;
  price: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  avgVolume30d: number;
  high52w: number;
  low52w: number;
  sector: string;
  industry: string;
  country: string;
  
  // Website verification
  website: string;
  websiteStatus: WebsiteHealthStatus;
  websiteHttpCode: number;
  websiteResponseMs: number;
  websiteLastChecked: string;

  // Red Flags
  redFlagScore: number; // 0 to 100
  redFlags: RedFlagItem[];
  hasCaveatEmptor: boolean;
  hasDtcChill: boolean;
  hasReverseSplits: boolean;
  reverseSplitHistory?: string[];

  // Leadership & Governance
  management: ManagementProfile;

  // Share Structure
  shareStructure: ShareStructure;

  // Financials
  financials: FinancialsSummary;

  // Official Working Links
  secEdgarUrl?: string;
  otcMarketsUrl?: string;
  yahooFinanceUrl?: string;
  googleFinanceUrl?: string;

  // Technical Chart
  chartHistory: HistoricalPricePoint[];

  // SEC / Disclosure Filings
  secFilings: SecFiling[];

  // Summary & Forensic Notes
  businessSummary: string;
  forensicNotes: string;
}

export interface FilterState {
  search: string;
  priceMin: string;
  priceMax: string;
  marketCapMin: string;
  marketCapMax: string;
  bankruptFilter: 'ALL' | 'ACTIVE_ONLY' | 'BANKRUPT_ONLY';
  operatingStatus: string; // 'ALL' or specific
  excludeBankrupt: boolean; // Backwards compatible
  tier: string; // 'ALL' or specific
  websiteStatus: string; // 'ALL' or specific
  redFlagRisk: string; // 'ALL', 'LOW', 'MODERATE', 'CRITICAL'
  hasCaveatEmptorOnly: boolean;
  profitableOnly: boolean;
  minVolume: string;
  sector: string;
}
