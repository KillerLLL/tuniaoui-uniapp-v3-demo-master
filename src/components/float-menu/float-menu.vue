<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'

interface MenuItem {
  id: string | number
  name: string
  icon: string
  color?: string
  pageIndex?: number
}

interface Props {
  show?: boolean
  menuData?: MenuItem[]
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'menu-click', item: MenuItem): void
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  menuData: () => [],
})

const emit = defineEmits<Emits>()

// 悬浮按钮位置
const buttonPosition = ref({ x: 0, y: 0 })
// 菜单展开状态
const menuExpanded = ref(false)
// 拖拽状态
const isDragging = ref(false)
const dragStartTime = ref(0)
const dragStartPos = ref({ x: 0, y: 0 })
const buttonStartPos = ref({ x: 0, y: 0 })

// 系统信息
const systemInfo = ref({
  windowWidth: 375,
  windowHeight: 667,
  statusBarHeight: 44,
})

// 按钮尺寸 (缩小到合理大小)
const BUTTON_SIZE = 50
const MENU_ITEM_SIZE = 44
const MENU_ITEM_SPACING = 10
const BUTTON_MARGIN = 10

onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      systemInfo.value = {
        windowWidth: res.windowWidth,
        windowHeight: res.windowHeight,
        statusBarHeight: res.statusBarHeight || 44,
      }
      // 初始位置在右下角
      buttonPosition.value = {
        x: res.windowWidth - BUTTON_SIZE - BUTTON_MARGIN,
        y: res.windowHeight - BUTTON_SIZE * 3.5,
      }
    },
  })
})

// 判断按钮在屏幕哪一侧
const isOnLeftSide = computed(() => {
  const centerX = buttonPosition.value.x + BUTTON_SIZE / 2
  return centerX < systemInfo.value.windowWidth / 2
})

// 判断按钮靠近顶部还是底部
const isNearTop = computed(() => {
  return buttonPosition.value.y < systemInfo.value.windowHeight / 2
})

// 菜单展开方向
const menuDirection = computed(() => {
  return isOnLeftSide.value ? 'right' : 'left'
})

// 菜单项位置
const getMenuStyle = (index: number) => {
  const offset = (index + 1) * (MENU_ITEM_SIZE + MENU_ITEM_SPACING)
  const isVertical = isNearTop.value

  let transform = ''
  if (isVertical) {
    // 向下展开
    transform = `translateY(${offset}px)`
  } else {
    // 向上展开
    transform = `translateY(-${offset}px)`
  }

  return {
    transform,
    opacity: menuExpanded.value ? 1 : 0,
  }
}

// 获取菜单项的渐变类名
const getMenuItemClass = (item: MenuItem) => {
  if (item.color?.startsWith('tn-gradient-bg')) {
    return item.color
  }
  return 'tn-gradient-bg__cool-5'
}

// 触摸开始
const onTouchStart = (e: any) => {
  isDragging.value = false
  dragStartTime.value = Date.now()
  dragStartPos.value = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY,
  }
  buttonStartPos.value = { ...buttonPosition.value }
}

// 触摸移动
const onTouchMove = (e: any) => {
  // 展开状态下禁止拖拽
  if (menuExpanded.value) return

  const deltaX = e.touches[0].clientX - dragStartPos.value.x
  const deltaY = e.touches[0].clientY - dragStartPos.value.y

  // 判断是否是拖拽（移动超过10px）
  if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
    isDragging.value = true
  }

  if (!isDragging.value) return

  let newX = buttonStartPos.value.x + deltaX
  let newY = buttonStartPos.value.y + deltaY

  // 限制在屏幕范围内
  const maxX = systemInfo.value.windowWidth - BUTTON_SIZE
  const maxY = systemInfo.value.windowHeight - BUTTON_SIZE

  newX = Math.max(0, Math.min(newX, maxX))
  newY = Math.max(0, Math.min(newY, maxY))

  buttonPosition.value = { x: newX, y: newY }
}

// 触摸结束
const onTouchEnd = () => {
  if (isDragging.value) {
    // 自动吸附到左右边缘
    const centerX = buttonPosition.value.x + BUTTON_SIZE / 2
    const screenWidth = systemInfo.value.windowWidth

    if (centerX < screenWidth / 2) {
      buttonPosition.value.x = BUTTON_MARGIN
    } else {
      buttonPosition.value.x = screenWidth - BUTTON_SIZE - BUTTON_MARGIN
    }
    isDragging.value = false
    return
  }

  // 没有拖拽，视为点击 → 切换菜单
  menuExpanded.value = !menuExpanded.value
}

