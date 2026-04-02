/**
 * 跳转到小程序
 * @param {string} appId 小程序appId
 * @param {string} [path=''] 打开页面的路径，如果为空则打开首页
 * @param {'develop'|'trial'|'release'} [envVersion='release'] 打开的小程序版本
 * @returns {Promise<void>}
 */
export const navMiniProgram = (appId, path = '', envVersion = 'release') => {
  return new Promise((resolve, reject) => {
    uni.navigateToMiniProgram({
      appId,
      path,
      envVersion,
      success: () => {
        resolve()
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
