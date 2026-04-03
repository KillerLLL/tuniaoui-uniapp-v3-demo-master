<script lang="ts" setup>
/**
 * 车辆详情页面
 */
import { ref, onMounted } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getVehicleDetailApi, addVehicleApi, updateVehicleApi } from '@/api/driver'

// 车辆ID
const vehicleId = ref('')

// 是否编辑模式
const isEdit = ref(false)

// 车辆信息表单
const vehicleForm = ref({
  carType: '',
  carPlate: '',
  carLength: '',
  maxLoad: '',
  volume: '',
})

// 加载数据
const loadData = async () => {
  if (!vehicleId.value) return
  try {
    const res = await getVehicleDetailApi(vehicleId.value)
    if (res.code === 200 && res.data) {
      vehicleForm.value = {
        carType: res.data.carType,
        carPlate: res.data.carPlate,
        carLength: res.data.carLength,
        maxLoad: res.data.maxLoad,
        volume: res.data.volume,
      }
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 保存
const handleSave = async () => {
  if (!vehicleForm.value.carPlate) {
    uni.showToast({ title: '请输入车牌号', icon: 'none' })
    return
  }
  try {
    uni.showLoading({ title: '保存中...' })
    let res
    if (isEdit.value) {
      res = await updateVehicleApi(vehicleId.value, vehicleForm.value)
    } else {
      res = await addVehicleApi(vehicleForm.value)
    }
    uni.hideLoading()
    if (res.code === 200) {
      uni.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
    }
  } catch (e: any) {
    uni.hideLoading()
    uni.showToast({ title: e.message || '保存失败', icon: 'none' })
  }
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || {}
  vehicleId.value = options.id || ''
  isEdit.value = !!vehicleId.value
  if (isEdit.value) {
    loadData()
  }
})
</script>

<template>
  <view class="vehicle-detail-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar :title="isEdit ? '车辆详情' : '添加车辆'">
      <template #right>
        <view class="navbar-right" @tap="handleSave">
          <text class="save-text">保存</text>
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="detail-content">
      <!-- 表单 -->
      <view class="form-section">
        <view class="form-item">
          <text class="form-label">车牌号</text>
          <input
            v-model="vehicleForm.carPlate"
            class="form-input"
            placeholder="请输入车牌号"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="form-item">
          <text class="form-label">车辆类型</text>
          <input
            v-model="vehicleForm.carType"
            class="form-input"
            placeholder="如：中型货车"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="form-item">
          <text class="form-label">车长</text>
          <input
            v-model="vehicleForm.carLength"
            class="form-input"
            placeholder="如：6.8米"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="form-item">
          <text class="form-label">载重</text>
          <input
            v-model="vehicleForm.maxLoad"
            class="form-input"
            placeholder="如：10吨"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="form-item">
          <text class="form-label">容积</text>
          <input
            v-model="vehicleForm.volume"
            class="form-input"
            placeholder="如：40方"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>

      <!-- 提示 -->
      <view class="tips-section">
        <text class="tips-title">温馨提示</text>
        <text class="tips-text">• 请填写真实的车辆信息</text>
        <text class="tips-text">• 车辆信息审核通过后可接单</text>
        <text class="tips-text">• 如需修改，请联系客服</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.vehicle-detail-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.navbar-right {
  padding: 10rpx;

  .save-text {
    font-size: 28rpx;
    color: #007aff;
    font-weight: bold;
  }
}

.detail-content {
  padding: 180rpx 30rpx 30rpx;
}

.form-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 10rpx 0;
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
