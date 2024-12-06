const { method, url = '' } = $request || {};
const { body = '' } = $response || {};

function isObject(data) {
  return typeof data === 'object';
}

function disableSanForSDK(data = {}) {
  if (!isObject(data)) return;

  const keys = Object.keys(data);

  keys.forEach((key) => {
    const config = data[key];
    if (key === 'sanfor_sdk_is_valid') {
      config.level_index = 0;
    } else {
      disableSanForSDK(config);
    }
  });
}

// 重写升级请求接口的响应体
if (method === 'POST') {
  // 版本更新检测
  if (url.includes('controller.json') && body.includes('version_update')) {
    const bodyData = JSON.parse(body);
    const {
      data: { result_rows: upgrade = {} },
    } = bodyData;

    upgrade.title = 'QuantumultX Rewrited';
    upgrade.update_type = 10;
    upgrade.version = '1.0.0';
    upgrade.version_code = '100';
    upgrade.version_name = '1.0.0';

    const rewrote = JSON.stringify(bodyData);

    $done({ body: rewrote });
    return;
  }

  // 新版零信任开关
  if (url.includes('queryAppKeysConfig.json') && body.includes('sanfor_sdk_is_valid')) {
    const bodyData = JSON.parse(body);
    const { result_rows: rows = [] } = bodyData;

    if (rows.length > 0) {
      rows.forEach(({ keys }) => {
        disableSanForSDK(keys);
      });
    }

    const rewrote = JSON.stringify(bodyData);

    $done({ body: rewrote });
    return;
  }
}

$done({});
