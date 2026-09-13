/**
 * CalcX Post-Build Static SEO Page Generator
 * Generates physical indexable directories (dist/<slug>/index.html) for all 9 core calculators
 * and creates a GitHub Pages fallback dist/404.html.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_PAGES, DEFAULT_SEO, SITE_URL } from '../src/data/seoConfig.js';
import { TOOLS } from '../src/components/Navigation/toolsConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('❌ dist directory not found. Please run vite build first.');
  process.exit(1);
}

const templatePath = path.join(distDir, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.error('❌ dist/index.html not found.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf8');

console.log('====================================================');
console.log('🚀 GENERATING CALCX STATIC INDEXABLE SEO PAGES');
console.log('====================================================\n');

let generatedCount = 0;

for (const [key, seo] of Object.entries(SEO_PAGES)) {
  const targetDir = path.join(distDir, seo.slug);
  fs.mkdirSync(targetDir, { recursive: true });

  let pageHtml = templateHtml;

  // 1. Replace Title
  pageHtml = pageHtml.replace(
    /<title>.*?<\/title>/i,
    `<title>${escapeHtml(seo.title)}</title>`
  );

  // 2. Replace Meta Description
  pageHtml = pageHtml.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`
  );

  // 3. Replace Canonical Link
  pageHtml = pageHtml.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${seo.canonical}" />`
  );

  // 4. Replace Open Graph Tags
  pageHtml = pageHtml.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${seo.canonical}" />`
  );

  // 5. Replace Twitter Tags
  pageHtml = pageHtml.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta\s+name="twitter:url"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:url" content="${seo.canonical}" />`
  );

  // 6. Build Structured Data JSON-LD
  const schemaGraph = [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'CalcX',
      description: DEFAULT_SEO.description,
      inLanguage: 'en',
    },
    {
      '@type': 'WebApplication',
      '@id': `${seo.canonical}#webapp`,
      url: seo.canonical,
      name: seo.h1 || seo.title,
      applicationCategory: seo.applicationCategory || 'CalculatorApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description: seo.description,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'CalcX',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: seo.h1,
          item: seo.canonical,
        },
      ],
    },
  ];

  if (seo.faqs && seo.faqs.length > 0) {
    schemaGraph.push({
      '@type': 'FAQPage',
      mainEntity: seo.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  const jsonLdString = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemaGraph,
  }, null, 2);

  pageHtml = pageHtml.replace(
    /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script type="application/ld+json">\n${jsonLdString}\n    </script>`
  );

  // 7. Inject Semantic Pre-Rendered Content into #root for non-JS crawlers
  const relatedLinksHtml = (seo.relatedToolIds || [])
    .map((toolId) => {
      const tool = TOOLS.find((t) => t.id === toolId);
      if (!tool) return '';
      const href = tool.path ? `${SITE_URL}/${tool.path}` : `${SITE_URL}/?tool=${tool.id}`;
      return `<li><a href="${href}"><strong>${escapeHtml(tool.name)}</strong>: ${escapeHtml(tool.description)}</a></li>`;
    })
    .filter(Boolean)
    .join('\n');

  const faqsHtml = (seo.faqs || [])
    .map((f) => `<dt><strong>${escapeHtml(f.question)}</strong></dt><dd>${escapeHtml(f.answer)}</dd>`)
    .join('\n');

  const preRenderedContent = `
    <div id="root">
      <header style="padding: 24px; max-width: 900px; margin: 0 auto; color: #f8fafc;">
        <nav style="margin-bottom: 16px;"><a href="${SITE_URL}/" style="color: #6366f1;">← Back to CalcX Suite</a></nav>
        <h1>${escapeHtml(seo.h1)}</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: #94a3b8;">${escapeHtml(seo.overview)}</p>
        ${seo.formula ? `<div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin: 16px 0;"><strong>Formula:</strong> <code>${escapeHtml(seo.formula.metric)}</code><br /><small>${escapeHtml(seo.formula.explanation || '')}</small></div>` : ''}
        ${seo.faqs && seo.faqs.length > 0 ? `<section><h2>Frequently Asked Questions</h2><dl>${faqsHtml}</dl></section>` : ''}
        ${relatedLinksHtml ? `<section><h2>Related Calculators</h2><ul>${relatedLinksHtml}</ul></section>` : ''}
      </header>
    </div>
  `.trim();

  pageHtml = pageHtml.replace('<div id="root"></div>', preRenderedContent);

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, pageHtml, 'utf8');
  console.log(`✅ Generated: /${seo.slug}/index.html -> ${targetFile}`);
  generatedCount++;
}

// 8. Generate GitHub Pages SPA fallback dist/404.html
const notFoundHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>CalcX — Free Online Calculators</title>
    <script>
      // Single Page Apps for GitHub Pages
      // MIT License
      // https://github.com/rafgraph/spa-github-pages
      var pathSegmentsToKeep = 1;
      var l = window.location;
      var path = l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/');
      var query = l.search ? '&' + l.search.slice(1) : '';
      var target = l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?p=' +
        encodeURIComponent(path + query) + l.hash;
      l.replace(target);
    </script>
  </head>
  <body>
    <p>Loading CalcX...</p>
  </body>
</html>
`;

fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8');
console.log(`✅ Generated: /404.html fallback redirect`);

console.log('\n====================================================');
console.log(`🎉 ALL ${generatedCount} SEO CALCULATOR PAGES SUCCESSFULLY GENERATED!`);
console.log('====================================================\n');

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
