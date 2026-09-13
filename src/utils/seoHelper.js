
import { getSeoForTool, DEFAULT_SEO, SITE_URL } from '../data/seoConfig';

/**
 * Updates document title, meta tags, canonical link, and JSON-LD structured data
 */
export function updateDocumentHead(toolId) {
  if (typeof document === 'undefined') return;

  const seo = getSeoForTool(toolId) || DEFAULT_SEO;

  // 1. Update Title
  document.title = seo.title;

  // 2. Helper to set or create meta tag
  const setMeta = (selector, attribute, value, content) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attribute, value);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Meta Description
  setMeta('meta[name="description"]', 'name', 'description', seo.description);

  // Open Graph
  setMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', seo.canonical || `${SITE_URL}/`);

  // Twitter
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
  setMeta('meta[name="twitter:url"]', 'name', 'twitter:url', seo.canonical || `${SITE_URL}/`);

  // Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', seo.canonical || `${SITE_URL}/`);

  // 3. Dynamic JSON-LD Structured Data
  let schemaEl = document.getElementById('calcx-dynamic-schema');
  if (!schemaEl) {
    schemaEl = document.createElement('script');
    schemaEl.id = 'calcx-dynamic-schema';
    schemaEl.type = 'application/ld+json';
    document.head.appendChild(schemaEl);
  }

  const graph = [
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
      '@id': `${seo.canonical || SITE_URL}/#webapp`,
      url: seo.canonical || `${SITE_URL}/`,
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
  ];

  // Add Breadcrumb
  if (seo.slug) {
    graph.push({
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
    });
  }

  // Add FAQ Schema if available
  if (seo.faqs && seo.faqs.length > 0) {
    graph.push({
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

  schemaEl.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  });
}
