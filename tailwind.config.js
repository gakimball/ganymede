const plugin = require('tailwindcss/plugin');

const SIDEBAR_WIDTH = 'var(--App-sidebar-width)';
const ICON_SIZE = '16px'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    colors: {
      'content': '#fff',
      'content-secondary': '#AFB2B5',

      'background': '#222',
      'background-secondary': '#262626',
      'background-highlight': 'rgba(255, 255, 255, 0.1)',
      'background-overlay': 'rgba(0, 0, 0, 0.5)',

      'border': '#495057',

      'primary': 'var(--App-primary)',
      'danger': '#FF6B6A',

      'transparent': 'transparent',

      'syntax-red': '#e06c75',
      'syntax-orange': '#d19a66',
      'syntax-yellow': '#e6c07b',
      'syntax-green': '#98c379',
      'syntax-blue': '#61aeee',
      'syntax-purple': '#c678dd',
      'syntax-pink': '#c678dd',
      'syntax-gray': '#666',
    },
    fontFamily: {
      'sans': [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Helvetica',
        'Arial',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
      ],
      'mono': [
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace',
      ],
    },
    fontSize: {
      sm: ['14px', '21px'],
      base: ['16px', '24px'],
    },
    fontWeight: {
      normal: '400',
      bold: '700',
    },
    borderWidth: {
      0: '0px',
      1: '1px',
      2: '3px',
    },
    extend: {
      width: {
        sidebar: SIDEBAR_WIDTH,
        icon: ICON_SIZE,
      },
      height: {
        icon: ICON_SIZE,
      },
      size: {
        icon: ICON_SIZE,
      },
      padding: {
        sidebar: SIDEBAR_WIDTH,
      },
      margin: {
        sidebar: SIDEBAR_WIDTH,
      },
    }
  },
  plugins: [
    plugin(({ matchVariant }) => {
      matchVariant('var', value => `&[data-${value}=true]`)
    }),
  ],
}
