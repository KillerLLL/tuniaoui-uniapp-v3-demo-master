<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import { getDriverInfoApi, getIncomeOverviewApi } from '@/api/driver'

// 司机信息
const driverInfo = ref({})
// 收入数据
const incomeData = ref({
  todayIncome: 0,
  monthIncome: 0,
  totalIncome: 0,
})

// 功能菜单
const menuList = [
  { icon: 'wallet', name: '钱包', color: '#007AFF', url: '/biz-pages/driver/wallet/index' },
  { icon: 'ticket', name: '发票', color: '#7B61FF', url: '/biz-pages/driver/invoice/index' },
  { icon: 'car', name: '车辆管理', color: '#FF7A00', url: '/biz-pages/driver/vehicle/index' },
  { icon: 'coupon', name: '优惠券', color: '#FF4C4C', url: '/biz-pages/driver/coupon/index' },
  { icon: 'service', name: '客服', color: '#00B578', url: '/biz-pages/driver/customer-service/index' },
  { icon: 'set', name: '设置', color: '#666', url: '/biz-pages/driver/setting/index' },
]

// 跳转功能页
const onMenuClick = (item) => {
  uni.navigateTo({ url: item.url })
}

// 身份切换
const switchIdentity = () => {
  uni.showToast({ title: '货主端开发中', icon: 'none' })
}

// 格式化金额
const formatMoney = (val) => {
  if (!val && val !== 0) return '0.00'
  return val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 加载数据
const loadData = async () => {
  try {
    const [driverRes, incomeRes] = await Promise.all([
      getDriverInfoApi(),
      getIncomeOverviewApi(),
    ])
    driverInfo.value = driverRes.data
    incomeData.value = incomeRes.data
  } catch (e) {
    console.error('加载个人中心数据失败', e)
  }
}

onMounted(() => {
  loadData()
})

onShow(() => {
  loadData()
})
</script>

// #ifdef MP-WEIXIN
<script>
export default {
  options: {
    virtualHost: true,
  },
}
</script>
// #endif

<template>
  <view class="driver-mine">
    <!-- 顶部区域：渐变背景 -->
    <view class="header-area">
      <view class="header-bg" />
      <view class="header-content">
        <view class="user-section">
          <!-- 头像 -->
          <view class="avatar-box">
            <TnIcon name="my-fill" color="#fff" size="56" />
          </view>
          <!-- 用户信息 -->
          <view class="user-info">
            <text class="nickname">{{ driverInfo.nickname || '司机用户' }}</text>
            <view class="stats-row">
              <text class="stat-item">⭐ {{ driverInfo.rating || '4.8' }}</text>
              <text class="stat-divider">|</text>
              <text class="stat-item">{{ driverInfo.orderCount || 0 }}单</text>
            </view>
            <view v-if="driverInfo.verified" class="verified-tag">
              <TnIcon name="success" color="#00B578" size="24" />
              <text class="verified-text">已认证</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 收入概览条 -->
    <view class="income-bar">
      <view class="income-item">
        <text class="income-amount">{{ formatMoney(incomeData.todayIncome) }}</text>
        <text class="income-label">今日收入</text>
      </view>
      <view class="income-divider" />
      <view class="income-item">
        <text class="income-amount">{{ formatMoney(incomeData.monthIncome) }}</text>
        <text class="income-label">本月收入</text>
      </view>
      <view class="income-divider" />
      <view class="income-item">
        <text class="income-amount">{{ formatMoney(incomeData.totalIncome) }}</text>
        <text class="income-label">累计收入</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view
        v-for="(item, index) in menuList"
        :key="index"
        class="menu-item"
        @tap="onMenuClick(item)"
      >
        <view class="menu-icon" :style="{ backgroundColor: item.color }">
          <TnIcon :name="item.icon" color="#fff" size="40" />
        </view>
        <text class="menu-name">{{ item.name }}</text>
      </view>
    </view>

    <!-- 身份切换 -->
    <view class="switch-identity" @tap="switchIdentity">
      <view class="switch-btn">
        <TnIcon name="swap" color="#007AFF" size="36" />
        <text class="switch-text">切换为货主端</text>
      </view>
    </view>

    <!-- 版本信息 -->
    <view class="version-info">
      <text class="version-text">v1.0.0</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.driver-mine {
  min-height: 100vh;
  background: #f4f5f7;
  padding-bottom: 200rpx;

  // 顶部区域
  .header-area {
    position: relative;

    .header-bg {
      height: 360rpx;
      background: linear-gradient(135deg, #007AFF, #00B4FF);
    }

    .header-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 40rpx 30rpx;

      // 状态栏占位
      padding-top: calc(var(--status-bar-height, 44px) + 40rpx);

      .user-section {
        display: flex;
        align-items: center;

        .avatar-box {
          width: 120rpx;
          height: 120rpx;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4rpx solid rgba(255, 255, 255, 0.4);
        }

        .user-info {
          margin-left: 28rpx;

          .nickname {
            font-size: 36rpx;
            font-weight: bold;
            color: #fff;
          }

          .stats-row {
            display: flex;
            align-items: center;
            margin-top: 10rpx;

            .stat-item {
              font-size: 26rpx;
              color: rgba(255, 255, 255, 0.9);
            }

            .stat-divider {
              margin: 0 12rpx;
              color: rgba(255, 255, 255, 0.5);
            }
          }

          .verified-tag {
            display: flex;
            align-items: center;
            margin-top: 10rpx;
            padding: 4rpx 14rpx;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 16rpx;

            .verified-text {
              font-size: 22rpx;
              color: #fff;
              margin-left: 6rpx;
            }
          }
        }
      }
    }
  }

  // 收入概览
  .income-bar {
    display: flex;
    align-items: center;
    margin: -40rpx 30rpx 0;
    padding: 32rpx 20rpx;
    background: #fff;
    border-radius: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
    position: relative;
    z-index: 2;

    .income-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .income-amount {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
      }

      .income-label {
        font-size: 22rpx;
        color: #999;
        margin-top: 8rpx;
      }
    }

    .income-divider {
      width: 1rpx;
      height: 50rpx;
      background: #f0f0f0;
    }
  }

  // 功能菜单
  .menu-section {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    padding: 36rpx 30rpx;
    margin: 24rpx 30rpx 0;
    background: #fff;
    border-radius: 24rpx;

    .menu-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .menu-icon {
        width: 88rpx;
        height: 88rpx;
        border-radius: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 14rpx;
      }

      .menu-name {
        font-size: 26rpx;
        color: #333;
      }
    }
  }

  // 身份切换
  .switch-identity {
    margin: 24rpx 30rpx 0;
    padding: 30rpx;
    background: #fff;
    border-radius: 24rpx;

    .switch-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 88rpx;
      border: 2rpx solid #007AFF;
      border-radius: 44rpx;

      .switch-text {
        font-size: 30rpx;
        color: #007AFF;
        font-weight: bold;
        margin-left: 12rpx;
      }
    }
  }

  // 版本信息
  .version-info {
    display: flex;
    justify-content: center;
    padding: 40rpx 0;

    .version-text {
      font-size: 24rpx;
      color: #ccc;
    }
  }
}
</style>
