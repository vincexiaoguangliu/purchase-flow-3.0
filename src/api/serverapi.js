import 'whatwg-fetch';
//import fetch from 'dva/fetch'
// import Cookie from 'js-cookie'

const publicUrl = process.env.NODE_ENV === 'production'
  ? ''
  : ''

const redirectUrl = process.env.NODE_ENV === 'production'
  ? ''
  : ''

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  if (response.status === 204) {
    return Promise.all([response, null])
  } else {
    return Promise.all([response, response.json()])
  }
}

//const errorMessages = (res) => `${res.status} ${res.statusText}`

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus([response, data]) {
  if (response.status >= 200 && response.status < 300) {
    return data
  }

  if (response.status === 401) {
    window.location.href = redirectUrl
  }

  // let errStr = `${response.status} ${response.statusText}; `
  let errStr = "";

  if (data) {
    Object.keys(data).forEach(e => {
      let str = data[e]
      if (Array.isArray(str)) {
        str = str.join(', ')
      }
      errStr += str
    })
  }

  const error = new Error(errStr)
  error.data = data

  throw error
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const newUrl = publicUrl + url

//   const csrfToken = Cookie.get('XSRF-TOKEN');
//   options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
//   options.headers['X-Requested-With'] = 'XMLHttpRequest'
//   options.headers['X-XSRF-TOKEN'] = csrfToken

  options.credentials = 'include'

  return fetch(newUrl, options)
    .then(parseJSON)
    .then(checkStatus)
    .then(data => ({ data }))
    .catch(err => ({ err, data: err.data }))
}

function getFormUrlencoded(param) {
  let encoded = ''
  const keys = Object.keys(param)
  if (keys.length > 0) {
    encoded = keys
      .filter(key => typeof param[key] !== 'undefined')
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(param[key])}`)
      .join('&')
  }

  return encoded
}

export function get(url, param = {}) {
  const headers = { ...param.headers }
  delete param.headers

  const encoded = getFormUrlencoded(param)

  let newUrl = url
  if (encoded.length > 0) {
    if (newUrl.indexOf('?') === -1) {
      newUrl = `${newUrl}?${encoded}`
    } else {
      newUrl = `${newUrl}&${encoded}`
    }
  }

  return request(newUrl, {
    method: 'GET',
    headers,
  })
}

export function post(url, param = {}) {
  const headers = { ...param.headers }
  delete param.headers

  let body = getFormUrlencoded(param)
  return request(url, {
    method: 'POST',
    body,
    headers,
  })
}

// 因为服务器的限制，暂时用X-HTTP-Method-Override头来模拟PATCH和DELETE
export function patch(url, param = {}) {
  const headers = { ...param.headers }
  delete param.headers
  headers['X-HTTP-Method-Override'] = 'PATCH'
  
  let body = getFormUrlencoded(param)
  return request(url, {
    method: 'POST',
    body,
    headers,
  })
}

export function del(url, param = {}) {
  const headers = { ...param.headers }
  delete param.headers
  headers['X-HTTP-Method-Override'] = 'DELETE'

  let body = getFormUrlencoded(param)
  return request(url, {
    method: 'POST',
    body,
    headers,
  })
}