// 点击菜单项
const onMenuClick = (item: MenuItem) => {
  menuExpanded.value = false
  emit('menu-click', item)
}

// 点击遮罩
const onMaskClick = () => {
  menuExpanded.value = false
}
</script>

// #ifdef MP-WEIXIN
<script lang="ts">
export default {
  options: {
    virtualHost: true,
  },
}
</script>
// #endif

<template>
  <view v-if="show" class="float-menu-container">
    <!-- 遮罩层 -->
    <view
      v-if="menuExpanded"
      class="menu-mask"
      @tap="onMaskClick"
    />

    <!-- 菜单容器 -->
    <view
      v-if="menuExpanded"
      class="menu-container"
      :class="{
        'menu-left': isOnLeftSide,
        'menu-right': !isOnLeftSide,
        'menu-top': isNearTop,
        'menu-bottom': !isNearTop,
      }"
      :style="{
        left: `${buttonPosition.x}px`,
        top: `${buttonPosition.y}px`,
      }"
    >
      <view
        v-for="(item, index) in props.menuData"
        :key="item.id"
        class="menu-item"
        :style="getMenuStyle(index)"
        @tap="onMenuClick(item)"
      >
        <view class="menu-item-inner" :class="getMenuItemClass(item)">
          <TnIcon :name="item.icon" color="#fff" :size="24" />
        </view>
      </view>
    </view>

    <!-- 悬浮按钮 -->
    <view
      class="float-button"
      :class="{
        'btn-expanded': menuExpanded,
      }"
      :style="{
        left: `${buttonPosition.x}px`,
        top: `${buttonPosition.y}px`,
        width: `${BUTTON_SIZE}px`,
        height: `${BUTTON_SIZE}px`,
      }"
      @touchstart.stop="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend.stop="onTouchEnd"
    >
      <view class="button-inner" :class="{ 'btn-inner-expanded': menuExpanded }">
        <TnIcon
          :name="menuExpanded ? 'reduce-circle' : 'add'"
          color="#fff"
          :size="menuExpanded ? 22 : 24"
        />
      </view>
      <!-- 脉冲动画 -->
      <view v-if="!menuExpanded" class="button-pulse" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.float-menu-container {
  position: fixed;
  z-index: 10000;
  pointer-events: none;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  overflow: hidden;
}

// 遮罩层
.menu-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10000;
  pointer-events: auto;
}

// 菜单容器
.menu-container {
  position: fixed;
  z-index: 10001;
  pointer-events: none;
  width: 0;
  height: 0;

  .menu-item {
    position: absolute;
    pointer-events: auto;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);

    .menu-item-inner {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
      position: relative;
    }
  }

  // 靠左侧时，菜单项在右边
  &.menu-left .menu-item {
    left: 0;
    top: 0;
  }

  // 靠右侧时，菜单项在左边
  &.menu-right .menu-item {
    right: 0;
    top: 0;
  }
}

// 悬浮按钮
.float-button {
  position: fixed;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10002;
  pointer-events: auto;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55),
              box-shadow 0.3s ease;

  // 按钮内部 - 使用图鸟渐变色
  .button-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  // 未展开状态 - 蓝紫渐变
  .button-inner:not(.btn-inner-expanded) {
    background-image: linear-gradient(135deg, #40a0f7 0%, #4866e6 100%);
  }

  // 展开状态 - 粉橙渐变
  .button-inner.btn-inner-expanded {
    background-image: linear-gradient(135deg, #f5317f 0%, #ff7c6e 100%);
    transform: rotate(45deg);
  }

  // 脉冲效果
  .button-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background-image: linear-gradient(135deg, #40a0f7 0%, #4866e6 100%);
    opacity: 0.4;
    z-index: 0;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.4;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.3);
      opacity: 0.1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.4;
    }
  }

  // 点击效果
  &:active .button-inner:not(.btn-inner-expanded) {
    transform: scale(0.95);
  }

  &:active .button-inner.btn-inner-expanded {
    transform: scale(0.95) rotate(45deg);
  }
}

// 图鸟渐变色类
.tn-gradient-bg__cool-3 {
  background-image: linear-gradient(135deg, #a26ffc 0%, #9d12ff 100%);
}

.tn-gradient-bg__cool-5 {
  background-image: linear-gradient(135deg, #40a0f7 0%, #4866e6 100%);
}

.tn-gradient-bg__cool-6 {
  background-image: linear-gradient(135deg, #209cff 0%, #68e0cf 100%);
}
</style>
