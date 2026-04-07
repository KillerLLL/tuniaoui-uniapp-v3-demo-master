<script lang="ts" setup>
/**
 * 车辆详情页面
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import {
  addVehicleApi,
  getVehicleDetailApi,
  updateVehicleApi,
} from '@/api/driver'

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
  <view class="min-h-screen bg-gray-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar :title="isEdit ? '车辆详情' : '添加车辆'">
      <template #right>
        <view class="p-2 btn-press" @tap="handleSave">
          <text class="text-primary text-sm font-bold">保存</text>
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="px-4 pb-8" style="padding-top: 180rpx">
      <!-- 表单 -->
      <view class="bg-white rounded-3xl mb-6 shadow-sm overflow-hidden">
        <view class="form-item flex items-center p-6 border-b border-gray-100">
          <text class="w-40 text-gray-500 text-sm flex-shrink-0">车牌号</text>
          <input
            v-model="vehicleForm.carPlate"
            class="flex-1 text-gray-800 text-sm"
            placeholder="请输入车牌号"
            placeholder-class="text-gray-300"
          />
        </view>
        <view class="form-item flex items-center p-6 border-b border-gray-100">
          <text class="w-40 text-gray-500 text-sm flex-shrink-0">车辆类型</text>
          <input
            v-model="vehicleForm.carType"
            class="flex-1 text-gray-800 text-sm"
            placeholder="如：中型货车"
            placeholder-class="text-gray-300"
          />
        </view>
        <view class="form-item flex items-center p-6 border-b border-gray-100">
          <text class="w-40 text-gray-500 text-sm flex-shrink-0">车长</text>
          <input
            v-model="vehicleForm.carLength"
            class="flex-1 text-gray-800 text-sm"
            placeholder="如：6.8米"
            placeholder-class="text-gray-300"
          />
        </view>
        <view class="form-item flex items-center p-6 border-b border-gray-100">
          <text class="w-40 text-gray-500 text-sm flex-shrink-0">载重</text>
          <input
            v-model="vehicleForm.maxLoad"
            class="flex-1 text-gray-800 text-sm"
            placeholder="如：10吨"
            placeholder-class="text-gray-300"
          />
        </view>
        <view class="form-item flex items-center p-6">
          <text class="w-40 text-gray-500 text-sm flex-shrink-0">容积</text>
          <input
            v-model="vehicleForm.volume"
            class="flex-1 text-gray-800 text-sm"
            placeholder="如：40方"
            placeholder-class="text-gray-300"
          />
        </view>
      </view>

      <!-- 提示 -->
      <view class="bg-white rounded-3xl p-6 shadow-sm">
        <text class="text-gray-800 text-sm font-bold block mb-4">温馨提示</text>
        <view class="space-y-2">
          <text class="text-gray-400 text-xs block">• 请填写真实的车辆信息</text>
          <text class="text-gray-400 text-xs block">• 车辆信息审核通过后可接单</text>
          <text class="text-gray-400 text-xs block">• 如需修改，请联系客服</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.btn-press {
  transition: transform 0.15s ease;
}

.btn-press:active {
  transform: scale(0.95);
}

.text-primary {
  color: #3b82f6;
}
</style>
