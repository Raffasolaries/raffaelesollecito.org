// CloudFront Function: domain redirects + locale detection + URL rewriting
//
// Handles:
//   www.raffaelesollecito.org  → 301 to raffaelesollecito.org
//   raffaelesollecito.com/it   → 301 to raffaelesollecito.org
//   suntickets.it              → 301 to raffaelesollecito.org/{locale}/archive/
//   /path/                     → /path/index.html
//   /path/index.php            → /path/index.html
//   /path                      → 301 /path/  (canonical trailing slash)
//   /                          → 302 /{locale}/ by Accept-Language
//   legacy WordPress slugs     → 301 to the new localized routes

// Domains that redirect to root
var REDIRECT_TO_ROOT = {
  'raffaelesollecito.com': true,
  'www.raffaelesollecito.com': true,
  'raffaelesollecito.it': true,
  'www.raffaelesollecito.it': true,
};

// Domains that redirect to archive page (locale-aware)
var REDIRECT_TO_ARCHIVE = {
  'suntickets.it': true,
  'www.suntickets.it': true,
};

function getLocale(request) {
  var lang = request.headers['accept-language'];
  if (lang && lang.value && lang.value.toLowerCase().indexOf('it') === 0) {
    return 'it';
  }
  return 'en';
}

// Old WordPress slugs and renamed routes. Values are locale-relative paths.
var LEGACY = {
  '/honor-bound': 'books/',
  '/book': 'books/',
  '/documenti': 'documents/',
  '/progetti': 'projects/',
  '/famiglia-e-amici': 'family/',
  '/blog-processo': 'case/',
  '/considerazioni-sul-processo': 'case/',
  '/the-supreme-court-considerations': 'case/',
  '/the-dna-tale': 'case/',
  '/quello-che-ha-detto-la-polizia-scientifica': 'case/',
  '/the-actual-case-updated-in-pills': 'case/',
  '/suntickets-memories-it-company': 'archive/',
  '/about': 'about/',
  '/contact': 'contact/',
  '/contatti': 'contact/',
  '/chi-sono': 'about/',
};

function legacyRedirect(uri, locale) {
  var path = uri.replace(/\/+$/, '').replace(/\/index\.(html|php)$/, '');
  if (path === '') return null;

  // /en/book/ or /it/book/ → /{locale}/books/
  var m = path.match(/^\/(en|it)\/book$/);
  if (m) return '/' + m[1] + '/books/';

  // /{locale}/<legacy> → /{locale}/<new>
  var lm = path.match(/^\/(en|it)(\/.+)$/);
  if (lm && LEGACY[lm[2]]) return '/' + lm[1] + '/' + LEGACY[lm[2]];

  // /<legacy> (old WordPress, no locale) → /{detected}/<new>
  if (LEGACY[path]) return '/' + locale + '/' + LEGACY[path];

  // Old paginated blog / feeds → case page
  if (path.indexOf('/blog-processo/') === 0 || path === '/feed' || path.indexOf('/feed/') === 0) {
    return '/' + locale + '/case/';
  }
  return null;
}

function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;

  // www → non-www redirect for primary domain
  if (host === 'www.raffaelesollecito.org') {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://raffaelesollecito.org' + request.uri } }
    };
  }

  // Redirect .com and .it domains to root
  if (REDIRECT_TO_ROOT[host]) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://raffaelesollecito.org' + request.uri } }
    };
  }

  // Redirect suntickets.it to archive page with locale detection
  if (REDIRECT_TO_ARCHIVE[host]) {
    var locale = getLocale(request);
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://raffaelesollecito.org/' + locale + '/archive/' } }
    };
  }

  var uri = request.uri;

  // Legacy WordPress + renamed slugs → canonical localized URLs (301)
  var target = legacyRedirect(uri, getLocale(request));
  if (target) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://raffaelesollecito.org' + target } }
    };
  }

  // Bare root → default locale (server-side, instead of the meta-refresh in the export)
  if (uri === '/' || uri === '/index.html') {
    return {
      statusCode: 302,
      statusDescription: 'Found',
      headers: {
        location: { value: 'https://raffaelesollecito.org/' + getLocale(request) + '/' },
        'cache-control': { value: 'private, no-store' },
        vary: { value: 'Accept-Language' }
      }
    };
  }

  // Canonicalise: extension-less paths without trailing slash → trailing slash (301)
  if (!uri.endsWith('/') && !uri.includes('.')) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://raffaelesollecito.org' + uri + '/' } }
    };
  }

  // URL rewriting for the primary site
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (uri.endsWith('/index.php')) {
    request.uri = uri.replace(/\/index\.php$/, '/index.html');
  } else if (!uri.includes('.')) {
    request.uri = uri + '/index.html';
  }

  return request;
}
