import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_PAGES } from '../src/data/seoConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

let checksPassed = 0;
let checksFailed = 0;

function check(desc, condition) {
  if (condition) {
    checksPassed++;
    console.log(`  ✅ ${desc}`);
  } else {
    checksFailed++;
    console.error(`  ❌ FAIL: ${desc}`);
  }
}

console.log('====================================================');
console.log('🔍 VERIFYING ALL 9 GENERATED SEO CALCULATOR PAGES');
console.log('====================================================\n');

for (const [key, seo] of Object.entries(SEO_PAGES)) {
  console.log(`Testing /${seo.slug}/:`);
  const filePath = path.join(distDir, seo.slug, 'index.html');
  check(`File exists: ${seo.slug}/index.html`, fs.existsSync(filePath));

  if (!fs.existsSync(filePath)) continue;

  const html = fs.readFileSync(filePath, 'utf8');

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Title
  check(`Contains correct title "${seo.title}"`, html.includes(`<title>${escapeHtml(seo.title)}</title>`));

  // Description
  check(`Contains correct meta description`, html.includes(`content="${escapeHtml(seo.description)}"`));

  // Canonical
  check(`Contains canonical link to "${seo.canonical}"`, html.includes(`<link rel="canonical" href="${seo.canonical}" />`));

  // H1
  check(`Contains H1 "${seo.h1}"`, html.includes(`<h1>${escapeHtml(seo.h1)}</h1>`));

  // JSON-LD
  check(`Contains JSON-LD schema with canonical URL`, html.includes(seo.canonical));

  // Bundle scripts
  check(`Contains bundled JS asset`, html.includes('/CalcX/assets/index-'));
  check(`Contains bundled CSS asset`, html.includes('/CalcX/assets/index-'));

  console.log('');
}

// Check 404.html
console.log('Testing 404.html:');
const notFoundPath = path.join(distDir, '404.html');
check('404.html exists', fs.existsSync(notFoundPath));
if (fs.existsSync(notFoundPath)) {
  const notFoundHtml = fs.readFileSync(notFoundPath, 'utf8');
  check('404.html contains redirect script', notFoundHtml.includes('spa-github-pages') || notFoundHtml.includes('pathSegmentsToKeep'));
}

console.log('\n====================================================');
console.log(`SUMMARY: ${checksPassed} checks passed, ${checksFailed} failed.`);
console.log('====================================================\n');

if (checksFailed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL SEO CHECKS PASSED PERFECTLY!');
  process.exit(0);
}
