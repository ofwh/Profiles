// 2024-09-05 11:06:15
const url = $request.url;
let body = JSON.parse($response.body);

if (url.includes('/v2/user')) {
  body.result.is_vip = 1;
  body.result.svip_expired_at = 1892260800;
  body.result.wt.vip.expired_at = 1892260800;
  body.result.svip_take_effect = 1;
  body.result.vip_type = 's';
} else if (url.includes('user_detail')) {
  ['svip', 'vip'].forEach((type) => {
    if (body.vip_info[type]) {
      body.vip_info[type] = {
        expires_time: '1892260800',
        is_auto_renewal: true,
      };
    }
  });
} else if (url.includes('/api.caiyunapp.com/v1/activity')) {
  if (url.includes('&type_id=A03&')) {
    // 底栏控制项目 主页图标 天气助手 彩云ai
    if (body?.interval) {
      body.interval = 2592000; // 30天===2592000秒
    }
    if (body?.activities?.length > 0) {
      for (let item of body.activities) {
        if (item?.name && item?.type && item?.feature) {
          item.feature = false;
        }
      }
    }
  } else {
    // 其他请求
    body = { status: 'ok', activities: [{ items: [] }] };
  }
} else if (url.includes('/wrapper.cyapi.cn/v1/activity')) {
  // 彩云推广
  if (['&type_id=A03&']?.includes(url)) {
    // 天气助手 彩云ai
    if (body?.interval) {
      body.interval = 2592000; // 30天===2592000秒
    }
    if (body?.activities?.length > 0) {
      body.activities = [];
    }
  } else {
    // 其他请求
    body = { status: 'ok', activities: [{ items: [] }] };
  }
}

$done({ body: JSON.stringify(body) });
