<script lang="ts" setup>
import { ref } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import { loginApi } from '@/api/user'

const username = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)

// 登录
const handleLogin = async () => {
  if (!username.value.trim()) {
    uni.showToast({ title: '请输入用户名', icon: 'none' })
    return
  }
  if (!password.value.trim()) {
    uni.showToast({ title: '请输入密码', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const res = await loginApi(username.value, password.value)
    // 存储登录状态
    uni.setStorageSync('token', res.token)
    uni.setStorageSync('userInfo', JSON.stringify(res.userInfo))
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/index/index' })
    }, 1000)
  } catch (e: any) {
    uni.showToast({ title: e.message || '登录失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <view class="login-page">
    <!-- 顶部装饰 -->
    <view class="login-header">
      <view class="header-bg" />
      <view class="header-content">
        <view class="logo-box">
          <TnIcon name="logo-tuniao" size="72" color="#007aff" />
        </view>
        <text class="app-name">TuniaoUI</text>
        <text class="app-desc">Vue3 UniApp 组件库</text>
      </view>
    </view>

    <!-- 登录表单 -->
    <view class="login-form">
      <text class="form-title">账号登录</text>

      <!-- 用户名 -->
      <view class="form-item">
        <view class="input-wrap">
          <TnIcon name="my" color="#999" size="40" />
          <input
            v-model="username"
            class="input-field"
            type="text"
            placeholder="请输入用户名"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>

      <!-- 密码 -->
      <view class="form-item">
        <view class="input-wrap">
          <TnIcon name="lock" color="#999" size="40" />
          <input
            v-model="password"
            class="input-field"
            :password="!showPassword"
            placeholder="请输入密码"
            placeholder-class="input-placeholder"
          />
          <view class="eye-btn" @tap="showPassword = !showPassword">
            <TnIcon
              :name="showPassword ? 'eye' : 'eye-close'"
              color="#999"
              size="36"
            />
          </view>
        </view>
      </view>

      <!-- 登录按钮 -->
      <view class="login-btn" :class="{ disabled: loading }" @tap="handleLogin">
        <text class="btn-text">{{ loading ? '登录中...' : '登 录' }}</text>
      </view>

      <!-- 提示 -->
      <view class="login-tip">
        <text class="tip-text">演示账号: admin / 123456</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: #f4f5f7;
  position: relative;

  // 顶部区域
  .login-header {
    position: relative;
    height: 520rpx;

    .header-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: linear-gradient(135deg, #007aff, #00b578);
    }

    .header-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 140rpx;

      .logo-box {
        width: 120rpx;
        height: 120rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 30rpx;
        box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
      }

      .app-name {
        margin-top: 30rpx;
        font-size: 44rpx;
        font-weight: bold;
        color: #fff;
      }

      .app-desc {
        margin-top: 10rpx;
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.85);
      }
    }
  }

  // 表单区域
  .login-form {
    margin: -60rpx 40rpx 0;
    position: relative;
    z-index: 2;
    padding: 50rpx 40rpx;
    background: #fff;
    border-radius: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

    .form-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 50rpx;
    }

    .form-item {
      margin-bottom: 30rpx;

      .input-wrap {
        display: flex;
        align-items: center;
        height: 96rpx;
        padding: 0 24rpx;
        background: #f4f5f7;
        border-radius: 16rpx;

        .input-field {
          flex: 1;
          height: 96rpx;
          margin-left: 16rpx;
          font-size: 30rpx;
          color: #333;
        }

        .input-placeholder {
          color: #bbb;
          font-size: 28rpx;
        }

        .eye-btn {
          padding: 10rpx;
        }
      }
    }

    .login-btn {
      margin-top: 50rpx;
      height: 96rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #007aff, #00b578);
      border-radius: 48rpx;

      &.disabled {
        opacity: 0.6;
      }

      .btn-text {
        font-size: 32rpx;
        font-weight: bold;
        color: #fff;
      }
    }

    .login-tip {
      display: flex;
      justify-content: center;
      margin-top: 40rpx;

      .tip-text {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}
</style>
