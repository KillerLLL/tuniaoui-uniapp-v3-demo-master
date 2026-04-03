<script lang="ts" setup>
/**
 * 货源详情页面
 */
import { ref, onMounted } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getGoodsDetailApi } from '@/api/shipper'

// 货源ID
const goodsId = ref('')

// 货源详情
const goodsDetail = ref(null)

// 加载数据
const loadData = async () => {
  try {
    const res = await getGoodsDetailApi(goodsId.value)
    if (res.code === 200) {
      goodsDetail.value = res.data
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || {}
  goodsId.value = options.id || '1'
  loadData()
})
</script>

<template>
  <view class="goods-detail-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="货源详情" />

    <!-- 页面内容 -->
    <view class="detail-content" v-if="goodsDetail">
      <!-- 状态 -->
      <view class="status-card">
        <text class="status-text">{{ goodsDetail.status }}</text>
      </view>

      <!-- 货物信息 -->
      <view class="info-section">
        <view class="section-title">货物信息</view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">货物类型</text>
            <text class="info-value">{{ goodsDetail.goodsType }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">重量</text>
            <text class="info-value">{{ goodsDetail.weight }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">体积</text>
            <text class="info-value">{{ goodsDetail.volume }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">数量</text>
            <text class="info-value">{{ goodsDetail.count }}件</text>
          </view>
        </view>
      </view>

      <!-- 装货信息 -->
      <view class="info-section">
        <view class="section-title">装货信息</view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">装货地址</text>
            <text class="info-value">{{ goodsDetail.loadingAddress }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">联系人</text>
            <text class="info-value">{{ goodsDetail.loadingContact }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">电话</text>
            <text class="info-value">{{ goodsDetail.loadingPhone }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">装货时间</text>
            <text class="info-value">{{ goodsDetail.loadingTime }}</text>
          </view>
        </view>
      </view>

      <!-- 卸货信息 -->
      <view class="info-section">
        <view class="section-title">卸货信息</view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">卸货地址</text>
            <text class="info-value">{{ goodsDetail.unloadingAddress }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">联系人</text>
            <text class="info-value">{{ goodsDetail.unloadingContact }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">电话</text>
            <text class="info-value">{{ goodsDetail.unloadingPhone }}</text>
          </view>
        </view>
      </view>

      <!-- 费用信息 -->
      <view class="info-section">
        <view class="section-title">费用信息</view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">期望运费</text>
            <text class="info-value primary">¥{{ goodsDetail.price }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.goods-detail-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.detail-content {
  padding: 180rpx 30rpx 30rpx;
}

.status-card {
  background: linear-gradient(135deg, #00b578, #00d68f);
  border-radius: 24rpx;
  padding: 30rpx;
  text-align: center;
  margin-bottom: 30rpx;

  .status-text {
    font-size: 32rpx;
    color: #fff;
    font-weight: bold;
  }
}

.info-section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.info-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 10rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .info-label {
    font-size: 28rpx;
    color: #999;
  }

  .info-value {
    font-size: 28rpx;
    color: #333;

    &.primary {
      color: #ff7a00;
      font-weight: bold;
    }
  }
}
</style>
