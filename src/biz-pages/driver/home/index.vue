<script lang="ts" setup>
/**
 * 司机端首页
 * 包含：个人信息、收入概览、快捷入口、进行中订单、公告
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getOngoingOrderApi, getUserInfoApi } from '@/api/driver'
import { ORDER_STATUS_CONFIG } from '@/utils/const'

// 用户信息
const userInfo = ref<any>({
  nickname: '李师傅',
  avatar: '',
  phone: '138****8888',
  verifyStatus: 2,
  driverInfo: {
    carType: '中型货车',
    carPlate: '京A12345',
  },
})

// 钱包信息
const wallet = ref({
  balance: 1280.0,
  todayIncome: 356.0,
  totalIncome: 12560.0,
  pendingSettlement: 1280.0,
})

// 进行中的订单
const ongoingOrder = ref<any>(null)

// 收入数据
const incomeData = ref([
  { label: '待结算', value: '¥128.00', key: 'pendingSettlement' },
  { label: '今日收入', value: '¥356.00', key: 'todayIncome' },
  { label: '已提现', value: '¥2,560', key: 'totalIncome' },
])

// 快捷入口
const quickActions = [
  {
    id: 1,
    label: '我要接单',
    icon: 'car-fill',
    path: '/biz-pages/driver/grab/index',
  },
  {
    id: 2,
    label: '我的订单',
    icon: 'order',
    path: '/biz-pages/driver/order/list',
  },
  {
    id: 3,
    label: '我的钱包',
    icon: 'wallet',
    path: '/biz-pages/driver/my/wallet',
  },
  {
    id: 4,
    label: '车辆管理',
    icon: 'car',
    path: '/biz-pages/driver/my/vehicle',
  },
]

// 公告列表
const noticeList = ['平台新功能上线，抢单更便捷', '春节期间运费调整公告']

// 加载数据
const loadData = async () => {
  try {
    const [userRes, orderRes] = await Promise.all([
      getUserInfoApi(),
      getOngoingOrderApi(),
    ])
    if (userRes.code === 200) {
      userInfo.value = userRes.data
      wallet.value = userRes.data.wallet || wallet.value
      // 更新收入数据
      incomeData.value = [
        {
          label: '待结算',
          value: `¥${userRes.data.wallet?.pendingSettlement || 0}`,
          key: 'pendingSettlement',
        },
        {
          label: '今日收入',
          value: `¥${userRes.data.wallet?.todayIncome || 0}`,
          key: 'todayIncome',
        },
        {
          label: '已提现',
          value: `¥${(userRes.data.wallet?.totalIncome || 0).toLocaleString()}`,
          key: 'totalIncome',
        },
      ]
    }
    if (orderRes.code === 200) {
      ongoingOrder.value = orderRes.data
    }
  } catch (e) {
    console.error('加载数据失败', e)
  }
}

// 跳转到页面
const navigateTo = (path: string) => {
  uni.navigateTo({ url: path })
}

// 查看订单详情
const goToOrderDetail = () => {
  if (ongoingOrder.value) {
    uni.navigateTo({
      url: `/biz-pages/driver/order/ongoing?id=${ongoingOrder.value.id}`,
    })
  }
}

// 跳转到消息
const goToMessage = () => {
  uni.navigateTo({ url: '/biz-pages/driver/my/message' })
}

// 跳转到身份切换
const goToSwitchRole = () => {
  uni.navigateTo({ url: '/biz-pages/driver/common/switch-role' })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="driver-home">
    <!-- 自定义导航栏 -->
    <CustomNavbar :show-back="false">
      <template #left>
        <view class="navbar-left" @tap="goToSwitchRole">
          <text class="role-tag">司机</text>
        </view>
      </template>
      <template #right>
        <view class="navbar-right" @tap="goToMessage">
          <TnIcon name="sound" size="40" />
          <TnBadge
            value="3"
            type="danger"
            absolute
            :absolute-config="{ top: '-10rpx', right: '-10rpx' }"
          />
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="home-content">
      <!-- 个人信息卡片 -->
      <view class="user-card">
        <view class="user-info">
          <view class="avatar-box">
            <text class="avatar-text">{{
              userInfo.nickname?.charAt(0) || '司'
            }}</text>
          </view>
          <view class="user-detail">
            <text class="nickname">{{ userInfo.nickname }}</text>
            <text class="phone">{{ userInfo.phone }}</text>
            <view v-if="userInfo.verifyStatus === 2" class="verify-tag">
              <TnIcon name="star" size="20" color="#fff" />
              <text class="verify-text">已认证</text>
            </view>
          </view>
        </view>
        <view v-if="userInfo.driverInfo" class="car-info">
          <text class="car-text">{{ userInfo.driverInfo.carType }}</text>
          <text class="plate-text">{{ userInfo.driverInfo.carPlate }}</text>
        </view>
      </view>

      <!-- 今日收入 -->
      <view class="income-section">
        <view class="income-card">
          <view
            v-for="(item, index) in incomeData"
            :key="index"
            class="income-item"
          >
            <text class="income-label">{{ item.label }}</text>
            <text class="income-value">{{ item.value }}</text>
          </view>
        </view>
      </view>

      <!-- 快捷功能 -->
      <view class="quick-section">
        <TnTitle title="快捷功能" mode="dot" assist-color="#007AFF" size="lg" />
        <view class="quick-grid">
          <view
            v-for="item in quickActions"
            :key="item.id"
            class="quick-item"
            @tap="navigateTo(item.path)"
          >
            <view class="quick-icon-box">
              <TnIcon :name="item.icon" size="40" color="#fff" />
            </view>
            <text class="quick-label">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <!-- 进行中订单 -->
      <view class="order-section">
        <view class="section-header">
          <TnTitle
            title="进行中订单"
            mode="dot"
            assist-color="#007AFF"
            size="lg"
          />
          <view
            class="title-more"
            @tap="navigateTo('/biz-pages/driver/order/list')"
          >
            <text class="more-text">查看全部</text>
            <TnIcon name="right" size="24" />
          </view>
        </view>
        <view v-if="ongoingOrder" class="order-card" @tap="goToOrderDetail">
          <view class="order-header">
            <text class="order-no">订单号: {{ ongoingOrder.orderNo }}</text>
            <TnTag
              :type="
                ORDER_STATUS_CONFIG[ongoingOrder.status]?.color === '#00B578'
                  ? 'success'
                  : 'warning'
              "
              size="sm"
            >
              {{ ORDER_STATUS_CONFIG[ongoingOrder.status]?.text || '未知' }}
            </TnTag>
          </view>
          <view class="order-route">
            <view class="route-point">
              <view class="point-icon-box start">
                <TnIcon name="start" size="24" />
              </view>
              <text class="point-text">{{ ongoingOrder.loadingAddress }}</text>
            </view>
            <view class="route-line" />
            <view class="route-point">
              <view class="point-icon-box end">
                <TnIcon name="location-fill" size="24" />
              </view>
              <text class="point-text">{{
                ongoingOrder.unloadingAddress
              }}</text>
            </view>
          </view>
          <view class="order-footer">
            <text class="order-freight">运费: ¥{{ ongoingOrder.freight }}</text>
            <view class="order-action">
              <text class="action-text">查看详情</text>
              <TnIcon name="right" size="22" color="#007AFF" />
            </view>
          </view>
        </view>
        <view v-else class="order-empty">
          <TnEmpty mode="order" show-tips>
            <template #tips>
              <text class="empty-text">暂无进行中的订单</text>
              <view class="empty-btn">
                <TnButton
                  type="primary"
                  size="sm"
                  shadow
                  shape="round"
                  @click="navigateTo('/biz-pages/driver/grab/index')"
                >
                  去抢单
                </TnButton>
              </view>
            </template>
          </TnEmpty>
        </view>
      </view>

      <!-- 公告 -->
      <view class="notice-section">
        <view class="notice-card">
          <view class="notice-icon-box">
            <TnIcon name="sound" size="36" color="#007AFF" />
          </view>
          <swiper
            class="notice-swiper"
            vertical
            autoplay
            circular
            interval="3000"
          >
            <swiper-item v-for="(notice, index) in noticeList" :key="index">
              <text class="notice-text">{{ notice }}</text>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.driver-home {
  min-height: 100vh;
  background: #f5f6f8;
}

.navbar-left {
  display: flex;
  align-items: center;

  .role-tag {
    background: linear-gradient(135deg, #007aff, #00b578);
    color: #fff;
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
    font-size: 24rpx;
    font-weight: bold;
  }
}

.navbar-right {
  position: relative;
  padding: 10rpx;
}

.home-content {
  padding: 30rpx;
  padding-top: 180rpx;
}

// 用户卡片
.user-card {
  background: linear-gradient(135deg, #007aff, #00b4ff);
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 122, 255, 0.3);

  .user-info {
    display: flex;
    align-items: center;

    .avatar-box {
      width: 100rpx;
      height: 100rpx;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .avatar-text {
        font-size: 40rpx;
        color: #fff;
        font-weight: bold;
      }
    }

    .user-detail {
      margin-left: 24rpx;

      .nickname {
        font-size: 36rpx;
        color: #fff;
        font-weight: bold;
      }

      .phone {
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.85);
        margin-top: 8rpx;
        display: block;
      }

      .verify-tag {
        display: inline-flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.2);
        padding: 4rpx 12rpx;
        border-radius: 12rpx;
        margin-top: 10rpx;

        .verify-text {
          font-size: 20rpx;
          color: #fff;
          margin-left: 6rpx;
        }
      }
    }
  }

  .car-info {
    display: flex;
    align-items: center;
    margin-top: 24rpx;
    padding-top: 24rpx;
    border-top: 1rpx solid rgba(255, 255, 255, 0.2);

    .car-text {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.85);
    }

    .plate-text {
      font-size: 26rpx;
      color: #fff;
      margin-left: 16rpx;
      font-weight: bold;
    }
  }
}

// 收入卡片
.income-section {
  margin-bottom: 30rpx;
}

.income-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .income-item {
    flex: 1;
    text-align: center;

    .income-label {
      font-size: 26rpx;
      color: #999;
      display: block;
    }

    .income-value {
      font-size: 36rpx;
      color: #333;
      font-weight: bold;
      margin-top: 10rpx;
      display: block;
    }
  }
}

// 快捷功能
.quick-section {
  margin-bottom: 30rpx;
}

.quick-grid {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  margin-top: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .quick-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .quick-icon-box {
      width: 80rpx;
      height: 80rpx;
      background: linear-gradient(135deg, #007aff, #00b4ff);
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12rpx;
    }

    .quick-label {
      font-size: 24rpx;
      color: #333;
    }
  }
}

// 进行中订单
.order-section {
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;

  .title-more {
    display: flex;
    align-items: center;

    .more-text {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.order-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .order-no {
      font-size: 26rpx;
      color: #666;
    }
  }

  .order-route {
    padding: 20rpx 0;
    border-top: 1rpx solid #f0f0f0;
    border-bottom: 1rpx solid #f0f0f0;

    .route-point {
      display: flex;
      align-items: flex-start;

      .point-icon-box {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12rpx;

        &.start {
          background: #e6f0ff;
          color: #007aff;
        }

        &.end {
          background: #e6fff0;
          color: #00b578;
        }
      }

      .point-text {
        font-size: 28rpx;
        color: #333;
        flex: 1;
        line-height: 40rpx;
      }
    }

    .route-line {
      width: 4rpx;
      height: 30rpx;
      background: #ddd;
      margin-left: 8rpx;
      margin-top: 8rpx;
      margin-bottom: 8rpx;
    }
  }

  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;

    .order-freight {
      font-size: 32rpx;
      color: #ff7a00;
      font-weight: bold;
    }

    .order-action {
      display: flex;
      align-items: center;

      .action-text {
        color: #007aff;
        font-size: 28rpx;
      }
    }
  }
}

.order-empty {
  background: #fff;
  border-radius: 24rpx;
  padding: 60rpx 30rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .empty-text {
    font-size: 28rpx;
    color: #999;
    display: block;
    margin-bottom: 30rpx;
  }

  .empty-btn {
    display: inline-block;
  }
}

// 公告
.notice-section {
  margin-bottom: 30rpx;
}

.notice-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .notice-icon-box {
    margin-right: 16rpx;
  }

  .notice-swiper {
    flex: 1;
    height: 40rpx;

    .notice-text {
      font-size: 26rpx;
      color: #666;
      line-height: 40rpx;
    }
  }
}
</style>
