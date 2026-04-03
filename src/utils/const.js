/**
 * 物流业务常量定义
 * 包含订单状态、货物类型、车辆类型、颜色规范等
 */

// ============ 订单状态枚举 ============
export const ORDER_STATUS = {
  PENDING: 0, // 待提货
  PICKED_UP: 1, // 已提货
  TRANSIT: 2, // 运输中
  DELIVERED: 3, // 已送达
  COMPLETED: 4, // 已完成
}

// ============ 订单状态配置（文本 + 颜色） ============
export const ORDER_STATUS_MAP = {
  [ORDER_STATUS.PENDING]: {
    label: '待提货',
    color: '#FF7A00',
    bgColor: 'rgba(255, 122, 0, 0.1)',
  },
  [ORDER_STATUS.PICKED_UP]: {
    label: '已提货',
    color: '#007AFF',
    bgColor: 'rgba(0, 122, 255, 0.1)',
  },
  [ORDER_STATUS.TRANSIT]: {
    label: '运输中',
    color: '#007AFF',
    bgColor: 'rgba(0, 122, 255, 0.1)',
  },
  [ORDER_STATUS.DELIVERED]: {
    label: '已送达',
    color: '#00B578',
    bgColor: 'rgba(0, 181, 120, 0.1)',
  },
  [ORDER_STATUS.COMPLETED]: {
    label: '已完成',
    color: '#00B578',
    bgColor: 'rgba(0, 181, 120, 0.1)',
  },
}

// ============ 货物类型 ============
export const CARGO_TYPES = [
  { value: 'building', label: '建材' },
  { value: 'furniture', label: '家具' },
  { value: 'appliance', label: '电器' },
  { value: 'food', label: '食品' },
  { value: 'clothing', label: '服装' },
  { value: 'machinery', label: '机械' },
  { value: 'other', label: '其他' },
]

// ============ 车辆类型 ============
export const VEHICLE_TYPES = [
  { value: 'van', label: '厢式货车' },
  { value: 'flatbed', label: '平板车' },
  { value: 'highbar', label: '高栏车' },
  { value: 'refrigerated', label: '冷藏车' },
  { value: 'minivan', label: '面包车' },
]

// ============ 车辆审核状态 ============
export const VEHICLE_STATUS = {
  REVIEWING: 0, // 审核中
  APPROVED: 1, // 已通过
  REJECTED: 2, // 已拒绝
}

export const VEHICLE_STATUS_MAP = {
  [VEHICLE_STATUS.REVIEWING]: { label: '审核中', color: '#FF7A00' },
  [VEHICLE_STATUS.APPROVED]: { label: '已通过', color: '#00B578' },
  [VEHICLE_STATUS.REJECTED]: { label: '已拒绝', color: '#FF4C4C' },
}

// ============ 颜色常量 ============
export const COLORS = {
  PRIMARY: '#007AFF',
  PRIMARY_LIGHT: '#00B4FF',
  SUCCESS: '#00B578',
  WARNING: '#FF7A00',
  ERROR: '#FF4C4C',
  GRADIENT: 'linear-gradient(135deg, #007AFF, #00B4FF)',
  BG_PAGE: '#F4F5F7',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#666666',
  TEXT_PLACEHOLDER: '#999999',
  BORDER: '#EEEEEE',
}

// ============ 底部 Tabbar 配置 ============
export const TABBAR_LIST = [
  { text: '首页', icon: 'home', activeIcon: 'home-fill' },
  { text: '抢单', icon: 'order', activeIcon: 'order-fill' },
  { text: '订单', icon: 'menu-list', activeIcon: 'menu-list-fill' },
  { text: '我的', icon: 'my', activeIcon: 'my-fill' },
]

// ============ 发票状态 ============
export const INVOICE_STATUS = {
  PENDING: 0, // 待审核
  ISSUED: 1, // 已开具
  REJECTED: 2, // 已拒绝
}

export const INVOICE_STATUS_MAP = {
  [INVOICE_STATUS.PENDING]: { label: '待审核', color: '#FF7A00' },
  [INVOICE_STATUS.ISSUED]: { label: '已开具', color: '#00B578' },
  [INVOICE_STATUS.REJECTED]: { label: '已拒绝', color: '#FF4C4C' },
}
