<script setup>
import { ref, onMounted } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { getVehicleListApi } from '@/api/driver'
import { VEHICLE_STATUS_MAP } from '@/utils/const'

defineOptions({
  options: {
    virtualHost: true,
  },
})

// 车辆列表数据
const vehicleList = ref([])
const loading = ref(false)

// 获取车辆列表
const fetchVehicleList = async () => {
  loading.value = true
  try {
    const res = await getVehicleListApi()
    if (res.code === 200) {
      vehicleList.value = res.data || []
    }
  } catch (e) {
    uni.showToast({ title: '获取车辆列表失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 跳转新增车辆页面
const goAddVehicle = () => {
  uni.navigateTo({ url: '/biz-pages/driver/vehicle/add' })
}

// 获取车辆状态配置
const getStatusInfo = (status) => {
  return VEHICLE_STATUS_MAP[status] || { label: '未知', color: '#999' }
}

onMounted(() => {
  fetchVehicleList()
})
</script>

<template>
  <view class="vehicle-page">
    <CustomNavbar title="车辆管理" bgColor="#fff" textColor="#333">
      <template #default>
        <view class="nav-add-btn" @tap="goAddVehicle">
          <TnIcon name="add" color="#007AFF" size="40" />
          <text class="nav-add-text">新增</text>
        </view>
      </template>
    </CustomNavbar>

    <view class="page-content">
      <!-- 车辆卡片列表 -->
      <view v-for="item in vehicleList" :key="item.id" class="vehicle-card">
        <!-- 卡片头部：车牌号 + 状态标签 -->
        <view class="card-header">
          <view class="plate-number">
            <text class="plate-text">{{ item.plateNumber }}</text>
            <view
              v-if="item.defaultVehicle"
              class="default-tag"
            >
              <text class="default-tag-text">默认</text>
            </view>
          </view>
          <view
            class="status-tag"
            :style="{
              color: getStatusInfo(item.status).color,
              backgroundColor: getStatusInfo(item.status).color + '1a',
            }"
          >
            <text class="status-text">{{ getStatusInfo(item.status).label }}</text>
          </view>
        </view>

        <!-- 卡片内容：车辆详情 -->
        <view class="card-body">
          <view class="info-row">
            <view class="info-item">
              <text class="info-label">车型</text>
              <text class="info-value">{{ item.vehicleType }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">车长</text>
              <text class="info-value">{{ item.vehicleLength }}</text>
            </view>
          </view>
          <view class="info-row">
            <view class="info-item">
              <text class="info-label">载重</text>
              <text class="info-value">{{ item.loadWeight }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">载体积</text>
              <text class="info-value">{{ item.loadVolume }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && vehicleList.length === 0" class="empty-state">
        <TnIcon name="empty-data" size="120" color="#ccc" />
        <text class="empty-text">暂无车辆信息</text>
      </view>
    </view>

    <!-- 底部新增按钮 -->
    <view class="bottom-btn">
      <view class="add-btn" @tap="goAddVehicle">
        <TnIcon name="add" color="#fff" size="36" />
        <text class="add-btn-text">新增车辆</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.vehicle-page {
  min-height: 100vh;
  background: #f4f5f7;

  .page-content {
    padding-top: calc(var(--status-bar-height) + 88rpx + 30rpx);
    padding-left: 30rpx;
    padding-right: 30rpx;
    padding-bottom: 140rpx;
  }

  // 导航栏新增按钮
  .nav-add-btn {
    display: flex;
    align-items: center;

    .nav-add-text {
      font-size: 28rpx;
      color: #007aff;
      margin-left: 4rpx;
    }
  }

  // 车辆卡片
  .vehicle-card {
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 24rpx;

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24rpx;
      padding-bottom: 24rpx;
      border-bottom: 1rpx solid #f0f0f0;

      .plate-number {
        display: flex;
        align-items: center;

        .plate-text {
          font-size: 34rpx;
          font-weight: bold;
          color: #333;
        }

        .default-tag {
          margin-left: 16rpx;
          padding: 4rpx 16rpx;
          background: rgba(0, 122, 255, 0.1);
          border-radius: 8rpx;

          .default-tag-text {
            font-size: 22rpx;
            color: #007aff;
          }
        }
      }

      .status-tag {
        padding: 6rpx 20rpx;
        border-radius: 20rpx;

        .status-text {
          font-size: 24rpx;
        }
      }
    }

    .card-body {
      .info-row {
        display: flex;
        margin-bottom: 16rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .info-item {
          flex: 1;
          display: flex;
          align-items: center;

          .info-label {
            font-size: 26rpx;
            color: #999;
            margin-right: 12rpx;
          }

          .info-value {
            font-size: 26rpx;
            color: #333;
          }
        }
      }
    }
  }

  // 空状态
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 160rpx 0;

    .empty-text {
      font-size: 26rpx;
      color: #999;
      margin-top: 20rpx;
    }
  }

  // 底部按钮
  .bottom-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    background: #fff;
    box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
    z-index: 100;

    .add-btn {
      height: 88rpx;
      background: linear-gradient(135deg, #007aff, #00b4ff);
      border-radius: 44rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .add-btn-text {
        font-size: 30rpx;
        color: #fff;
        font-weight: bold;
        margin-left: 8rpx;
      }
    }
  }
}
</style>
