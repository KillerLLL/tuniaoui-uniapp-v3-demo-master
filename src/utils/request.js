/**
 * 请求封装
 * 基于 uni.request 封装，支持拦截器、token 自动携带、统一错误处理
 * 后续替换 BASE_URL 即可对接真实接口
 */

// 接口基础地址 - 根据环境变量自动切换
// 开发环境读取 .env.development，生产环境读取 .env.production
const BASE_URL = import.meta.env.VITE_API_BASE_URL

// 请求超时时间
const TIMEOUT = 10000

/**
 * 核心请求方法
 * @param {Object} options 请求配置
 * @param {string} options.url 接口路径（不含基础地址）
 * @param {string} [options.method='GET'] 请求方法
 * @param {Object} [options.data] 请求参数
 * @param {Object} [options.header] 自定义请求头
 * @param {boolean} [options.loading=true] 是否显示 loading
 * @param {boolean} [options.auth=true] 是否携带 token
 * @returns {Promise}
 */
const request = (options) => {
  const {
    url,
    method = 'GET',
    data,
    header = {},
    loading = true,
    auth = true,
  } = options

  // 显示加载提示
  if (loading) {
    uni.showLoading({ title: '加载中...', mask: true })
  }

  // 自动携带 token
  if (auth) {
    const token = uni.getStorageSync('token')
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
      },
      timeout: TIMEOUT,
      success: (res) => {
        // 后续对接真实接口时，根据实际状态码调整
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // token 过期，跳转登录
          uni.removeStorageSync('token')
          uni.removeStorageSync('userInfo')
          uni.showToast({ title: '登录已过期', icon: 'none' })
          setTimeout(() => {
            uni.navigateTo({ url: '/biz-pages/login/index' })
          }, 1000)
          reject(res)
        } else {
          uni.showToast({
            title: res.data?.message || '请求失败',
            icon: 'none',
          })
          reject(res)
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络异常', icon: 'none' })
        reject(err)
      },
      complete: () => {
        if (loading) {
          uni.hideLoading()
        }
      },
    })
  })
}

/**
 * GET 请求
 * @param {string} url 接口路径
 * @param {Object} [params] 查询参数
 * @param {Object} [options] 额外配置
 */
export const get = (url, params, options = {}) => {
  return request({ url, method: 'GET', data: params, ...options })
}

/**
 * POST 请求
 * @param {string} url 接口路径
 * @param {Object} [data] 请求体
 * @param {Object} [options] 额外配置
 */
export const post = (url, data, options = {}) => {
  return request({ url, method: 'POST', data, ...options })
}

/**
 * PUT 请求
 */
export const put = (url, data, options = {}) => {
  return request({ url, method: 'PUT', data, ...options })
}

/**
 * DELETE 请求
 */
export const del = (url, data, options = {}) => {
  return request({ url, method: 'DELETE', data, ...options })
}

export default request
export { BASE_URL }
