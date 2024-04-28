const { method, url = '' } = $request || {};
const { status, headers } = $response || {};
let { body = '' } = $response || {};

// 重写升级请求接口的响应体
if (method === 'POST' && url.includes('controller.json') && body.includes('version_update')) {
  const ret = JSON.parse(body);
  const { data: { result_rows: upgrade = {} } = {} } = ret;

  upgrade.title = 'QuantumultX Rewrited';
  upgrade.update_type = 10;
  upgrade.version = '1.0.0';
  upgrade.version_code = '100';
  upgrade.version_name = '1.0.0';

  body = JSON.stringify(ret);
}

// 重写aTrust响应体
if (method === 'POST' && url.includes('app_router.json') && body.includes('is_valid')) {
  body = body.replace(/"is_valid":1/g, '"is_valid":0');
}

$done({ status, headers, body });
