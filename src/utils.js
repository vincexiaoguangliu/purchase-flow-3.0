export default {
  // 获取 url 参数
  getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i = 0;i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] === variable) { 
        return pair[1]
      }
    }
    return ''
  }
}
