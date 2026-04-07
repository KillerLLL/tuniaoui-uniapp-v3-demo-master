<script lang="ts" setup>
/**
 * 优惠券页面
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getCouponListApi } from '@/api/driver'

// 优惠券列表
const couponList = ref([])

// 加载数据
const loadData = async () => {
  try {
    const res = await getCouponListApi()
    if (res.code === 200) {
      couponList.value = res.data
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 状态文本
const getStatusText = (status) => {
  const texts = { 0: '未使用', 1: '已使用', 2: '已过期' }
  return texts[status] || '未知'
}

// 状态颜色
const getStatusColor = (status) => {
  const colors = { 0: '#00b578', 1: '#999', 2: '#ff4c4c' }
  return colors[status] || '#999'
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="min-h-screen bg-gray-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="优惠券" />

    <!-- 页面内容 -->
    <view class="px-4 pb-8" style="padding-top: 180rpx">
      <view
        v-for="item in couponList"
        :key="item.id"
        class="card-press flex mb-6 rounded-3xl overflow-hidden shadow-sm"
        :class="{ 'opacity-60': item.status !== 0 }"
      >
        <!-- 优惠券左侧金额 -->
        <view class="w-55 bg-gradient-to-br from-orange-500 to-orange-400 p-6 flex flex-col items-center justify-center">
          <text class="text-white text-3xl font-bold">¥{{ item.amount }}</text>
          <text class="text-white/80 text-xs mt-2">{{ item.condition }}</text>
        </view>
        <!-- 优惠券右侧信息 -->
        <view class="flex-1 bg-white p-6 relative">
          <text class="text-gray-800 text-base font-bold block mb-2">{{ item.name }}</text>
          <text class="text-gray-400 text-xs block">有效期至 {{ item.expireTime }}</text>
          <view class="absolute top-4 right-4">
            <TnTag
              :type="item.status === 0 ? 'success' : item.status === 1 ? 'info' : 'danger'"
              size="sm"
            >
              {{ getStatusText(item.status) }}
            </TnTag>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <TnEmpty v-if="couponList.length === 0" mode="coupon" show-tips>
        <template #tips>
          <text class="text-gray-400 text-lg block mt-4">暂无优惠券</text>
        </template>
      </TnEmpty>
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
</style>
