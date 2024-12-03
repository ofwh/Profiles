const { method, url = '' } = $request || {};
const { body = '' } = $response || {};

// 升级提示弹窗
if (method === 'POST' && url.includes('mobileSync') && body.includes('upgrade')) {
  const bodyJSON = JSON.parse(body);
  const { configsets = {} } = bodyJSON;

  bodyJSON.gift = true;
  bodyJSON.giftCount = 6;

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
  configsets.notice_title = 'Loon Script';
  configsets.showTeenModeAlert = 0;
  configsets.detectDiskSpaceInterval = 43200;
  configsets.normal_reward_ad = "{\"timeoutSeconds\":1}";

  const rewrote = JSON.stringify(bodyJSON);
  $done({ body: rewrote });
} else {
  $done({ body });
}
