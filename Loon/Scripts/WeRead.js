const { method, url = '' } = $request || {};
const { body = '' } = $response || {};

// 升级提示弹窗
if (method === 'POST' && url.includes('mobileSync') && body.includes('upgrade')) {
  const bodyJSON = JSON.parse(body);
  const { configsets = {} } = bodyJSON;

  configsets.upgrade = 0; // 是否有更新
  configsets.allowScreenshotReport = 0;
  configsets.metrickit_diagnostic_upload_enabled = 0;
  configsets.metrickit_enabled = 0;
  configsets.reader_ads_enabled = 0;
  configsets.rmonitor_metrickit_enabled = 0;
  configsets.rn_monitor_error = 0;
  configsets.rn_sentry_enabled = 0;
  configsets.rtl_cls_upload_enabled = 0;
  configsets.rtl_upload_enabled = 0;
  configsets.ttsTimeoutSecond = 3;
  configsets.tts_audio_preload_count = 5;
  configsets.notice_title = 'QuantumultX Rewrited';

  const rewrited = JSON.stringify(bodyJSON);
  $done({ body: rewrited });
} else {
  $done({ body });
}
