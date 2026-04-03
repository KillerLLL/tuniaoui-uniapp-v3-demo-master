/**
 * 订单相关接口
 * 货源列表、抢单、订单列表、订单详情、状态变更
 */
import { post, get } from '@/utils/request'

// ============ 模拟数据 ============
const USE_MOCK = true

// 货源列表 mock 数据
const MOCK_CARGO_LIST = [
  {
    id: 'CGO20260403001',
    cargoType: '家具',
    cargoWeight: '3.5吨',
    cargoVolume: '8m³',
    pickupAddress: '上海市徐汇区漕河泾开发区',
    deliveryAddress: '上海市杨浦区五角场',
    distance: '18.3km',
    fee: 450.0,
    createTime: '5分钟前',
    urgency: false,
    grabCount: 3,
  },
  {
    id: 'CGO20260403002',
    cargoType: '建材',
    cargoWeight: '8.0吨',
    cargoVolume: '20m³',
    pickupAddress: '上海市松江区工业区',
    deliveryAddress: '上海市嘉定区汽车城',
    distance: '45.2km',
    fee: 1200.0,
    createTime: '12分钟前',
    urgency: true,
    grabCount: 1,
  },
  {
    id: 'CGO20260403003',
    cargoType: '电器',
    cargoWeight: '2.1吨',
    cargoVolume: '6m³',
    pickupAddress: '上海市浦东新区金桥出口加工区',
    deliveryAddress: '上海市普陀区真如镇',
    distance: '12.8km',
    fee: 380.0,
    createTime: '25分钟前',
    urgency: false,
    grabCount: 5,
  },
  {
    id: 'CGO20260403004',
    cargoType: '食品',
    cargoWeight: '1.5吨',
    cargoVolume: '4m³',
    pickupAddress: '上海市闵行区颛桥镇',
    deliveryAddress: '上海市长宁区中山公园',
    distance: '15.6km',
    fee: 320.0,
    createTime: '30分钟前',
    urgency: false,
    grabCount: 2,
  },
  {
    id: 'CGO20260403005',
    cargoType: '机械',
    cargoWeight: '12.0吨',
    cargoVolume: '30m³',
    pickupAddress: '上海市宝山区罗泾镇',
    deliveryAddress: '上海市奉贤区南桥镇',
    distance: '62.5km',
    fee: 2800.0,
    createTime: '1小时前',
    urgency: true,
    grabCount: 0,
  },
  {
    id: 'CGO20260403006',
    cargoType: '服装',
    cargoWeight: '0.8吨',
    cargoVolume: '3m³',
    pickupAddress: '上海市虹口区四川北路',
    deliveryAddress: '上海市静安区南京西路',
    distance: '5.2km',
    fee: 180.0,
    createTime: '1小时前',
    urgency: false,
    grabCount: 8,
  },
  {
    id: 'CGO20260403007',
    cargoType: '建材',
    cargoWeight: '5.0吨',
    cargoVolume: '15m³',
    pickupAddress: '上海市青浦区赵巷镇',
    deliveryAddress: '上海市黄浦区外滩',
    distance: '28.3km',
    fee: 680.0,
    createTime: '2小时前',
    urgency: false,
    grabCount: 4,
  },
  {
    id: 'CGO20260403008',
    cargoType: '其他',
    cargoWeight: '3.0吨',
    cargoVolume: '10m³',
    pickupAddress: '上海市金山区亭林镇',
    deliveryAddress: '上海市浦东新区陆家嘴',
    distance: '55.8km',
    fee: 1500.0,
    createTime: '3小时前',
    urgency: false,
    grabCount: 1,
  },
]

