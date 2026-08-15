/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './features/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#05050A',
          light: '#F4F4F7',
        },
        surface: {
          DEFAULT: '#101018',
          light: '#FFFFFF',
        },
        raised: {
          DEFAULT: '#181822',
          light: '#FFFFFF',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          light: 'rgba(10,10,20,0.08)',
        },
        ink: {
          DEFAULT: '#F5F5F8',
          light: '#0B0B10',
        },
        muted: {
          DEFAULT: '#8E8E9A',
          light: '#6B6B76',
        },
        faint: {
          DEFAULT: '#5C5C68',
          light: '#9A9AA5',
        },
        accent: {
          DEFAULT: '#7C5CFF',
          light: '#6D4AFF',
          soft: '#9C85FF',
        },
        accent2: {
          DEFAULT: '#4C8CFF',
          light: '#3D6FE0',
        },
        income: {
          DEFAULT: '#34D399',
          light: '#0F9D6E',
        },
        expense: {
          DEFAULT: '#FB7185',
          light: '#E11D48',
        },
        saving: {
          DEFAULT: '#60A5FA',
          light: '#2563EB',
        },
        warning: {
          DEFAULT: '#FBBF24',
          light: '#D97706',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        xl2: '28px',
      },
    },
  },
  plugins: [],
};
