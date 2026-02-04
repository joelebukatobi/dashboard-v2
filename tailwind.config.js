/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/templates/**/*.html',
    './src/templates/**/*.js',
    './scss/**/*.scss',
  ],
  safelist: [
    // Preline tab active states
    'hs-tab-active:bg-white',
    'hs-tab-active:text-black',
    'hs-tab-active:shadow-sm',
    'dark:hs-tab-active:bg-white',
    'dark:hs-tab-active:text-grey-900',
    // Preline dropdown states
    'hs-dropdown-open:opacity-100',
    'hs-dropdown-open:visible',
    'hs-dropdown-open:scale-100',
    // Preline accordion states
    'hs-accordion-active:bg-blue-50',
    'hs-accordion-active:text-blue-600',
    // Add more as needed
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // 8-point numeric aliases for border radius
      borderRadius: {
        1: '0.8rem', // 8px
        2: '1.6rem', // 16px
        3: '2.4rem', // 24px
        4: '3.2rem', // 32px
      },
      // Extended max width
      maxWidth: {
        '8xl': '88rem',
      },
      // 8-point numeric aliases for font sizes
      // fontSize: {
      //   1: ['0.8rem', { lineHeight: '1rem' }], // 8px
      //   2: ['1.6rem', { lineHeight: '1.5rem' }], // 16px
      //   3: ['2.4rem', { lineHeight: '2rem' }], // 24px
      //   4: ['3.2rem', { lineHeight: '2.5rem' }], // 32px
      //   5: ['4rem', { lineHeight: '3rem' }], // 40px
      //   6: ['4.8rem', { lineHeight: '3.5rem' }], // 48px
      // },
      // Custom font family
      fontFamily: {
        sans: ["'Schibsted Grotesk'", 'system-ui', 'sans-serif'],
      },
      // Custom color palette
      colors: {
        // Grey - Neutral palette
        grey: {
          50: '#e9e9e9',
          100: '#d3d3d3',
          200: '#bcbcbc',
          300: '#a6a6a6',
          400: '#909090',
          500: '#7a7a7a',
          600: '#646464',
          700: '#4d4d4d',
          800: '#373737',
          900: '#212121',
        },
      },
      // Custom box shadows
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        card: '0 0 20px 0 rgba(76, 87, 125, 0.02)',
        dropdown: '0 10px 40px 10px rgba(140, 152, 164, 0.175)',
        sidebar: '4px 0 10px rgba(0, 0, 0, 0.05)',
      },
      // Custom transitions
      transitionDuration: {
        250: '250ms',
        350: '350ms',
      },
      // Z-index scale
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },
      // Animation keyframes
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      // Animations
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-up': 'slide-in-up 0.3s ease-out',
        'slide-in-down': 'slide-in-down 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
    // Breakpoints use Tailwind defaults (industry standard)
  },
  plugins: [
    // Preline plugin removed - Preline v2.x doesn't require Tailwind plugin
    // Custom plugin for additional utilities
    function ({ addUtilities, addComponents, theme }) {
      // Scrollbar utilities
      addUtilities({
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme('colors.grey.300')} ${theme('colors.grey.100')}`,
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
};
