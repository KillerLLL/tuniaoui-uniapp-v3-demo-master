<script setup>
import { ref } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { addVehicleApi } from '@/api/driver'
import { VEHICLE_TYPES } from '@/utils/const'

defineOptions({
  options: {
    virtualHost: true,
  },
})

// 表单数据
const formData = ref({
  plateNumber: '',
  vehicleType: '',
  vehicleLength: '',
  loadWeight: '',
  loadVolume: '',
})

// 提交loading状态
const submitting = ref(false)

// 车型选择器相关
const vehicleTypeRange = VEHICLE_TYPES.map((item) => item.label)
const vehicleTypeIndex = ref(-1)

// 选择车型
const onVehicleTypeChange = (e) => {
  const index = e.detail.value
  vehicleTypeIndex.value = index
  formData.value.vehicleType = VEHICLE_TYPES[index].value
}

// 表单校验
const validateForm = () => {
  if (!formData.value.plateNumber.trim()) {
    uni.showToast({ title: '请输入车牌号', icon: 'none' })
    return false
  }
  if (!formData.value.vehicleType) {
    uni.showToast({ title: '请选择车型', icon: 'none' })
    return false
  }
  if (!formData.value.vehicleLength.trim()) {
    uni.showToast({ title: '请输入车长', icon: 'none' })
    return false
  }
  if (!formData.value.loadWeight.trim()) {
    uni.showToast({ title: '请输入载重', icon: 'none' })
    return false
  }
  if (!formData.value.loadVolume.trim()) {
    uni.showToast({ title: '请输入载体积', icon: 'none' })
    return false
  }
  return true
}

// 提交新增车辆
const handleSubmit = async () => {
  if (!validateForm()) return
  submitting.value = true
  try {
    const res = await addVehicleApi({
      plateNumber: formData.value.plateNumber.trim(),
      vehicleType: formData.value.vehicleType,
      vehicleLength: formData.value.vehicleLength.trim(),
      loadWeight: formData.value.loadWeight.trim(),
      loadVolume: formData.value.loadVolume.trim(),
    })
    if (res.code === 200) {
      uni.showToast({ title: '添加成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  } catch (e) {
    uni.showToast({ title: e.message || '添加失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <view class="add-vehicle-page">
    <CustomNavbar title="新增车辆" />

    <view class="page-content">
      <!-- 表单区域 -->
      <view class="form-card">
        <!-- 车牌号 -->
        <view class="form-item">
          <text class="form-label">车牌号</text>
          <view class="form-input-wrap">
            <input
              v-model="formData.plateNumber"
              class="form-input"
              type="text"
              placeholder="请输入车牌号"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>

        <!-- 车型 -->
        <view class="form-item">
          <text class="form-label">车型</text>
          <view class="form-input-wrap">
            <picker
              :range="vehicleTypeRange"
              :value="vehicleTypeIndex"
              @change="onVehicleTypeChange"
            >
              <view class="picker-value">
                <text
                  class="picker-text"
                  :class="{ placeholder: vehicleTypeIndex < 0 }"
                >
                  {{ vehicleTypeIndex >= 0 ? vehicleTypeRange[vehicleTypeIndex] : '请选择车型' }}
                </text>
                <TnIcon name="right" color="#ccc" size="28" />
              </view>
            </picker>
          </view>
        </view>

        <!-- 车长 -->
        <view class="form-item">
          <text class="form-label">车长</text>
          <view class="form-input-wrap">
            <input
              v-model="formData.vehicleLength"
              class="form-input"
              type="digit"
              placeholder="请输入车长（如：4.2米）"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>

        <!-- 载重 -->
        <view class="form-item">
          <text class="form-label">载重</text>
          <view class="form-input-wrap">
            <input
              v-model="formData.loadWeight"
              class="form-input"
              type="digit"
              placeholder="请输入载重（如：5吨）"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>

        <!-- 载体积 -->
        <view class="form-item">
          <text class="form-label">载体积</text>
          <view class="form-input-wrap">
            <input
              v-model="formData.loadVolume"
              class="form-input"
              type="digit"
              placeholder="请输入载体积（如：15m³）"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-btn" :class="{ disabled: submitting }" @tap="handleSubmit">
        <text class="submit-text">{{ submitting ? '提交中...' : '提交' }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.add-vehicle-page {
  min-height: 100vh;
  background: #f4f5f7;

  .page-content {
    padding-top: calc(var(--status-bar-height) + 88rpx + 30rpx);
    padding-left: 30rpx;
    padding-right: 30rpx;
  }

  // 表单卡片
  .form-card {
    background: #fff;
    border-radius: 20rpx;
    padding: 0 30rpx;
    margin-bottom: 40rpx;

    .form-item {
      padding: 30rpx 0;
      border-bottom: 1rpx solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .form-label {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        margin-bottom: 16rpx;
        display: block;
      }

      .form-input-wrap {
        .form-input {
          height: 80rpx;
          font-size: 28rpx;
          color: #333;
          background: #f4f5f7;
          border-radius: 12rpx;
          padding: 0 24rpx;
        }

        .input-placeholder {
          color: #bbb;
          font-size: 28rpx;
        }

        .picker-value {
          height: 80rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f4f5f7;
          border-radius: 12rpx;
          padding: 0 24rpx;

          .picker-text {
            font-size: 28rpx;
            color: #333;

            &.placeholder {
              color: #bbb;
            }
          }
        }
      }
    }
  }

  // 提交按钮
  .submit-btn {
    height: 96rpx;
    background: linear-gradient(135deg, #007aff, #00b4ff);
    border-radius: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20rpx;

    &.disabled {
      opacity: 0.6;
    }

    .submit-text {
      font-size: 32rpx;
      font-weight: bold;
      color: #fff;
    }
  }
}
</style>
