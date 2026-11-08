export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  weekNumber: number;
  readTime: string;
  category: 'Bankruptcy' | 'Dilution' | 'Due Diligence' | 'Ticker Deep Dive' | 'Corporate Actions';
  targetKeywords: string[];
  featuredTicker?: string;
  status: 'published' | 'scheduled';
  content: {
    summary: string;
    keyTakeaways: string[];
    sections: {
      heading: string;
      body: string[];
    }[];
    faqs: {
      question: string;
      answer: string;
    }[];
  };
}

export const BLOG_PUBLISH_SCHEDULE = {
  cadence: '1 New Post Every Week (Every Friday)',
  currentWeek: 45,
  totalPublished: 8,
  nextDropDate: '2026-11-13',
  nextDropTopic: 'Nevada SOS Custodianship Shells & Reverse Mergers: How to Spot Scams vs Real Runners'
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'bankrupt-q-stocks-guide',
    slug: 'how-to-tell-if-penny-stock-is-bankrupt-q-suffix',
    title: 'How to Tell if a Penny Stock is Bankrupt: The Q-Suffix & Court Guide',
    description: 'Learn how to instantly spot bankrupt OTC and penny stocks using the FINRA 5-letter Q-suffix rule, Chapter 11 court filings, and SEC Form 8-K disclosures.',
    date: '2026-11-06',
    weekNumber: 45,
    readTime: '4 min read',
    category: 'Bankruptcy',
    targetKeywords: ['bankrupt penny stocks', 'q suffix stock meaning', 'otc chapter 11 warning', 'how to tell if stock is bankrupt', 'bbbyq bankruptcy cancellation'],
    featuredTicker: 'BBBYQ',
    status: 'published',
    content: {
      summary: 'Trading penny stocks without verifying bankruptcy status is one of the quickest ways retail traders suffer a 100% loss. Here is how FINRA ticker suffixes work and how to confirm bankruptcy proceedings before buying.',
      keyTakeaways: [
        'A 5th letter "Q" appended to any US OTC or NASDAQ ticker explicitly designates Chapter 11 or Chapter 7 bankruptcy court proceedings.',
        'In over 95% of public company reorganizations, pre-petition common equity is completely canceled with zero payout upon plan confirmation.',
        'Always cross-reference the ticker on SEC EDGAR for Form 8-K Item 1.03 (Bankruptcy or Receivership) and check PACER court dockets.'
      ],
      sections: [
        {
          heading: '1. The 5-Letter Ticker Rule (The "Q" Suffix)',
          body: [
            'Under FINRA and US exchange symbol conventions, OTC securities use four or five letters. When an issuer files for bankruptcy protection under Chapter 11 (reorganization) or Chapter 7 (liquidation), FINRA appends the letter "Q" as the fifth character of the ticker symbol (e.g., Bed Bath & Beyond became BBBYQ, Sears became SHLDQ, Revlon became REVEQ).',
            'If you see a 5-letter ticker ending in Q, you are not trading an active growing business—you are trading claims against a bankrupt debtor estate.'
          ]
        },
        {
          heading: '2. The "Equity Cancellation" Reality in Chapter 11',
          body: [
            'Under the US Bankruptcy Code\'s Absolute Priority Rule, creditors must be paid in full before common stockholders receive a single cent. Because bankrupt companies enter court with liabilities far exceeding their asset value, senior lenders and bondholders take ownership of the restructured new entity.',
            'The old common shares trading on the OTC are almost universally extinguished and canceled upon plan confirmation. Buying shares in a bankrupt shell hoping for a comeback usually results in your broker removing the shares with an effective value of $0.00.'
          ]
        },
        {
          heading: '3. How to Verify via SEC EDGAR & Court Records',
          body: [
            'Whenever you analyze a penny stock, search the company on SEC EDGAR (using our direct link) and check for Form 8-K filings with Item 1.03: Bankruptcy or Receivership.',
            'Review the disclosure to see if a Chapter 11 Trustee or Chief Restructuring Officer (CRO) has been appointed and whether debtor-in-possession (DIP) financing takes priority over all equity.'
          ]
        }
      ],
      faqs: [
        {
          question: 'Can a stock with a Q-suffix ever recover?',
          answer: 'Rarely (less than 1-2% of cases, such as Hertz in 2021 where used car prices surged during liquidation). In the overwhelming majority of cases, old common shares are cancelled for zero compensation.'
        },
        {
          question: 'How long does a Q-ticker trade before being deleted?',
          answer: 'Typically between 6 months and 2 years, continuing to trade on the OTC until the bankruptcy judge confirms the liquidation plan and the effective date passes.'
        }
      ]
    }
  },
  {
    id: 'otc-dilution-toxic-debt-guide',
    slug: 'understanding-stock-dilution-toxic-convertible-debt',
    title: 'Understanding Stock Dilution in OTC & Sub-Penny Stocks: Toxic Notes Explained',
    description: 'A deep dive into how toxic convertible debt and floorless promissory notes dilute penny stock shareholders and trigger endless reverse splits.',
    date: '2026-10-30',
    weekNumber: 44,
    readTime: '5 min read',
    category: 'Dilution',
    targetKeywords: ['otc stock dilution', 'toxic convertible debt penny stocks', 'convertible promissory note dilution', 'sub penny reverse split spiral', 'aitx share dilution'],
    featuredTicker: 'AITX',
    status: 'published',
    content: {
      summary: 'Stock dilution is the silent killer of penny stock portfolios. Learn how predatory debt financiers convert notes at a discount to market and dump billions of new shares into retail bids.',
      keyTakeaways: [
        'Floorless convertible debt allows noteholders to convert unpaid loans into shares at a 25%–50% discount to the prevailing market price.',
        'When share price drops, the noteholder receives exponentially more shares upon conversion, causing an accelerating dilution spiral.',
        'Check the authorized shares (A/S) versus outstanding shares (O/S) spread in SEC 10-Q reports to identify remaining dilution runway.'
      ],
      sections: [
        {
          heading: '1. What is a Floorless Convertible Promissory Note?',
          body: [
            'Penny companies that cannot secure bank loans often turn to toxic debt lenders. The agreement typically gives the lender the right to convert the debt into common stock after 6 months at a deep discount (e.g., 60% of the lowest closing price in the preceding 20 trading days).',
            'Because the discount has no minimum dollar floor, if the stock drops from $0.01 to $0.001, the lender receives 10 times more shares for the same dollar debt. They immediately sell these converted shares on the open market, pocketing an instant risk-free 40% profit while depressing the stock price further.'
          ]
        },
        {
          heading: '2. The Reverse-Split Trap',
          body: [
            'Once the outstanding shares reach the corporate authorized share cap (e.g., 10 billion shares) and the price hits the minimum sub-penny tick of $0.0001, management executes a 1-for-50 or 1-for-100 reverse stock split.',
            'While a reverse split reduces share count and raises the unit price on paper, without changing the underlying debt notes, the lender simply restarts the conversion process at the new higher price, grinding the stock back down to sub-pennies.'
          ]
        },
        {
          heading: '3. Dilution Red Flags to Spot in 10-Q Notes',
          body: [
            'Always inspect the "Notes to Consolidated Financial Statements" under "Convertible Notes Payable".',
            'Look for terms like "variable conversion price", "floorless conversion", "derivative liabilities", and "unregistered shares issued for debt extinguishment".'
          ]
        }
      ],
      faqs: [
        {
          question: 'How can retail investors protect themselves against toxic dilution?',
          answer: 'Avoid holding sub-penny stocks overnight without reading the latest Form 10-Q balance sheet notes. Stick to issuers with fixed conversion prices or verified zero convertible debt.'
        },
        {
          question: 'What is a healthy Authorized to Outstanding ratio?',
          answer: 'Ideally, outstanding shares should be at least 40% to 60% of authorized shares. When authorized is 100 times higher than outstanding, management has ample room to issue hundreds of millions of new shares without shareholder approval.'
        }
      ]
    }
  },
  {
    id: 'verify-otc-transfer-agents',
    slug: 'how-to-verify-otc-share-structure-transfer-agents',
    title: 'How to Verify OTC Share Structure & Transfer Agent Reports',
    description: 'Learn how to verify real-time share structure on OTC Markets, identify DTC chills, and confirm transfer agent reporting compliance.',
    date: '2026-10-23',
    weekNumber: 43,
    readTime: '4 min read',
    category: 'Due Diligence',
    targetKeywords: ['how to check otc share structure', 'verified transfer agent otc markets', 'dtc chill check', 'otc float verification'],
    featuredTicker: 'VNUE',
    status: 'published',
    content: {
      summary: 'Before placing a trade on an OTC stock, verifying the share structure through the issuer transfer agent ensures you are not trading into an undisclosed float expansion.',
      keyTakeaways: [
        'The "Verified by Transfer Agent" badge on OTC Markets confirms that the official custodian of the company shareholder ledger provides real-time counts.',
        'A stale verification date (older than 90 days) is an immediate warning that management may be concealing recent share issuances.',
        'A DTC Chill or Global Lock prevents electronic book-entry settlement through brokers, stranding retail traders in illiquid physical certificates.'
      ],
      sections: [
        {
          heading: '1. Why Transfer Agent Verification Matters',
          body: [
            'Unlike NASDAQ or NYSE where automated clearing enforces strict float visibility, OTC Markets relies on periodic disclosures. Companies that participate in the Transfer Agent Verified Shares program authorize their registered transfer agent (such as Computershare, Continental, or VStock Transfer) to submit live outstanding and float share counts directly to OTC Markets.',
            'When the badge is active with a current timestamp, you know the share count shown in our analyzer is backed by an independent custodian.'
          ]
        },
        {
          heading: '2. Beware of "Dark" Unverified Share Structures',
          body: [
            'When a company terminates its relationship with its transfer agent or refuses to authorize disclosure, the share structure on quote feeds becomes frozen. During this window, tens of millions of new shares may enter the public float without appearing on public quote screens until the next quarterly filing.'
          ]
        }
      ],
      faqs: [
        {
          question: 'What is a DTC Chill?',
          answer: 'A Depository Trust Company (DTC) chill is a restriction placed on book-entry clearing when the DTC suspects irregular trading or non-compliant share issuances. Many brokers will not allow purchases of chilled stocks.'
        }
      ]
    }
  },
  {
    id: 'fnma-otc-gse-capital-analysis',
    slug: 'fannie-mae-fnma-otc-capital-structure-gse-analysis',
    title: 'Fannie Mae (FNMA) on OTCQB: Capital Structure & Treasury Warrant Dilution',
    description: 'A deep-dive analysis of Fannie Mae trading on the OTCQB: senior preferred liquidation preferences, conservatorship exit prospects, and common share dilution.',
    date: '2026-10-16',
    weekNumber: 42,
    readTime: '6 min read',
    category: 'Ticker Deep Dive',
    targetKeywords: ['fnma stock analysis', 'fannie mae otc dilution', 'fnma junior preferred vs common', 'fannie mae conservatorship exit'],
    featuredTicker: 'FNMA',
    status: 'published',
    content: {
      summary: 'Fannie Mae (FNMA) is one of the highest-volume stocks on the OTCQB with billions in daily trading interest, but its capital structure carries unique regulatory dilution risks that penny traders must understand.',
      keyTakeaways: [
        'FNMA trades on the OTCQB Venture Market alongside Freddie Mac (FMCC) under Federal Housing Finance Agency (FHFA) conservatorship since 2008.',
        'The US Treasury holds warrants to purchase 79.9% of the common stock for a nominal price ($0.00001 per share), representing an overhang of massive dilution.',
        'Senior and Junior Preferred stock tiers sit ahead of common shares in any potential capital release or dividend restoration.'
      ],
      sections: [
        {
          heading: '1. Conservatorship and the Treasury Warrant Overhang',
          body: [
            'During the 2008 financial crisis, the US government placed Fannie Mae into conservatorship. In exchange for capital support, the Treasury received senior preferred shares with liquidation preference and warrants to purchase 79.9% of FNMA\'s common stock.',
            'Even though Fannie Mae generates billions in annual net income from guarantee fees, that capital is retained on the balance sheet under the Enterprise Regulatory Capital Framework (ERCF) to build toward a combined $300B+ buffer.'
          ]
        },
        {
          heading: '2. Junior Preferreds vs Common Shares',
          body: [
            'Institutional investors frequently trade the OTC junior preferred series (e.g., FNMAS, FNMAT) rather than the common stock (FNMA) because preferred shares have defined par values ($25 or $50) and liquidation priority in the event of an FHFA recapitalization plan.'
          ]
        }
      ],
      faqs: [
        {
          question: 'Why doesn\'t FNMA trade on the New York Stock Exchange?',
          answer: 'The NYSE delisted Fannie Mae in 2010 when its stock price dropped below the $1.00 minimum bid requirement. It has traded on the OTCQB ever since.'
        }
      ]
    }
  },
  {
    id: 'yooif-yangaroo-analysis',
    slug: 'yangaroo-yooif-canadian-dual-listing-filings-analysis',
    title: 'YANGAROO Inc. (YOOIF / YOO.V): Canadian Interlisted Media Tech Breakdown',
    description: 'Forensic breakdown of Toronto-based YANGAROO Inc. trading on TSX Venture as YOO.V and US OTC Pink as YOOIF: corporate filings, operations, and trading mechanics.',
    date: '2026-10-09',
    weekNumber: 41,
    readTime: '4 min read',
    category: 'Ticker Deep Dive',
    targetKeywords: ['yooif stock analysis', 'yangaroo inc pink sheet', 'yoo v tsx venture', 'canadian dual listed otc stocks'],
    featuredTicker: 'YOOIF',
    status: 'published',
    content: {
      summary: 'YANGAROO Inc. (OTC: YOOIF, TSX-V: YOO) illustrates how Canadian interlisted small-cap technology issuers trade on the US Pink Sheets with F-suffix ordinaries.',
      keyTakeaways: [
        'The "F" suffix on YOOIF signifies a foreign ordinary share (Canadian corporation headquartered in Toronto, Ontario).',
        'Primary liquidity and price discovery typically occur on the Toronto TSX Venture Exchange (TSX-V: YOO), with US Pink prices arbitrage-linked through USD/CAD exchange rates.',
        'Operating commercial software business: Digital Media Distribution System (DMDS) serving television networks, advertising agencies, and music award organizations.'
      ],
      sections: [
        {
          heading: '1. Understanding the F-Suffix on Canadian OTC Stocks',
          body: [
            'US brokers trade Canadian cross-listed shares via 5-letter symbols ending in "F". Unlike ADRs (which end in "Y" and represent custodial certificates), F-shares are the actual common shares of the Canadian company.',
            'Filings for YOOIF are lodged with Canadian SEDAR+ regulators as well as furnished to the SEC under Rule 12g3-2(b) exemptions.'
          ]
        },
        {
          heading: '2. Operating Model vs Shell Comparison',
          body: [
            'Unlike bankrupt or dormant OTC shell vehicles, YANGAROO has ongoing commercial revenue from broadcast television distribution and advertising delivery workflows in North America.'
          ]
        }
      ],
      faqs: [
        {
          question: 'Why is trading volume sometimes low on YOOIF in the US?',
          answer: 'Most volume occurs on the Canadian home exchange (TSX-V: YOO). US retail brokerages route orders through OTC market makers who cross-trade with Toronto.'
        },
        {
          question: 'Where do I find financial statements and filings for Canadian OTC stocks like YOOIF?',
          answer: 'Unlike US domestic stocks that file on SEC EDGAR, Canadian dual-listed companies file official audited annual financials and MD&A reports with Canadian provincial regulators via SEDAR+ (sedarplus.ca) under SEC Rule 12g3-2(b) exemptions. Reports are also mirrored on the OTC Markets Disclosure Portal.'
        }
      ]
    }
  },
  {
    id: 'cytodyn-cydy-clinical-holds-dilution',
    slug: 'cytodyn-cydy-clinical-holds-share-structure-audit',
    title: 'CytoDyn Inc. (CYDY): FDA Clinical Holds, SEC Subpoenas & Share Capital Audit',
    description: 'Forensic audit of CytoDyn (CYDY) on OTCQB: leronlimab drug pipeline history, authorized share increases, and past Department of Justice civil investigations.',
    date: '2026-10-02',
    weekNumber: 40,
    readTime: '5 min read',
    category: 'Ticker Deep Dive',
    targetKeywords: ['cydy stock audit', 'cytodyn dilution history', 'leronlimab clinical hold otc', 'cytodyn authorized shares increase'],
    featuredTicker: 'CYDY',
    status: 'published',
    content: {
      summary: 'CytoDyn (CYDY) is one of the most widely followed retail biotech stocks on the OTCQB. This forensic breakdown analyzes its authorized share expansions, convertible debt obligations, and FDA regulatory milestones.',
      keyTakeaways: [
        'Repeated shareholder votes to raise authorized shares from 450M up to over 1.35 billion shares to fund clinical trials.',
        'High dependency on promissory notes with warrant coverage to maintain working capital without institutional bank credit lines.',
        'Always verify active FDA clinical trial status and lifting of clinical holds directly via clinicaltrials.gov rather than corporate press releases.'
      ],
      sections: [
        {
          heading: '1. Biotech Share Creep & Cash Burn',
          body: [
            'Development-stage biotechnology companies on the OTC markets have zero product revenue and burn millions each quarter. CYDY\'s capital history is a classic case of share expansion: each round of trial funding increases the denominator, requiring subsequent rallies to move larger float amounts.',
            'Retail investors must distinguish between clinical progress announcements and financing S-3 registration statements that register millions of newly minted shares for sale.'
          ]
        },
        {
          heading: '2. Legal & Regulatory Due Diligence',
          body: [
            'Prior executive leadership faced DOJ and SEC scrutiny regarding promotional disclosures. Always inspect Form 10-K Item 3 (Legal Proceedings) to assess ongoing litigation reserves.'
          ]
        }
      ],
      faqs: [
        {
          question: 'Can CYDY uplist back to NASDAQ?',
          answer: 'Uplisting requires meeting the NASDAQ Capital Market minimum bid price of $4.00 (or $3.00 under certain rules) and minimum shareholders equity of $5,000,000, which typically requires a reverse stock split.'
        }
      ]
    }
  },
  {
    id: 'reverse-stock-splits-trap',
    slug: 'reverse-stock-splits-toxic-dilution-trap',
    title: 'The Reverse Stock Split Trap: How 1-for-100 Splits Wipe Out Retail Traders',
    description: 'Learn why 90%+ of penny stocks that execute large reverse splits continue declining, and how predatory noteholders exploit new share caps.',
    date: '2026-09-25',
    weekNumber: 39,
    readTime: '4 min read',
    category: 'Corporate Actions',
    targetKeywords: ['reverse split penny stock trap', '1 for 100 reverse split', 'why penny stocks drop after reverse split', 'reverse split death spiral'],
    featuredTicker: 'EEENF',
    status: 'published',
    content: {
      summary: 'Companies frequently market reverse stock splits as a step toward "uplisting to major exchanges," but without fundamental revenue growth or debt retirement, reverse splits simply reset the dilution clock.',
      keyTakeaways: [
        'A reverse split changes the nominal share count, but DOES NOT reduce convertible promissory debt obligations.',
        'If authorized shares are not proportionately reduced in the corporate charter, management immediately gains headroom to issue thousands of new shares.',
        'Over 85% of penny stocks that execute a 1-for-20 or larger reverse split trade lower within 90 days of the split effective date.'
      ],
      sections: [
        {
          heading: '1. The Math of a Reverse Split',
          body: [
            'In a 1-for-100 split, 10,000 shares at $0.001 become 100 shares at $0.10. While your position value remains $10.00 immediately after the split, the stock now has room to drop by 99% all over again.',
            'Because noteholders still hold debt denominated in dollars, they convert at the higher $0.10 price, rapidly increasing selling volume.'
          ]
        },
        {
          heading: '2. The Unreduced Authorized Shares Red Flag',
          body: [
            'When companies amend their Articles of Incorporation to split outstanding shares but keep Authorized Shares at 10 billion, the dilution runway expands exponentially. Always verify whether Authorized Shares were reduced proportionally on the state Secretary of State portal.'
          ]
        }
      ],
      faqs: [
        {
          question: 'Should you hold through an OTC reverse split?',
          answer: 'Statistically, holding through an OTC reverse split carries negative expected return unless accompanied by certified cancellation of all convertible debt notes.'
        }
      ]
    }
  },
  {
    id: 'sec-form-15-dark-stocks',
    slug: 'sec-form-15-deregistration-dark-otc-stocks',
    title: 'SEC Form 15 Deregistration & Dark Stocks: What Happens When an OTC Issuer Stops Filing?',
    description: 'What happens when a penny stock files SEC Form 15 to terminate registration, enters Pink Limited or Pink No Information, and loses broker quote visibility.',
    date: '2026-09-18',
    weekNumber: 38,
    readTime: '5 min read',
    category: 'Corporate Actions',
    targetKeywords: ['sec form 15 deregistration', 'dark otc stocks', 'pink no information tier', 'rule 15c2 11 dark stocks'],
    status: 'published',
    content: {
      summary: 'When a micro-cap company files Form 15 with the SEC, it terminates its duty to file 10-K annual and 10-Q quarterly reports. Here is what happens to shareholders and market liquidity under SEC Rule 15c2-11.',
      keyTakeaways: [
        'Form 15 immediately terminates periodic SEC reporting obligations under Section 13 or 15(d) of the Securities Exchange Act of 1934.',
        'Under amended SEC Rule 15c2-11, market makers cannot publish public quotes for companies that do not provide current public information.',
        'Stocks that go "dark" are relegated to the Pink No Information or Expert Market, where retail brokers only permit liquidation orders.'
      ],
      sections: [
        {
          heading: '1. Why Companies Go Dark',
          body: [
            'Filing SEC reports with audited financials costs between $150,000 and $500,000 annually. Distressed penny stock management often files Form 15 to cut compliance costs when cash dries up.',
            'However, going dark effectively freezes retail liquidity. Without published financial disclosures, market makers cannot maintain bid and ask quotes.'
          ]
        },
        {
          heading: '2. The Expert Market Trap',
          body: [
            'Since the SEC\'s 2021 overhaul of Rule 15c2-11, retail investors cannot buy stocks on the OTC Expert Market. Only unsolicited sell orders are allowed, causing prices to collapse as retail bids are cut off.'
          ]
        }
      ],
      faqs: [
        {
          question: 'Can a dark stock become current again?',
          answer: 'Yes, if new management files 2 years of delinquent disclosures or files a Form 10 registration statement to reactivate SEC reporting.'
        }
      ]
    }
  },
  {
    id: 'nevada-custodianship-shells',
    slug: 'nevada-custodianship-reverse-merger-playbook',
    title: 'Nevada SOS Custodianship Shells & Reverse Mergers: How to Spot Scams vs Real Runners',
    description: 'Scheduled Week 46 release: How NRS 78.347 custodianship petitions work in Nevada district courts, how shell cleaners reinstate charters, and reverse merger mechanics.',
    date: '2026-11-13',
    weekNumber: 46,
    readTime: '6 min read',
    category: 'Due Diligence',
    targetKeywords: ['nevada custodianship shells otc', 'nrs 78.347 custodianship', 'reverse merger shell stocks', 'shell cleaners otc'],
    status: 'scheduled',
    content: {
      summary: 'Preview of our upcoming Week 46 investigation: Custodianship plays are one of the most profitable yet hazardous niches in penny stocks. Learn how to verify state court dockets before chasing shell rumors.',
      keyTakeaways: [
        'Under Nevada Revised Statutes NRS 78.347, an interested shareholder can petition a state court to be appointed custodian of an abandoned corporation.',
        'The custodian pays back taxes to reinstate the charter, cancels old insider shares, and markets the clean ticker as a reverse merger vehicle.',
        'Scheduled publication on Friday, Nov 13, 2026 with full case studies on successful custodianship runners.'
      ],
      sections: [
        {
          heading: 'Upcoming Guide Preview',
          body: [
            'This guide drops on Friday, November 13, 2026 as part of our weekly due diligence calendar.',
            'We will examine exact Nevada District Court filings (Clark County / Washoe County), how to verify active custodianship orders, and how to verify if a private merger partner has audited financials ready.'
          ]
        }
      ],
      faqs: [
        {
          question: 'When is this post releasing?',
          answer: 'Scheduled for publication on Friday, November 13, 2026. Check back weekly for fresh diligence breakdowns.'
        }
      ]
    }
  }
];
