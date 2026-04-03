<script setup>
import { ref } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

defineOptions({
  options: {
    virtualHost: true,
  },
})

// 用户资料信息（从本地缓存读取）
const userInfo = ref({
  avatar: '',
  nickname: '王师傅',
  phone: '137****8888',
  realName: '王**',
  idCard: '310***********1234',
  licenseVerified: true,
  vehicleVerified: true,
})

// 资料项列表
const profileItems = [
  { key: 'nickname', label: '昵称', value: '' },
  { key: 'phone', label: '手机号', value: '' },
  { key: 'realName', label: '真实姓名', value: '' },
  { key: 'idCard', label: '身份证号', value: '' },
  { key: 'licenseVerified', label: '驾驶证认证', value: '', type: 'status' },
  { key: 'vehicleVerified', label: '车辆认证', value: '', type: 'status' },
]

// 初始化资料项的值
const initProfileValues = () => {
  try {
    const stored = uni.getStorageSync('userInfo')
    if (stored) {
      const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored
      userInfo.value = { ...userInfo.value, ...parsed }
    }
  } catch (e) {
    // 读取失败使用默认值
  }
  // 同步资料项的值
  profileItems.forEach((item) => {
    item.value = userInfo.value[item.key]
  })
}

// 点击头像
const handleAvatarTap = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      userInfo.value.avatar = res.tempFilePaths[0]
      uni.showToast({ title: '头像已更新', icon: 'success' })
    },
  })
}

// 点击资料项
const handleItemTap = (item) => {
  if (item.type === 'status') return
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

initProfileValues()
</script>

<template>
  <view class="profile-page">
    <CustomNavbar title="个人资料" />

    <view class="page-content">
      <!-- 头像区域 -->
      <view class="avatar-section" @tap="handleAvatarTap">
        <view class="avatar-wrap">
          <image
            v-if="userInfo.avatar"
            class="avatar-img"
            :src="userInfo.avatar"
            mode="aspectFill"
          />
          <view v-else class="avatar-placeholder">
            <TnIcon name="my" color="#fff" size="60" />
          </view>
          <view class="avatar-edit-badge">
            <TnIcon name="camera" color="#fff" size="28" />
          </view>
        </view>
        <text class="avatar-tip">点击更换头像</text>
      </view>

      <!-- 资料列表 -->
      <view class="profile-section">
        <view
          v-for="item in profileItems"
          :key="item.key"
          class="profile-item"
          @tap="handleItemTap(item)"
        >
          <text class="item-label">{{ item.label }}</text>

          <!-- 认证状态类型 -->
          <view v-if="item.type === 'status'" class="item-right">
            <text
              class="status-tag"
              :class="item.value ? 'verified' : 'unverified'"
            >
              {{ item.value ? '已认证' : '未认证' }}
            </text>
          </view>

          <!-- 普通文本类型 -->
          <view v-else class="item-right">
            <text class="item-value">{{ item.value }}</text>
            <TnIcon name="right" color="#ccc" size="32" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: #f4f5f7;

  .page-content {
    padding-top: calc(var(--status-bar-height) + 88rpx + 30rpx);
  }

  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 0;

    .avatar-wrap {
      width: 140rpx;
      height: 140rpx;
      border-radius: 50%;
      overflow: hidden;
      position: relative;

      .avatar-img {
        width: 100%;
        height: 100%;
      }

      .avatar-placeholder {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #007aff, #00b4ff);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .avatar-edit-badge {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 44rpx;
        height: 44rpx;
        border-radius: 50%;
        background: #007aff;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2rpx solid #fff;
      }
    }

    .avatar-tip {
      margin-top: 16rpx;
      font-size: 24rpx;
      color: #999;
    }
  }

  .profile-section {
    margin: 0 24rpx;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;

    .profile-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 28rpx 24rpx;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .item-label {
        font-size: 28rpx;
        color: #333;
        flex-shrink: 0;
      }

      .item-right {
        display: flex;
        align-items: center;

        .item-value {
          font-size: 28rpx;
          color: #999;
          margin-right: 10rpx;
        }

        .status-tag {
          font-size: 24rpx;
          padding: 6rpx 16rpx;
          border-radius: 8rpx;

          &.verified {
            color: #00b578;
            background: rgba(0, 181, 120, 0.1);
          }

          &.unverified {
            color: #ff7a00;
            background: rgba(255, 122, 0, 0.1);
          }
        }
      }
    }
  }
}
</style>
