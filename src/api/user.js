/**
 * 用户相关接口
 * 当前使用模拟数据，后续对接真实接口时取消注释 request 相关代码即可
 */
import { post, get } from '@/utils/request'

// ============ 模拟数据（后续删除） ============
const MOCK_USER = {
  username: 'admin',
  password: '123456',
  token: 'mock-token-2026',
  userInfo: {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    avatar: '',
  },
}

// 是否使用模拟数据（对接真实接口后改为 false）
const USE_MOCK = true
// ============ 模拟数据 end ============

/**
 * 登录
 * @param {string} username 用户名
 * @param {string} password 密码
 */
export const loginApi = (username, password) => {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === MOCK_USER.username && password === MOCK_USER.password) {
          resolve({
            code: 200,
            data: {
              token: MOCK_USER.token,
              userInfo: MOCK_USER.userInfo,
            },
          })
        } else {
          reject(new Error('用户名或密码错误'))
        }
      }, 600)
    })
  }
  // 真实接口
  return post('/user/login', { username, password }, { auth: false })
}

/**
 * 获取用户信息
 */
export const getUserInfoApi = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: MOCK_USER.userInfo })
      }, 300)
    })
  }
  // 真实接口
  return get('/user/info')
}

/**
 * 退出登录
 */
export const logoutApi = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200 })
      }, 200)
    })
  }
  // 真实接口
  return post('/user/logout')
}
