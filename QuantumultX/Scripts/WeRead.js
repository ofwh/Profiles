const { method, url = '' } = $request || {};
const { body = '' } = $response || {};

// 升级提示弹窗
if (method === 'POST' && url.includes('mobileSync') && body.includes('upgrade')) {
  const ret = JSON.parse(body);
  const { configsets = {} } = ret;

  configsets.upgrade = 0;
  configsets.notice_title = 'QuantumultX Rewrited';

  const rewrited = JSON.stringify(ret);
  $done(rewrited);
} else {
  $done(body);
}
