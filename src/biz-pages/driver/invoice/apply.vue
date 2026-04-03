<script setup>
import { ref } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { applyInvoiceApi } from '@/api/driver'

defineOptions({
  options: {
    virtualHost: true,
  },
})

// 发票类型选项
const invoiceTypes = [
  { label: '增值税普通发票', value: 'normal' },
  { label: '增值税专用发票', value: 'special' },
]

// 表单数据
const formData = ref({
  invoiceType: 'normal',
  amount: '',
  headerName: '',
  taxNumber: '',
})

const showTypePicker = ref(false)
const submitting = ref(false)

// 当前选中的发票类型名称
const currentTypeName = () => {
  const found = invoiceTypes.find(
    (item) => item.value === formData.value.invoiceType
  )
  return found ? found.label : '请选择发票类型'
}

// 选择发票类型
const selectType = (item) => {
  formData.value.invoiceType = item.value
  showTypePicker.value = false
}

// 表单校验
const validateForm = () => {
  if (!formData.value.invoiceType) {
    uni.showToast({ title: '请选择发票类型', icon: 'none' })
    return false
  }
  if (!formData.value.amount || Number(formData.value.amount) <= 0) {
    uni.showToast({ title: '请输入有效金额', icon: 'none' })
    return false
  }
  if (!formData.value.headerName.trim()) {
    uni.showToast({ title: '请输入发票抬头', icon: 'none' })
    return false
  }
  if (!formData.value.taxNumber.trim()) {
    uni.showToast({ title: '请输入纳税人识别号', icon: 'none' })
    return false
  }
  return true
}

// 提交申请
const handleSubmit = async () => {
  if (!validateForm()) return
  submitting.value = true
  try {
    await applyInvoiceApi({
      invoiceType: formData.value.invoiceType,
      amount: Number(formData.value.amount),
      headerName: formData.value.headerName,
      taxNumber: formData.value.taxNumber,
    })
    uni.showToast({ title: '申请已提交', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    uni.showToast({ title: '提交失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <view class="apply-page">
    <CustomNavbar title="申请发票" />

    <view class="page-content">
      <!-- 表单区域 -->
      <view class="form-section">
        <!-- 发票类型 -->
        <view class="form-item" @tap="showTypePicker = true">
          <text class="form-label">发票类型</text>
          <view class="form-value">
            <text class="value-text">{{ currentTypeName() }}</text>
            <TnIcon name="right" color="#ccc" size="32" />
          </view>
        </view>

        <!-- 开票金额 -->
        <view class="form-item">
          <text class="form-label">开票金额</text>
          <view class="form-input-wrap">
            <text class="input-prefix">&#165;</text>
            <input
              v-model="formData.amount"
              class="form-input"
              type="digit"
              placeholder="请输入开票金额"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>

        <!-- 发票抬头 -->
        <view class="form-item">
          <text class="form-label">发票抬头</text>
          <view class="form-input-wrap">
            <input
              v-model="formData.headerName"
              class="form-input"
              type="text"
              placeholder="请输入发票抬头"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>

        <!-- 纳税人识别号 -->
        <view class="form-item">
          <text class="form-label">纳税人识别号</text>
          <view class="form-input-wrap">
            <input
              v-model="formData.taxNumber"
              class="form-input"
              type="text"
              placeholder="请输入纳税人识别号"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-area">
        <view
          class="submit-btn"
          :class="{ disabled: submitting }"
          @tap="handleSubmit"
        >
          <text class="submit-btn-text">
            {{ submitting ? '提交中...' : '提交申请' }}
          </text>
        </view>
      </view>
    </view>

    <!-- 发票类型选择弹窗 -->
    <view v-if="showTypePicker" class="picker-mask" @tap="showTypePicker = false">
      <view class="picker-popup" @tap.stop>
        <view class="picker-header">
          <text class="picker-title">选择发票类型</text>
        </view>
        <view
          v-for="item in invoiceTypes"
          :key="item.value"
          class="picker-item"
          :class="{ active: formData.invoiceType === item.value }"
          @tap="selectType(item)"
        >
          <text class="picker-item-text">{{ item.label }}</text>
          <TnIcon
            v-if="formData.invoiceType === item.value"
            name="success"
            color="#007AFF"
            size="36"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.apply-page {
  min-height: 100vh;
  background: #f4f5f7;

  .page-content {
    padding-top: calc(var(--status-bar-height) + 88rpx + 30rpx);
  }

  .form-section {
    margin: 0 24rpx;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;

    .form-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx 24rpx;
      border-bottom: 1rpx solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .form-label {
        font-size: 28rpx;
        color: #333;
        flex-shrink: 0;
        width: 180rpx;
      }

      .form-value {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .value-text {
          font-size: 28rpx;
          color: #666;
          margin-right: 10rpx;
        }
      }

      .form-input-wrap {
        flex: 1;
        display: flex;
        align-items: center;

        .input-prefix {
          font-size: 30rpx;
          font-weight: bold;
          color: #333;
          margin-right: 8rpx;
        }

        .form-input {
          flex: 1;
          height: 48rpx;
          font-size: 28rpx;
          color: #333;
          text-align: right;
        }

        .input-placeholder {
          color: #ccc;
          font-size: 28rpx;
        }
      }
    }
  }

  .submit-area {
    padding: 60rpx 24rpx 0;

    .submit-btn {
      height: 96rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #007aff, #00b4ff);
      border-radius: 48rpx;

      &.disabled {
        opacity: 0.6;
      }

      .submit-btn-text {
        font-size: 32rpx;
        font-weight: bold;
        color: #fff;
      }
    }
  }

  // 类型选择弹窗
  .picker-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: flex-end;

    .picker-popup {
      width: 100%;
      background: #fff;
      border-radius: 24rpx 24rpx 0 0;
      padding-bottom: env(safe-area-inset-bottom);

      .picker-header {
        padding: 30rpx;
        text-align: center;
        border-bottom: 1rpx solid #f0f0f0;

        .picker-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
        }
      }

      .picker-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30rpx;
        border-bottom: 1rpx solid #f5f5f5;

        &:last-child {
          border-bottom: none;
        }

        &.active {
          .picker-item-text {
            color: #007aff;
            font-weight: bold;
          }
        }

        .picker-item-text {
          font-size: 30rpx;
          color: #333;
        }
      }
    }
  }
}
</style>
