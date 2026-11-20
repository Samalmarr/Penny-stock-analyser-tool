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
  cadence: '1–3 New Guides Every Week',
  currentWeek: 47,
  totalPublished: 14,
  nextDropDate: '2026-11-27',
  nextDropTopic: 'Reading Balance Sheets: Cash Runway vs. Short-Term Debt in Under-$5 Stocks'
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'beginners-5-step-penny-stock-checklist',
    slug: 'beginners-5-step-penny-stock-due-diligence-checklist',
    title: "Beginner's Guide: 5-Step Penny Stock Research Checklist Before Buying",
    description: 'Evergreen 5-step checklist to research penny stocks and OTC tickers before buying: checking Q-suffix bankruptcy, 3-year revenue vs. debt, share dilution, and SEC/SEDAR+ filings.',
    date: '2026-11-20',
    weekNumber: 47,
    readTime: '6 min read',
    category: 'Due Diligence',
    targetKeywords: ['beginners guide to penny stocks', 'how to research penny stocks', 'penny stock due diligence checklist', 'how to check otc stocks before buying', 'penny stock red flags'],
    featuredTicker: 'PLUG',
    status: 'published',
    content: {
      summary: 'Most losses in penny stocks happen when traders buy off a trending chart or social media post without checking the business underneath. Follow this simple 5-step due diligence checklist before risking capital on any under-$5 or OTC stock.',
      keyTakeaways: [
        'Always verify ticker suffixes first: a 5-letter symbol ending in Q warns of active bankruptcy proceedings.',
        'Review 3 consecutive fiscal years of Turnover (Revenue), Net Profit/(Loss), and Total Debt instead of trusting one press release.',
        'Check SEC Form S-3, Form 8-K, or SEDAR+ filings for convertible debt, ATM equity offerings, and reverse-split authorizations.'
      ],
      sections: [
        {
          heading: 'Step 1: Verify the Ticker Suffix & Exchange Tier',
          body: [
            'Before looking at a price chart, inspect the ticker symbol and exchange. A 5th-letter "Q" signals Chapter 11 or Chapter 7 bankruptcy, where existing common equity is usually extinguished. An "F" suffix typically identifies a foreign ordinary share (such as Canadian TSX-V/CSE issuers trading OTC under SEC Rule 12g3-2(b)).',
            'On NASDAQ or NYSE, stocks trading under $1.00 face minimum bid deficiency notices and reverse-split pressure.'
          ]
        },
        {
          heading: 'Step 2: Check 3-Year Revenue, Profit & Debt Trends',
          body: [
            'Healthy small-caps grow annual revenue faster than debt. Compare the last 3 fiscal years side by side: if revenue is flat or shrinking while net losses and total debt keep climbing, the company usually survives by selling discounted shares to outside financiers.'
          ]
        },
        {
          heading: 'Step 3: Audit Share Dilution & Offering Risk',
          body: [
            'Check whether authorized shares dwarf outstanding shares or whether the company recently filed an SEC Form S-3 shelf registration or Form 8-K convertible note agreement. Frequent dilution acts like an anchor on rallies.'
          ]
        },
        {
          heading: 'Step 4: Confirm Primary Regulatory Filings (SEC EDGAR vs. SEDAR+)',
          body: [
            'Never rely solely on social media summaries. Open the official SEC EDGAR filings (Form 10-K, 10-Q, 8-K) for US issuers, or SEDAR+ filings for Canadian dual-listed companies, to verify cash on hand versus quarterly burn.'
          ]
        },
        {
          heading: 'Step 5: Check Liquidity & Position Sizing',
          body: [
            'Wide bid-ask spreads and sudden trading halts can trap retail orders. Only risk capital you can afford to lose completely, and spend time reviewing filings before entering.'
          ]
        }
      ],
      faqs: [
        {
          question: 'How long should you research a penny stock before buying?',
          answer: 'Spend at least 30 to 60 minutes checking multi-year financials, debt, dilution disclosures, and recent SEC or SEDAR+ filings before taking a position.'
        },
        {
          question: 'Can I run all 5 checks in one place for free?',
          answer: 'Yes. Penny Stock Analyser combines live quotes, 3-year turnover/profit/debt tables, bankruptcy Q-suffix detection, dilution alerts, and direct SEC/SEDAR+/OTC links on one screen.'
        }
      ]
    }
  },
  {
    id: 'sec-form-s3-shelf-dilution-guide',
    slug: 'sec-form-s3-shelf-registration-dilution-warning',
    title: 'SEC Form S-3 Shelf Registrations: How to Spot an Offering Drop Before It Hits',
    description: 'Learn how SEC Form S-3 shelf registrations, prospectus supplements (424B5), and At-the-Market (ATM) equity programs trigger sudden small-cap offering drops.',
    date: '2026-11-20',
    weekNumber: 47,
    readTime: '5 min read',
    category: 'Dilution',
    targetKeywords: ['sec form s3 shelf registration', '424b5 prospectus dilution', 'at the market offering penny stock', 'how to spot stock offering before drop', 'small cap dilution filings'],
    featuredTicker: 'ACHR',
    status: 'published',
    content: {
      summary: 'Few things catch penny-stock traders off guard faster than an overnight 30% offering drop right after a strong rally. In most cases, the company disclosed the ability to sell those shares weeks or months earlier in an SEC Form S-3 shelf registration.',
      keyTakeaways: [
        'An SEC Form S-3 ("universal shelf") pre-registers a dollar amount of shares, warrants, or debt for up to 3 years.',
        'When the company actually sells shares under that shelf, it files a Form 424B5 prospectus supplement—often pricing shares below market.',
        'Small-caps under $75M public float face the "baby shelf rule" (Form S-3 General Instruction I.B.6), capping sales to 1/3 of public float over 12 months.'
      ],
      sections: [
        {
          heading: '1. What Is a Form S-3 Shelf Registration?',
          body: [
            'Form S-3 lets eligible public companies register common stock, preferred stock, warrants, and debt securities ahead of time ("on the shelf") so management can raise capital quickly without waiting weeks for SEC review on each deal.',
            'Seeing an active S-3 on SEC EDGAR does not mean shares were dumped today—it means the gun is loaded whenever cash runs tight or the stock rallies.'
          ]
        },
        {
          heading: '2. Form 424B5 & At-the-Market (ATM) Supplements',
          body: [
            'Look inside EDGAR for Form 424B5 ("Prospectus filed pursuant to Rule 424(b)(5)"). These filings tell you whether the company just priced a discounted direct offering with warrants or activated an At-the-Market (ATM) sales agreement allowing a broker to drip new shares straight into daily volume.'
          ]
        },
        {
          heading: '3. Checking Cash Burn Before Chasing a Green Day',
          body: [
            'Before buying a sharp multi-day spike in a cash-burning small-cap, compare its 3-year Net Loss and Total Debt against unrestricted cash in the latest 10-Q. Companies with under 6–9 months of cash runway and an active Form S-3 frequently use high-volume spikes to raise money.'
          ]
        }
      ],
      faqs: [
        {
          question: 'Does filing Form S-3 immediately dilute shareholders?',
          answer: 'Filing the S-3 creates an active shelf capacity, while actual dilution occurs when shares are sold via a 424B5 prospectus supplement, ATM sales, or warrant exercises.'
        },
        {
          question: 'Where do I find S-3 and 424B5 filings for a stock?',
          answer: 'Search the ticker in Penny Stock Analyser and click the direct SEC EDGAR button to filter recent registration statements (S-3) and prospectus supplements (424B5).'
        }
      ]
    }
  },
  {
    id: 'plug-power-dilution-debt-guide',
    slug: 'plug-power-plug-cash-burn-debt-dilution-analysis',
    title: 'Plug Power (PLUG): Cash Burn, Total Debt & Share Dilution Check Before Buying',
    description: 'How to evaluate Plug Power (PLUG) and cash-burning clean energy small-caps: checking 3-year turnover vs. net losses, total debt load, and SEC ATM share dilution filings.',
    date: '2026-11-15',
    weekNumber: 46,
    readTime: '5 min read',
    category: 'Ticker Deep Dive',
    targetKeywords: ['plug power stock dilution', 'plug 3 year financials debt', 'is plug power going bankrupt', 'plug sec filings check', 'small cap cash burn analysis'],
    featuredTicker: 'PLUG',
    status: 'published',
    content: {
      summary: 'High-volume under-$5 NASDAQ stocks like Plug Power (PLUG) attract thousands of retail traders every week—but headline partnerships rarely tell the full story. Here is how to audit 3-year revenue, operating losses, debt obligations, and share count expansion before risking capital.',
      keyTakeaways: [
        'Always compare 3-year annual turnover growth against widening net losses and total debt before buying a high-volume turnaround stock.',
        'At-the-Market (ATM) equity programs and Form S-3 shelf registrations allow capital-intensive issuers to sell millions of new shares into rallies.',
        'Check SEC Form 10-K and 10-Q cash-on-hand versus quarterly operating cash burn to estimate financing risk.'
      ],
      sections: [
        {
          heading: '1. Revenue Growth vs. Persistent Net Losses',
          body: [
            'Many popular small-cap clean energy and EV stocks show growing top-line revenue while still posting heavy negative gross margins and deep annual net losses. A company can announce large multi-year deployment deals and still lose money on every unit delivered.',
            'Pulling the past 3 fiscal years of Turnover, Profit/Loss, and Total Debt side-by-side quickly reveals whether losses are narrowing toward profitability or requiring ever-larger outside capital raises.'
          ]
        },
        {
          heading: '2. Watching ATM Offerings & Share Count Creep',
          body: [
            'Unlike dark OTC shells that use toxic floorless notes, NASDAQ-listed small-caps frequently raise cash through At-the-Market (ATM) equity distribution agreements, convertible senior notes, or discounted secondary offerings filed on SEC Form 8-K and Form S-3.',
            'When an issuer regularly increases weighted-average diluted shares outstanding each year, existing holders own a smaller percentage of any eventual recovery—keeping overhead supply heavy whenever the stock rallies.'
          ]
        },
        {
          heading: '3. Checking Debt Load & Liquidity Runway on SEC EDGAR',
          body: [
            'Use the SEC EDGAR link on the PLUG profile to open the most recent Form 10-Q or Form 10-K. Focus on three lines: unrestricted cash and equivalents, operating cash outflow over the last 9–12 months, and near-term debt maturities.',
            'If annual cash burn exceeds unrestricted cash, additional equity issuance or debt restructuring is usually on the horizon.'
          ]
        }
      ],
      faqs: [
        {
          question: 'Where can I check Plug Power (PLUG) 3-year revenue, profit, and debt?',
          answer: 'Run PLUG inside Penny Stock Analyser to inspect the past 3 fiscal years of Turnover, Net Profit/(Loss), and Total Debt alongside direct links to SEC EDGAR filings.'
        },
        {
          question: 'What is the main risk with high-volume sub-$5 NASDAQ stocks?',
          answer: 'Even active NASDAQ stocks with well-known brands can suffer prolonged share-price pressure if heavy operating losses force repeated equity dilution or convertible debt financing.'
        }
      ]
    }
  },
  {
    id: 'archer-aviation-achr-runway-guide',
    slug: 'archer-aviation-achr-cash-runway-warrants-dilution-check',
    title: 'Archer Aviation (ACHR): Pre-Revenue Cash Runway, Warrants & Share Count Check',
    description: 'Due diligence guide for Archer Aviation (ACHR) and pre-revenue eVTOL small-caps: reviewing 3-year expenses, total debt, warrant overhang, and SEC capital-raise filings.',
    date: '2026-11-15',
    weekNumber: 46,
    readTime: '5 min read',
    category: 'Ticker Deep Dive',
    targetKeywords: ['achr stock dilution', 'archer aviation financials debt', 'achr warrants share count', 'pre revenue small cap risk', 'achr sec filings'],
    featuredTicker: 'ACHR',
    status: 'published',
    content: {
      summary: 'Pre-revenue aerospace and eVTOL tickers like Archer Aviation (ACHR) trade heavily on certification milestones and headline partnerships. Before chasing momentum, here is how to review multi-year losses, debt, and warrant dilution risk in SEC filings.',
      keyTakeaways: [
        'Pre-revenue companies typically show near-zero annual turnover alongside heavy R&D and FAA certification expenses.',
        'Former SPAC mergers often carry outstanding public/private warrants and milestone share issuances that can expand the float.',
        'Verify quarterly cash burn and total debt in the latest SEC Form 10-Q before holding through high-volatility swings.'
      ],
      sections: [
        {
          heading: '1. Understanding Pre-Revenue 3-Year Financials',
          body: [
            'When an aviation or deep-tech small-cap is still working through FAA type certification and manufacturing scale-up, zero or minimal turnover over the past 3 years is expected—what matters is how rapidly operating expenses and total debt are growing.',
            'Comparing 3-year Net Loss and Total Debt trends helps separate companies funded primarily with equity partnerships from those taking on high-cost debt.'
          ]
        },
        {
          heading: '2. Warrant Overhang & Follow-On Offerings',
          body: [
            'Many modern small-cap mobility stocks went public via SPACs or strategic PIPE financings, leaving behind stock warrants and shelf registrations.',
            'Before buying a breakout, open the SEC EDGAR link and search the latest 10-Q or 8-K for "warrants", "shares outstanding", and "shelf registration" to see potential dilution levels if the stock rallies above key strike prices.'
          ]
        },
        {
          heading: '3. Milestones vs. Liquidity',
          body: [
            'In pre-revenue stories, stock price can swing 20–40% in a week on flight-test headlines or institutional stake announcements. Pairing catalyst news with a quick check of balance-sheet debt and cash runway keeps position sizing realistic.'
          ]
        }
      ],
      faqs: [
        {
          question: 'Why does a pre-revenue stock show $0 turnover for 3 years?',
          answer: 'Development-stage issuers cannot book commercial flight or vehicle sales until regulatory certification and initial deliveries begin, so funding comes from existing cash reserves, partners, or new share issuances.'
        },
        {
          question: 'How do I check ACHR SEC filings fast?',
          answer: 'Search ACHR in Penny Stock Analyser to view its 3-year profit/debt summary, live range, and one-click SEC EDGAR link for Form 10-K, 10-Q, and 8-K reports.'
        }
      ]
    }
  },
  {
    id: 'nasdaq-minimum-bid-rule-guide',
    slug: 'nasdaq-1-dollar-minimum-bid-rule-reverse-split-warning',
    title: 'NASDAQ $1 Minimum Bid Rule & 180-Day Extensions: Reverse Split & Delisting Guide',
    description: 'What happens when a penny stock trades below $1.00 on NASDAQ: Listing Rule 5550(a)(2), 30-day deficiency notices, 180-day extensions, reverse split votes, and OTC delisting.',
    date: '2026-11-15',
    weekNumber: 46,
    readTime: '5 min read',
    category: 'Corporate Actions',
    targetKeywords: ['nasdaq 1 dollar rule', '180 day extension penny stock', 'nasdaq deficiency notice 8k', 'sub 1 dollar stock reverse split', 'nasdaq delisting to otc'],
    status: 'published',
    content: {
      summary: 'Whenever a popular NASDAQ stock drops under $1.00, traders immediately start arguing about delisting deadlines and reverse splits. Here is the exact timeline of NASDAQ Listing Rule 5550(a)(2) and how to spot warning signs in Form 8-K filings.',
      keyTakeaways: [
        'Closing below $1.00 for 30 consecutive business days triggers a formal NASDAQ deficiency notice (disclosed via SEC Form 8-K Item 3.01).',
        'Companies generally receive an initial 180-calendar-day compliance window—and sometimes a second 180-day extension if transferred to NASDAQ Capital Market.',
        'To regain $1.00 compliance (closing at or above $1.00 for 10+ consecutive business days), struggling issuers frequently resort to aggressive reverse stock splits.'
      ],
      sections: [
        {
          heading: '1. The 30-Day Trigger & Form 8-K Item 3.01',
          body: [
            'Under NASDAQ Listing Rule 5550(a)(2), listed shares must maintain a minimum closing bid price of $1.00 per share. Once a stock closes below $1.00 for 30 consecutive trading days, NASDAQ sends a written deficiency notice.',
            'The company must disclose that notice to the public within 4 business days on SEC Form 8-K under Item 3.01 (Notice of Delisting or Failure to Satisfy a Continued Listing Rule).'
          ]
        },
        {
          heading: '2. The 180-Day Compliance Window & Second Extension',
          body: [
            'Receiving a deficiency notice does not mean immediate delisting. The issuer receives 180 calendar days to regain compliance by closing at $1.00 or higher for at least 10 consecutive business days (occasionally 20 days at NASDAQ discretion).',
            'If the stock is still below $1.00 after 180 days, companies meeting other Capital Market equity standards may qualify for one additional 180-day grace period—typically by committing to cure the deficiency via a reverse stock split if needed.'
          ]
        },
        {
          heading: '3. Reverse Split Votes vs. OTC Delisting Risk',
          body: [
            'Watch DEF 14A proxy filings for special shareholder meetings authorizing a reverse split ratio (such as 1-for-10 up to 1-for-50). If compliance still fails or shareholders reject the split, NASDAQ issues a Staff Delisting Determination and the ticker drops to the OTC Pink or OTCQB market—often losing institutional liquidity overnight.'
          ]
        }
      ],
      faqs: [
        {
          question: 'How long must a stock stay above $1.00 to regain NASDAQ compliance?',
          answer: 'Normally at least 10 consecutive business days with a closing bid price of $1.00 or higher, though NASDAQ staff can require up to 20 consecutive business days.'
        },
        {
          question: 'Does a 180-day extension mean a stock is safe from dilution?',
          answer: 'No. Many companies raise cash or execute reverse splits during the extension period, so always check 3-year debt, cash burn, and Form S-3 / 8-K dilution disclosures.'
        }
      ]
    }
  },
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
    description: 'How NRS 78.347 custodianship petitions work in Nevada district courts, how shell cleaners reinstate abandoned tickers, and reverse merger dilution red flags.',
    date: '2026-11-13',
    weekNumber: 46,
    readTime: '6 min read',
    category: 'Due Diligence',
    targetKeywords: ['nevada custodianship shells otc', 'nrs 78.347 custodianship', 'reverse merger shell stocks', 'shell cleaners otc'],
    status: 'published',
    content: {
      summary: 'Custodianship shell plays are one of the highest-volatility niches in OTC penny stocks. Before chasing reverse-merger rumors, learn how Nevada Revised Statutes NRS 78.347 works and how to verify real court orders versus empty shell hype.',
      keyTakeaways: [
        'Under Nevada Revised Statutes NRS 78.347, a shareholder can petition a state district court to be appointed custodian of an abandoned or revoked Nevada corporation.',
        'Legitimate custodians pay delinquent state fees to reinstate the charter, clean up disputed debt, and seek an operating private company for a reverse merger.',
        'Always verify actual Clark County or Washoe County court docket approvals and check whether preferred control shares were issued to the custodian before buying.'
      ],
      sections: [
        {
          heading: '1. What Is an NRS 78.347 Custodianship?',
          body: [
            'Thousands of old OTC tickers incorporated in Nevada eventually go dark, stop paying Secretary of State renewal fees, and have their corporate charter revoked while the ticker still trades on Pink Limited or Expert Market.',
            'Under Nevada law (NRS 78.347), an active shareholder can file a petition in Nevada District Court requesting appointment as corporate custodian to restore good standing and hold a shareholder meeting.'
          ]
        },
        {
          heading: '2. Real Shell Cleanups vs. Empty Pump Rumors',
          body: [
            'During a custodianship run, social media traders often hype "merger incoming" months before any court order is actually signed. Always verify on the Nevada Secretary of State (SilverFlume) business portal whether the entity status is Active and who is listed as officer/director.',
            'Remember that even after a merger closes, bringing audited PCAOB financials to OTCQB or NASDAQ can take 6–18 months and frequently involves new convertible financing or reverse splits.'
          ]
        },
        {
          heading: '3. Checking Share Structure & Preferred Control Blocks',
          body: [
            'Review OTC Markets and SEC disclosures for newly created Super-Voting Preferred Stock (such as Series A Preferred carrying 51%+ voting control). Confirm authorized share limits and check whether prior toxic notes were legally discharged or still sit on the balance sheet.'
          ]
        }
      ],
      faqs: [
        {
          question: 'Do all Nevada custodianship stocks end in a reverse merger?',
          answer: 'No. Many petitions are contested, dismissed by judges, or sit idle for years without ever closing an operating acquisition.'
        },
        {
          question: 'Can Expert Market custodianship tickers be bought by retail traders?',
          answer: 'Most US retail brokers restrict buying on SEC Rule 15c2-11 Expert Market tickers until the custodian restores current financial reporting on OTC Markets.'
        }
      ]
    }
  }
];

export function getRelatedGuides(currentPost: BlogPost, limit = 3): BlogPost[] {
  const others = BLOG_POSTS.filter(p => p.slug !== currentPost.slug);
  const sameCategory = others.filter(p => p.category === currentPost.category);
  const differentCategory = others.filter(p => p.category !== currentPost.category);
  return [...sameCategory, ...differentCategory].slice(0, limit);
}
