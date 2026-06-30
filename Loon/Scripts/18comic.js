const jsContent =
`
#billboard-modal {
    display: none !important;
}

div.modal-backdrop {
    display:none !important;
}

div[style*="position"] {
    display: none !important; 
}

div.row:has(.mobile-ad){
    display:none !important;
}

#episode-block + div {
    display: none !important;
}

div.tab-content + div.row {
    display: none !important;
}

div.panel-heading + div {
    display:none !important;
}

div.panel-body + div {
    display:none !important;
}

div.thewayhome {
    display: none !important;
}
`;

function appendJS() {
  const body = $response.body || '';
  const replaced = body.replace(/<\/head>/, `<style>${jsContent}</style></head>`);

  $done({ body: replaced });
}

try {
  const { headers } = $response;
  const contentType = headers['content-type'] || headers['Content-Type'] || '';

  if (contentType.includes('text/html')) {
    appendJS();
  } else {
    $done({});
  }
} catch (error) {
  $done({});
}
