// CloudFront Function: domain redirects + locale detection + URL rewriting
//
// Handles:
//   www.raffaelesollecito.org  → 301 to raffaelesollecito.org
//   raffaelesollecito.com/it   → 301 to raffaelesollecito.org
//   suntickets.it              → 301 to raffaelesollecito.org/{locale}/archive/
//   /path/                     → /path/index.html
//   /path/index.php            → /path/index.html
//   /path                      → /path/index.html  (no extension = directory)

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

  // URL rewriting for the primary site
  var uri = request.uri;

  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (uri.endsWith('/index.php')) {
    request.uri = uri.replace(/\/index\.php$/, '/index.html');
  } else if (!uri.includes('.')) {
    request.uri = uri + '/index.html';
  }

  return request;
}
