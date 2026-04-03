<script setup>
import { ref, computed, onMounted } from 'vue'
import TnTabs from '@tuniao/tnui-vue3-uniapp/components/tabs/src/tabs.vue'
import TnTabsItem from '@tuniao/tnui-vue3-uniapp/components/tabs/src/tabs-item.vue'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { getCouponListApi } from '@/api/driver'

defineOptions({
  options: {
    virtualHost: true,
  },
})

const currentTab = ref(0)
const couponList = ref([])
const loading = ref(false)

// 根据Tab筛选优惠券列表
const filteredList = computed(() => {
  const now = new Date()
  if (currentTab.value === 0) {
    // 未使用：未使用且未过期
    return couponList.value.filter(
      (item) => !item.used && new Date(item.expireDate) >= now
    )
  }
  if (currentTab.value === 1) {
    // 已使用
    return couponList.value.filter((item) => item.used)
  }
  // 已过期：未使用但已过期
  return couponList.value.filter(
    (item) => !item.used && new Date(item.expireDate) < now
  )
})

// 获取优惠券列表
const fetchCouponList = async () => {
  loading.value = true
  try {
    const res = await getCouponListApi()
    couponList.value = res.data || []
  } catch (e) {
    uni.showToast({ title: '获取优惠券失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// Tab切换
const handleTabChange = (index) => {
  currentTab.value = index
}

onMounted(() => {
  fetchCouponList()
})
</script>

<template>
  <view class="coupon-page">
    <CustomNavbar title="我的优惠券" />

    <view class="page-content">
      <!-- Tab切换 -->
      <view class="tabs-wrap">
        <TnTabs v-model="currentTab" @change="handleTabChange">
          <TnTabsItem title="未使用" />
          <TnTabsItem title="已使用" />
          <TnTabsItem title="已过期" />
        </TnTabs>
      </view>

      <!-- 优惠券列表 -->
      <view v-if="filteredList.length > 0" class="coupon-list">
        <view
          v-for="item in filteredList"
          :key="item.id"
          class="coupon-card"
          :class="{ 'is-used': item.used || currentTab === 2 }"
        >
          <!-- 左侧金额 -->
          <view class="coupon-left">
            <text class="currency-sign">&#165;</text>
            <text class="coupon-amount">{{ item.amount }}</text>
          </view>

          <!-- 分割线装饰 -->
          <view class="coupon-divider">
            <view class="divider-circle top" />
            <view class="divider-line" />
            <view class="divider-circle bottom" />
          </view>

          <!-- 右侧信息 -->
          <view class="coupon-right">
            <text class="coupon-name">{{ item.name }}</text>
            <text class="coupon-condition">{{ item.condition }}</text>
            <text class="coupon-date">{{ item.expireDate }} 到期</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else-if="!loading" class="empty-state">
        <text class="empty-text">暂无优惠券</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.coupon-page {
  min-height: 100vh;
  background: #f4f5f7;

  .page-content {
    padding-top: calc(var(--status-bar-height) + 88rpx);

    .tabs-wrap {
      background: #fff;
    }
  }

  .coupon-list {
    padding: 24rpx;

    .coupon-card {
      display: flex;
      align-items: stretch;
      margin-bottom: 20rpx;
      background: #fff;
      border-radius: 16rpx;
      overflow: hidden;

      &.is-used {
        opacity: 0.55;
      }

      .coupon-left {
        width: 200rpx;
        display: flex;
        align-items: baseline;
        justify-content: center;
        padding: 30rpx 0;
        background: linear-gradient(135deg, #007aff, #00b4ff);
        flex-shrink: 0;

        .currency-sign {
          font-size: 28rpx;
          color: #fff;
          margin-right: 4rpx;
        }

        .coupon-amount {
          font-size: 56rpx;
          font-weight: bold;
          color: #fff;
        }
      }

      .coupon-divider {
        width: 40rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        .divider-circle {
          width: 20rpx;
          height: 20rpx;
          border-radius: 50%;
          background: #f4f5f7;
          position: absolute;

          &.top {
            top: -10rpx;
          }

          &.bottom {
            bottom: -10rpx;
          }
        }

        .divider-line {
          flex: 1;
          width: 2rpx;
          border-left: 2rpx dashed #ddd;
          margin: 20rpx 0;
        }
      }

      .coupon-right {
        flex: 1;
        padding: 24rpx 24rpx 24rpx 12rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .coupon-name {
          font-size: 30rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 8rpx;
        }

        .coupon-condition {
          font-size: 24rpx;
          color: #ff7a00;
          margin-bottom: 8rpx;
        }

        .coupon-date {
          font-size: 22rpx;
          color: #999;
        }
      }
    }
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;

    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}
</style>
