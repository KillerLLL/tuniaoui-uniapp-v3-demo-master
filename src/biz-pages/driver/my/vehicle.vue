<script lang="ts" setup>
/**
 * 车辆管理页面
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getVehicleListApi } from '@/api/driver'

// 车辆列表
const vehicleList = ref([])

// 加载数据
const loadData = async () => {
  try {
    const res = await getVehicleListApi()
    if (res.code === 200) {
      vehicleList.value = res.data
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 添加车辆
const addVehicle = () => {
  uni.navigateTo({ url: '/biz-pages/driver/my/vehicle-detail' })
}

// 编辑车辆
const editVehicle = (id) => {
  uni.navigateTo({ url: `/biz-pages/driver/my/vehicle-detail?id=${id}` })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="min-h-screen bg-gray-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="车辆管理">
      <template #right>
        <view class="p-2 btn-press" @tap="addVehicle">
          <TnIcon name="add" size="40" />
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="px-4 pb-8" style="padding-top: 180rpx">
      <!-- 车辆列表 -->
      <view>
        <view
          v-for="item in vehicleList"
          :key="item.id"
          class="card-press bg-white rounded-3xl p-6 mb-6 shadow-sm"
          @tap="editVehicle(item.id)"
        >
          <!-- 卡片头部 -->
          <view class="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
            <view>
              <text class="text-gray-800 text-lg font-bold block mb-2">{{ item.carType }}</text>
              <text class="text-primary text-xl font-bold">{{ item.carPlate }}</text>
            </view>
            <view
              v-if="item.isDefault"
              class="bg-success text-white text-xs px-4 py-1 rounded-full"
            >
              默认
            </view>
          </view>
          <!-- 卡片内容 -->
          <view class="space-y-2">
            <view class="flex justify-between">
              <text class="text-gray-400 text-sm">车长</text>
              <text class="text-gray-800 text-sm">{{ item.carLength }}</text>
            </view>
            <view class="flex justify-between">
              <text class="text-gray-400 text-sm">载重</text>
              <text class="text-gray-800 text-sm">{{ item.maxLoad }}</text>
            </view>
            <view class="flex justify-between">
              <text class="text-gray-400 text-sm">容积</text>
              <text class="text-gray-800 text-sm">{{ item.volume }}</text>
            </view>
          </view>
          <!-- 卡片底部 -->
          <view class="mt-4 pt-4 border-t border-gray-100 text-right">
            <text class="text-primary text-xs">点击编辑</text>
          </view>
        </view>

        <!-- 空状态 -->
        <TnEmpty v-if="vehicleList.length === 0" mode="car" show-tips>
          <template #tips>
            <text class="text-gray-400 text-lg block mb-6">暂无车辆</text>
            <view class="inline-block">
              <TnButton type="primary" size="sm" shadow shape="round" @click="addVehicle">
                添加车辆
              </TnButton>
            </view>
          </template>
        </TnEmpty>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.card-press {
  transition: transform 0.15s ease;
}

.card-press:active {
  transform: scale(0.98);
}

.btn-press {
  transition: transform 0.15s ease;
}

.btn-press:active {
  transform: scale(0.95);
}

.text-primary {
  color: #3b82f6;
}

.bg-success {
  background-color: #10b981;
}
</style>
