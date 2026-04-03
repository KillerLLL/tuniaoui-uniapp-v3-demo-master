<script lang="ts" setup>
/**
 * 发票申请页面
 */
import { ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { applyInvoiceApi } from '@/api/driver'

// 表单数据
const invoiceForm = ref({
  title: '',
  taxNo: '',
  amount: '',
  email: '',
})

// 提交
const handleSubmit = async () => {
  if (!invoiceForm.value.title) {
    uni.showToast({ title: '请输入发票抬头', icon: 'none' })
    return
  }
  if (!invoiceForm.value.taxNo) {
    uni.showToast({ title: '请输入税号', icon: 'none' })
    return
  }
  if (!invoiceForm.value.amount) {
    uni.showToast({ title: '请输入开票金额', icon: 'none' })
    return
  }
  try {
    uni.showLoading({ title: '提交中...' })
    const res = await applyInvoiceApi(invoiceForm.value)
    uni.hideLoading()
    if (res.code === 200) {
      uni.showToast({ title: '申请提交成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
    }
  } catch (e: any) {
    uni.hideLoading()
    uni.showToast({ title: e.message || '提交失败', icon: 'none' })
  }
}
</script>

<template>
  <view class="invoice-apply-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="申请发票">
      <template #right>
        <view class="navbar-right" @tap="handleSubmit">
          <text class="submit-text">提交</text>
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="apply-content">
      <!-- 表单 -->
      <view class="form-section">
        <view class="form-item">
          <text class="form-label">发票抬头</text>
          <input
            v-model="invoiceForm.title"
            class="form-input"
            placeholder="请输入公司名称"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="form-item">
          <text class="form-label">税号</text>
          <input
            v-model="invoiceForm.taxNo"
            class="form-input"
            placeholder="请输入统一社会信用代码"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="form-item">
          <text class="form-label">开票金额</text>
          <input
            v-model="invoiceForm.amount"
            class="form-input"
            type="digit"
            placeholder="请输入开票金额"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="form-item">
          <text class="form-label">邮箱</text>
          <input
            v-model="invoiceForm.email"
            class="form-input"
            type="text"
            placeholder="用于接收电子发票"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>

      <!-- 提示 -->
      <view class="tips-section">
        <text class="tips-title">温馨提示</text>
        <text class="tips-text">• 发票内容为运输服务费</text>
        <text class="tips-text">• 电子发票将在1-3个工作日内发送至邮箱</text>
        <text class="tips-text">• 如需纸质发票，请联系客服</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.invoice-apply-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.navbar-right {
  padding: 10rpx;

  .submit-text {
    font-size: 28rpx;
    color: #007aff;
    font-weight: bold;
  }
}

.apply-content {
  padding: 180rpx 30rpx 30rpx;
}

.form-section {
  background: #fff;
  border-radius: 24rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.form-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
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
    font-size: 30rpx;
    color: #333;
  }

  .input-placeholder {
    color: #bbb;
    font-size: 28rpx;
  }
}

.tips-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .tips-title {
    font-size: 28rpx;
    color: #333;
    font-weight: bold;
    display: block;
    margin-bottom: 16rpx;
  }

  .tips-text {
    font-size: 26rpx;
    color: #999;
    display: block;
    margin-bottom: 10rpx;
  }
}
</style>
