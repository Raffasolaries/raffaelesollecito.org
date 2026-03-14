// CloudFront Function: rewrite directory requests to index.html
// Replaces the legacy Lambda@Edge origin-request function.
//
// Handles:
//   /path/          → /path/index.html
//   /path/index.php → /path/index.html
//   /path           → /path/index.html  (no extension = directory)

function handler(event) {
  var request = event.request;
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
