import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        'field': {
          bg: '#252320',
          'bg-light': '#302c26',
          paper: '#e8e0d0',
          'paper-dark': '#c4b8a0',
          ink: '#2c2418',
          'ink-light': '#4a3f2e',
          red: '#8b2e2e',
          'red-light': '#a64444',
          gold: '#b8860b',
          'gold-light': '#d4a843',
          slate: '#5a5a5a',
          border: '#3a3530',
          purple: '#6b3a7d',
          'purple-light': '#8b5a9d',
          hand: '#a0522d',
        }
      },
      fontFamily: {
        'brush': ['"Ma Shan Zheng"', 'cursive'],
        'hand': ['"ZCOOL XiaoWei"', 'serif'],
        'serif-zh': ['"Noto Serif SC"', 'Source Han Serif SC', 'SimSun', 'serif'],
        'mono': ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E')",
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'stamp-in': 'stampIn 0.3s ease-out forwards',
        'ink-spread': 'inkSpread 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        stampIn: {
          '0%': { opacity: '0', transform: 'scale(1.3) rotate(-5deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        inkSpread: {
          '0%': { opacity: '0', transform: 'scaleX(0)' },
          '100%': { opacity: '1', transform: 'scaleX(1)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
