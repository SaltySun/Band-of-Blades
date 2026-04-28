import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        // 战地档案主题色
        'field': {
          bg: '#1a1a1a',         // 深炭色背景
          'bg-light': '#2a2520', // 暖棕稍亮背景，确保卡片可见
          paper: '#e8e0d0',      // 泛黄纸张
          'paper-dark': '#c4b8a0',
          ink: '#2c2c2c',        // 墨迹
          'ink-light': '#4a4a4a',
          red: '#8b2e2e',        // 暗红（血/重点）
          'red-light': '#a64444',
          gold: '#b8860b',       // 暗金
          'gold-light': '#d4a843',
          slate: '#5a5a5a',      // 石板灰
          border: '#333333',     // 边框
          purple: '#6b3a7d',     // 暗紫（腐化/枯萎病）
          'purple-light': '#8b5a9d',
        }
      },
      fontFamily: {
        'serif-zh': ['Noto Serif SC', 'Source Han Serif SC', 'SimSun', 'serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E')",
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'line-grow': 'lineGrow 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.15)' },
        },
        lineGrow: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