// 订单列表 mock 数据
const MOCK_ORDER_LIST = [
  {
    id: 'ORD20260403001',
    status: 2,
    cargoType: '建材',
    cargoWeight: '5.2吨',
    cargoVolume: '12m³',
    cargoRemark: '易碎品，小心轻放',
    pickupAddress: '上海市浦东新区张江高科',
    pickupContact: '张先生 138****1234',
    deliveryAddress: '上海市闵行区莘庄工业区',
    deliveryContact: '李女士 139****5678',
    distance: '35.6km',
    fee: 680.0,
    extraFee: 50.0,
    totalFee: 730.0,
    createTime: '2026-04-03 08:30',
    pickupTime: '2026-04-03 09:15',
    deliveryTime: null,
    completeTime: null,
    steps: [
      { title: '待提货', time: '04-03 08:30', done: true },
      { title: '已提货', time: '04-03 09:15', done: true },
      { title: '运输中', time: '04-03 09:30', done: true },
      { title: '已送达', time: '', done: false },
      { title: '已完成', time: '', done: false },
    ],
  },
  {
    id: 'ORD20260402008',
    status: 0,
    cargoType: '家具',
    cargoWeight: '3.5吨',
    cargoVolume: '8m³',
    cargoRemark: '注意防潮',
    pickupAddress: '上海市徐汇区漕河泾',
    pickupContact: '王先生 136****4321',
    deliveryAddress: '上海市宝山区大场镇',
    deliveryContact: '赵女士 137****8765',
    distance: '22.1km',
    fee: 450.0,
    extraFee: 0,
    totalFee: 450.0,
    createTime: '2026-04-02 16:45',
    pickupTime: null,
    deliveryTime: null,
    completeTime: null,
    steps: [
      { title: '待提货', time: '04-02 16:45', done: true },
      { title: '已提货', time: '', done: false },
      { title: '运输中', time: '', done: false },
      { title: '已送达', time: '', done: false },
      { title: '已完成', time: '', done: false },
    ],
  },
  {
    id: 'ORD20260401015',
    status: 4,
    cargoType: '电器',
    cargoWeight: '2.1吨',
    cargoVolume: '6m³',
    cargoRemark: '',
    pickupAddress: '上海市浦东新区金桥',
    pickupContact: '陈先生 135****9999',
    deliveryAddress: '上海市普陀区真如',
    deliveryContact: '刘女士 133****7777',
    distance: '12.8km',
    fee: 380.0,
    extraFee: 20.0,
    totalFee: 400.0,
    createTime: '2026-04-01 10:00',
    pickupTime: '2026-04-01 10:45',
    deliveryTime: '2026-04-01 12:00',
    completeTime: '2026-04-01 14:30',
    steps: [
      { title: '待提货', time: '04-01 10:00', done: true },
      { title: '已提货', time: '04-01 10:45', done: true },
      { title: '运输中', time: '04-01 11:00', done: true },
      { title: '已送达', time: '04-01 12:00', done: true },
      { title: '已完成', time: '04-01 14:30', done: true },
    ],
  },
  {
    id: 'ORD20260331022',
    status: 4,
    cargoType: '食品',
    cargoWeight: '1.5吨',
    cargoVolume: '4m³',
    cargoRemark: '冷链运输',
    pickupAddress: '上海市闵行区颛桥',
    pickupContact: '周先生 131****5555',
    deliveryAddress: '上海市长宁区中山公园',
    deliveryContact: '吴女士 132****3333',
    distance: '15.6km',
    fee: 320.0,
    extraFee: 80.0,
    totalFee: 400.0,
    createTime: '2026-03-31 14:20',
    pickupTime: '2026-03-31 15:00',
    deliveryTime: '2026-03-31 16:30',
    completeTime: '2026-03-31 18:00',
    steps: [
      { title: '待提货', time: '03-31 14:20', done: true },
      { title: '已提货', time: '03-31 15:00', done: true },
      { title: '运输中', time: '03-31 15:15', done: true },
      { title: '已送达', time: '03-31 16:30', done: true },
      { title: '已完成', time: '03-31 18:00', done: true },
    ],
  },
  {
    id: 'ORD20260330018',
    status: 3,
    cargoType: '机械',
    cargoWeight: '12.0吨',
    cargoVolume: '30m³',
    cargoRemark: '重型设备，需要叉车',
    pickupAddress: '上海市宝山区罗泾',
    pickupContact: '孙先生 130****1111',
    deliveryAddress: '上海市奉贤区南桥',
    deliveryContact: '郑女士 158****2222',
    distance: '62.5km',
    fee: 2800.0,
    extraFee: 200.0,
    totalFee: 3000.0,
    createTime: '2026-03-30 09:00',
    pickupTime: '2026-03-30 10:00',
    deliveryTime: '2026-03-30 14:30',
    completeTime: null,
    steps: [
      { title: '待提货', time: '03-30 09:00', done: true },
      { title: '已提货', time: '03-30 10:00', done: true },
      { title: '运输中', time: '03-30 10:30', done: true },
      { title: '已送达', time: '03-30 14:30', done: true },
      { title: '已完成', time: '', done: false },
    ],
  },
]

// ============ 接口方法 ============

/**
 * 获取货源列表（抢单大厅）
 * @param {Object} params - { tab: 0全部/1待抢单/2附近, keyword, pageNo, pageSize }
 */
export const getCargoListApi = (params = {}) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...MOCK_CARGO_LIST]
        // 按关键词筛选
        if (params.keyword) {
          list = list.filter(
            (item) =>
              item.pickupAddress.includes(params.keyword) ||
              item.deliveryAddress.includes(params.keyword) ||
              item.cargoType.includes(params.keyword)
          )
        }
        resolve({
          code: 200,
          data: { list, total: list.length },
        })
      }, 400)
    })
  }
  return get('/order/cargo/list', params)
}

/**
 * 抢单
 * @param {string} cargoId 货源ID
 */
export const grabOrderApi = (cargoId) => {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟80%成功率
        if (Math.random() > 0.2) {
          resolve({
            code: 200,
            data: { orderId: 'ORD' + Date.now(), message: '抢单成功' },
          })
        } else {
          reject(new Error('抢单失败，手慢了一步'))
        }
      }, 600)
    })
  }
  return post('/order/grab', { cargoId })
}

/**
 * 获取订单列表
 * @param {Object} params - { status, pageNo, pageSize }
 */
export const getOrderListApi = (params = {}) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...MOCK_ORDER_LIST]
        // 按状态筛选（status 不传或为空则返回全部）
        if (params.status !== undefined && params.status !== '') {
          list = list.filter((item) => item.status === params.status)
        }
        // 获取进行中的订单
        if (params.filterInProgress) {
          list = list.filter(
            (item) =>
              item.status === 0 ||
              item.status === 1 ||
              item.status === 2 ||
              item.status === 3
          )
        }
        resolve({
          code: 200,
          data: { list, total: list.length },
        })
      }, 400)
    })
  }
  return get('/order/list', params)
}

/**
 * 获取订单详情
 * @param {string} orderId 订单ID
 */
export const getOrderDetailApi = (orderId) => {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const order = MOCK_ORDER_LIST.find((item) => item.id === orderId)
        if (order) {
          resolve({ code: 200, data: order })
        } else {
          // 如果找不到就返回第一个作为演示
          resolve({ code: 200, data: MOCK_ORDER_LIST[0] })
        }
      }, 300)
    })
  }
  return get('/order/detail', { orderId })
}

/**
 * 更新订单状态
 * @param {string} orderId 订单ID
 * @param {number} status 新状态
 */
export const updateOrderStatusApi = (orderId, status) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: { message: '状态更新成功' },
        })
      }, 500)
    })
  }
  return post('/order/update-status', { orderId, status })
}
