const { method, url = '' } = $request || {};
const { status, headers } = $response || {};
let { body = '' } = $response || {};

const replaces = {
  discover: 0,
  discoverFeed: 0,
  browseUpdate: 0,
  notifCount: 0,
  storyfeed: 0,
  storyfeedUpdated: 0,
  readingExchange: 0,
  friendReviewUpdate: 0,
  gift: true,
  giftCount: 6,
  upgrade: 0,
  upgrade_query_interval: 604800,
  upgrade_seconds_to_notify: 604800,
  allowScreenshotReport: 0,
  metrickit_diagnostic_upload_enabled: 0,
  metrickit_enabled: 0,
  reader_ads_enabled: 0,
  rmonitor_metrickit_enabled: 0,
  rn_monitor_error: 0,
  rn_sentry_enabled: 0,
  rtl_cls_upload_enabled: 0,
  rtl_upload_enabled: 0,
  ttsTimeoutSecond: 1,
  tts_audio_preload_count: 5,
  notice_title: 'Loon Script',
  showTeenModeAlert: 0,
  detectDiskSpaceInterval: 43200,
  normal_reward_ad: '{"timeoutSeconds":1}',
};

// 升级提示弹窗
if (method === 'POST' && url.includes('mobileSync') && body.includes('upgrade')) {
  const bodyJSON = JSON.parse(body);

  body = JSON.stringify(bodyJSON, function (key, value) {
    const replaceVal = replaces[key];

    if (typeof replaceVal !== 'undefined') return replaceVal;
    return value;
  });
}

$done({ status, headers, body });
