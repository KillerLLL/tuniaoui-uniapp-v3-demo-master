import { defineConfig, presetUno, presetIcons } from 'unocss'
import { presetUni } from '@uni-helper/unocss-preset-uni'

export default defineConfig({
  presets: [
    presetUni({
      autoImport: true,
    }),
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://cdn.jsdelivr.net/npm/',
    }),
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: '#3b82f6',
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      success: {
        DEFAULT: '#10b981',
        50: '#ecfdf5',
        100: '#d1fae5',
        500: '#10b981',
        600: '#059669',
      },
      warning: {
        DEFAULT: '#f59e0b',
        500: '#f59e0b',
        600: '#d97706',
      },
      danger: {
        DEFAULT: '#ef4444',
        500: '#ef4444',
        600: '#dc2626',
      },
      orange: {
        DEFAULT: '#f97316',
        50: '#fff7ed',
        100: '#ffedd5',
        500: '#f97316',
        600: '#ea580c',
      },
      emerald: {
        DEFAULT: '#10b981',
        50: '#ecfdf5',
        500: '#10b981',
        600: '#059669',
      },
      zinc: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
        950: '#09090b',
      },
    },
    boxShadow: {
      soft: '0 10px 30px -10px rgb(0 0 0 / 0.12), 0 4px 10px -4px rgb(0 0 0 / 0.08)',
      card: '0 2rpx 8rpx rgba(0, 0, 0, 0.04), 0 4rpx 16rpx rgba(0, 0, 0, 0.06)',
      'card-hover': '0 8rpx 24rpx -4px rgb(0 0 0 / 0.12), 0 4px 12px -4px rgb(0 0 0 / 0.08)',
      primary: '0 4px 12px rgba(0, 122, 255, 0.15), 0 8px 24px rgba(0, 122, 255, 0.25)',
      success: '0 4px 12px rgba(16, 185, 129, 0.15), 0 8px 24px rgba(16, 185, 129, 0.25)',
    },
    borderRadius: {
      card: '24rpx',
      btn: '16rpx',
      sm: '12rpx',
      lg: '20rpx',
      xl: '24rpx',
      '2xl': '32rpx',
      full: '9999rpx',
    },
  },
  shortcuts: {
    // 玻璃态卡片
    'glass-card': 'bg-white/85 backdrop-blur-xl border border-white/60 shadow-soft rounded-card',
    'glass-card-dark': 'bg-zinc-900/85 backdrop-blur-xl border border-zinc-700/60 shadow-soft rounded-card',
    // 纯白卡片
    'white-card': 'bg-white border border-zinc-200/50 shadow-card rounded-card',
    // 按钮按压
    'btn-press': 'transition-transform duration-150 cursor-pointer active:scale-95',
    // 卡片按压
    'card-press': 'transition-transform duration-150 cursor-pointer active:scale-98',
    // 安全区域
    'safe-top': 'pt-[calc(var(--status-bar-height,20px))]',
    'safe-bottom': 'pb-[calc(var(--status-bar-height,20px)+env(safe-area-inset-bottom))]',
    // Flex 工具
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-col-center': 'flex flex-col items-center justify-center',
    'flex-around': 'flex items-center justify-around',
    // 文字省略
    'text-ellipsis': 'truncate',
    // 文字超出省略
    'text-ellipsis-2': 'line-clamp-2',
    // 绝对定位
    'absolute-center': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'absolute-full': 'absolute inset-0',
  },
  rules: [
    // rpx 单位支持
    [/^(\d+)rpx$/, ([, d]) => ({ width: `${d}rpx`, height: `${d}rpx` })],
    // 字号
    [/^text-(\d+)rpx$/, ([, d]) => ({ 'font-size': `${d}rpx` })],
    // 间距
    [/^mb-(\d+)rpx$/, ([, d]) => ({ 'margin-bottom': `${d}rpx` })],
    [/^mt-(\d+)rpx$/, ([, d]) => ({ 'margin-top': `${d}rpx` })],
    [/^ml-(\d+)rpx$/, ([, d]) => ({ 'margin-left': `${d}rpx` })],
    [/^mr-(\d+)rpx$/, ([, d]) => ({ 'margin-right': `${d}rpx` })],
    [/^px-(\d+)rpx$/, ([, d]) => ({ 'padding-left': `${d}rpx`, 'padding-right': `${d}rpx` })],
    [/^py-(\d+)rpx$/, ([, d]) => ({ 'padding-top': `${d}rpx`, 'padding-bottom': `${d}rpx` })],
    [/^p-(\d+)rpx$/, ([, d]) => ({ 'padding': `${d}rpx` })],
    // 圆角
    [/^rounded-(\d+)rpx$/, ([, d]) => ({ 'border-radius': `${d}rpx` })],
  ],
})
