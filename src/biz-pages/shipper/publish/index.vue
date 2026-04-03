<script lang="ts" setup>
/**
 * 发布货源页面
 */
import { ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { publishGoodsApi } from '@/api/shipper'

// 表单数据
const goodsForm = ref({
  goodsType: '',
  weight: '',
  volume: '',
  count: '',
  loadingAddress: '',
  loadingContact: '',
  loadingPhone: '',
  loadingTime: '',
  unloadingAddress: '',
  unloadingContact: '',
  unloadingPhone: '',
  price: '',
  remark: '',
})

// 提交
const handlePublish = async () => {
  if (!goodsForm.value.goodsType) {
    uni.showToast({ title: '请选择货物类型', icon: 'none' })
    return
  }
  if (!goodsForm.value.loadingAddress || !goodsForm.value.unloadingAddress) {
    uni.showToast({ title: '请填写装卸货地址', icon: 'none' })
    return
  }
  try {
    uni.showLoading({ title: '发布中...' })
    const res = await publishGoodsApi(goodsForm.value)
    uni.hideLoading()
    if (res.code === 200) {
      uni.showToast({ title: '发布成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
    }
  } catch (e: any) {
    uni.hideLoading()
    uni.showToast({ title: e.message || '发布失败', icon: 'none' })
  }
}
</script>

<template>
  <view class="publish-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="发布货源">
      <template #right>
        <view class="navbar-right" @tap="handlePublish">
          <text class="publish-text">发布</text>
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="publish-content">
      <!-- 货物信息 -->
      <view class="form-section">
        <view class="section-title">货物信息</view>
        <view class="form-item">
          <text class="form-label">货物类型</text>
          <input
            v-model="goodsForm.goodsType"
            class="form-input"
            placeholder="如：电子产品"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="form-row">
          <view class="form-item half">
            <text class="form-label">重量</text>
            <input
              v-model="goodsForm.weight"
              class="form-input"
              placeholder="如：2.5吨"
              placeholder-class="input-placeholder"
            />
          </view>
          <view class="form-item half">
            <text class="form-label">体积</text>
            <input
              v-model="goodsForm.volume"
              class="form-input"
              placeholder="如：10方"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>
        <view class="form-item">
          <text class="form-label">数量</text>
          <input
            v-model="goodsForm.count"
            class="form-input"
            placeholder="件数"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>

      <!-- 装货信息 -->
      <view class="form-section">
        <view class="section-title">装货信息</view>
        <view class="form-item">
          <text class="form-label">装货地址</text>
          <input
            v-model="goodsForm.loadingAddress"
            class="form-input"
            placeholder="请输入装货地址"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="form-row">
          <view class="form-item half">
            <text class="form-label">联系人</text>
            <input
              v-model="goodsForm.loadingContact"
              class="form-input"
              placeholder="姓名"
              placeholder-class="input-placeholder"
            />
          </view>
          <view class="form-item half">
            <text class="form-label">电话</text>
            <input
              v-model="goodsForm.loadingPhone"
              class="form-input"
              placeholder="手机号"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>
        <view class="form-item">
          <text class="form-label">装货时间</text>
          <input
            v-model="goodsForm.loadingTime"
            class="form-input"
            placeholder="如：2024-01-15 14:00"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>

      <!-- 卸货信息 -->
      <view class="form-section">
        <view class="section-title">卸货信息</view>
        <view class="form-item">
          <text class="form-label">卸货地址</text>
          <input
            v-model="goodsForm.unloadingAddress"
            class="form-input"
            placeholder="请输入卸货地址"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="form-row">
          <view class="form-item half">
            <text class="form-label">联系人</text>
            <input
              v-model="goodsForm.unloadingContact"
              class="form-input"
              placeholder="姓名"
              placeholder-class="input-placeholder"
            />
          </view>
          <view class="form-item half">
            <text class="form-label">电话</text>
            <input
              v-model="goodsForm.unloadingPhone"
              class="form-input"
              placeholder="手机号"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>
      </view>

      <!-- 费用信息 -->
      <view class="form-section">
        <view class="section-title">费用信息</view>
        <view class="form-item">
          <text class="form-label">期望运费</text>
          <input
            v-model="goodsForm.price"
            class="form-input"
            type="digit"
            placeholder="请输入期望运费"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="form-item">
          <text class="form-label">备注</text>
          <input
            v-model="goodsForm.remark"
            class="form-input"
            placeholder="如：易碎物品，小心轻放"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.publish-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.navbar-right {
  padding: 10rpx;

  .publish-text {
    font-size: 28rpx;
    color: #007aff;
    font-weight: bold;
  }
}

.publish-content {
  padding: 180rpx 30rpx 30rpx;
}

.form-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 10rpx 0;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  padding: 30rpx 30rpx 20rpx;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .form-label {
    width: 160rpx;
    font-size: 28rpx;
    color: #666;
    flex-shrink: 0;
  }

  .form-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    text-align: right;
  }

  .input-placeholder {
    color: #bbb;
    font-size: 28rpx;
  }

  &.half {
    .form-label {
      width: auto;
      margin-right: 10rpx;
    }
  }
}

.form-row {
  display: flex;

  .form-item.half {
    flex: 1;
    border-bottom: none;
  }
}
</style>
