/**
 * 常量定义
 * 包含订单状态、角色类型、用户类型等枚举
 */

// ============ 订单状态 ============
export const ORDER_STATUS = {
  PENDING: 0, // 待抢单
  GRABBED: 1, // 已抢单/待提货
  PICKED_UP: 2, // 已提货
  IN_TRANSIT: 3, // 运输中
  DELIVERED: 4, // 已送达
  COMPLETED: 5, // 已完成
  CANCELLED: 6, // 已取消
}

// 订单状态文本和颜色配置
export const ORDER_STATUS_CONFIG = {
  [ORDER_STATUS.PENDING]: { text: '待抢单', color: '#FF7A00' },
  [ORDER_STATUS.GRABBED]: { text: '待提货', color: '#007AFF' },
  [ORDER_STATUS.PICKED_UP]: { text: '已提货', color: '#00B4FF' },
  [ORDER_STATUS.IN_TRANSIT]: { text: '运输中', color: '#5856D6' },
  [ORDER_STATUS.DELIVERED]: { text: '已送达', color: '#00B578' },
  [ORDER_STATUS.COMPLETED]: { text: '已完成', color: '#00B578' },
  [ORDER_STATUS.CANCELLED]: { text: '已取消', color: '#999999' },
}

// ============ 角色类型 ============
export const ROLE_TYPE = {
  DRIVER: 'driver', // 司机
  SHIPPER: 'shipper', // 货主
}

// ============ 用户认证状态 ============
export const VERIFY_STATUS = {
  UNVERIFIED: 0, // 未认证
  PENDING: 1, // 审核中
  VERIFIED: 2, // 已认证
  REJECTED: 3, // 认证被拒
}

// ============ 车辆状态 ============
export const VEHICLE_STATUS = {
  PENDING: 0, // 审核中
  NORMAL: 1, // 正常
  DISABLED: 2, // 禁用
}

// ============ 发票状态 ============
export const INVOICE_STATUS = {
  PENDING: 0, // 待开票
  PROCESSING: 1, // 开票中
  COMPLETED: 2, // 已完成
  REJECTED: 3, // 已拒绝
}

// ============ 消息类型 ============
export const MESSAGE_TYPE = {
  SYSTEM: 1, // 系统消息
  ORDER: 2, // 订单消息
  ACTIVITY: 3, // 活动消息
}

// ============ 货物类型 ============
export const GOODS_TYPES = [
  { id: 1, name: '电子产品' },
  { id: 2, name: '家具家居' },
  { id: 3, name: '服装鞋帽' },
  { id: 4, name: '食品饮料' },
  { id: 5, name: '医药用品' },
  { id: 6, name: '机械设备' },
  { id: 7, name: '建材装饰' },
  { id: 8, name: '其他货物' },
]

// ============ 车辆类型 ============
export const CAR_TYPES = [
  { id: 1, name: '小型货车', length: '2.7-4.2米', load: '1-5吨' },
  { id: 2, name: '中型货车', length: '4.2-6.8米', load: '5-10吨' },
  { id: 3, name: '大型货车', length: '6.8-9.6米', load: '10-20吨' },
  { id: 4, name: '重型货车', length: '9.6米以上', load: '20吨以上' },
]

// ============ 地区数据（简化版） ============
export const PROVINCES = [
  { id: '110000', name: '北京市' },
  { id: '120000', name: '天津市' },
  { id: '130000', name: '河北省' },
  { id: '310000', name: '上海市' },
  { id: '320000', name: '江苏省' },
  { id: '330000', name: '浙江省' },
  { id: '440000', name: '广东省' },
]
