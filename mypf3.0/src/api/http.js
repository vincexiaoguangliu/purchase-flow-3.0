// 请求服务器host
import { Base64 } from 'js-base64';
const host = 'https://staging.handy.travel';
// const host = 'https://www.lansheng8.com'

// webview 获取当前 handy 设备信息
// const handyInfo = window.Android.getGlobalProperties()

const handyInfo = {
  "service_counter": "HKG - QA Alvin",
  "coordinate_system": "wgs84",
  "location_accuracy": 22.8,
  "longitude": 114.1927342,
  "hotel_id": "1138",
  "rom_version": "7.6.0",
  "handy_country_code": "852",
  "device_locale": "en_US",
  "imei": "356112071058161",
  "status": "rented_out",
  "handy_zone": "Hong Kong",
  "latitude": 22.2869185,
  "room_id": "Test005",
  "application_id": "com.tinklabs.handy.ticketing",
  "deploy_environment": "staging",
  "handy_country": "Hong Kong",
  "user_language": "English",
  "device_user_id": "24937324",
  "timestamp_utc": 1539603524419,
  "deviceKey": "9640f552a12ca8a68a366c3d95a7bbe0"
}

// 根据 SDK 信息生成凭证
const token = JSON.stringify({
  "barcode": handyInfo.imei,
  "key": handyInfo.deviceKey
})
const auth = Base64.encode(token)


/**
 * 发送网络请求
 * @param method            HTTP 请求方法
 * @param url               URL
 * @param bodyParams        HTTP Body
 * @param urlParams         URL Params
 */
export default async function (method, url, { bodyParams = {}, urlParams = {} }) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', auth);
  headers.append('X-Handy-locale', handyInfo.device_locale);
  headers.append('Handy-Deal-Version', handyInfo.handy_deal_version || '2.0.0');

  // 将url参数写入URL
  let urlParStr = '';
  const urlParArr = Object.keys(urlParams);
  if (urlParArr.length) {
    Object.keys(urlParams).forEach((element) => {
      urlParStr += `${element}=${urlParams[element]}&`;
    });
    urlParStr = `?${urlParStr}`.slice(0, -1);
  }

  const res = await fetch(new Request(`${host}${url}${urlParStr}`, {
    method,
    headers,
    body: method === ('GET' || 'HEAD') ? null : JSON.stringify(bodyParams),
  }));

  if ((res.status < 200 || res.status > 299) && res.status !== 304) {
    console.log(`出错啦：${res.status}`);
  } else {
    return res.json();
  }
}
