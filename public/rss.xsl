<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
<head>
  <title>Penny Stock Analyser – Weekly Diligence RSS Feed</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #020617; color: #f8fafc; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    .header { border-bottom: 1px solid #1e293b; padding-bottom: 1.5rem; margin-bottom: 2rem; }
    h1 { color: #10b981; font-size: 1.5rem; margin: 0 0 0.5rem 0; font-family: monospace; }
    .badge { display: inline-block; background: #064e3b; color: #6ee7b7; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-family: monospace; margin-bottom: 0.75rem; }
    .info { color: #94a3b8; font-size: 0.9rem; }
    .item { background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; }
    .item h2 { margin: 0 0 0.5rem 0; font-size: 1.1rem; }
    .item h2 a { color: #f8fafc; text-decoration: none; }
    .item h2 a:hover { color: #10b981; text-decoration: underline; }
    .date { color: #64748b; font-size: 0.8rem; font-family: monospace; margin-bottom: 0.5rem; }
    .desc { color: #cbd5e1; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="header">
    <span class="badge">RSS 2.0 SYNDICATION FEED</span>
    <h1>Penny Stock Analyser Weekly Diligence Feed</h1>
    <p class="info">
      This is an RSS (Really Simple Syndication) feed. Search engines (Google, Bing) and news aggregators read this feed to instantly discover and index our new weekly penny stock diligence guides.
    </p>
  </div>
  <xsl:for-each select="rss/channel/item">
    <div class="item">
      <div class="date"><xsl:value-of select="pubDate"/></div>
      <h2><a href="{link}"><xsl:value-of select="title"/></a></h2>
      <div class="desc"><xsl:value-of select="description"/></div>
    </div>
  </xsl:for-each>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
