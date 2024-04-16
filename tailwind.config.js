import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons'

export default {
  content: [
    './modules/**/*.vue',
    './layouts/**/*.vue',
    './core/components/**/*.vue',
  ],
  theme: {
    extend: {
      colors: {
        'ice-cold': {
          50: '#f1fcfa',
          100: '#cff8ef',
          200: '#b6f4e8',
          300: '#66e2ce',
          400: '#37cab8',
          500: '#1eae9e',
          600: '#158c81',
          700: '#157069',
          800: '#165955',
          900: '#174a47',
          950: '#072c2c',
        },
      },
      boxShadow: {
        '3xl':
          '0px 4px 16px rgba(17, 17, 26, 0.1), 0px 8px 32px rgba(17, 17, 26, 0.05)',
      },
    },
    fontFamily: {
      sans: ['Inter'],
    },
    container: {
      // default breakpoints but with 40px removed
      screens: {
        sm: '540px',
        md: '720px',
        lg: '960px',
        xl: '1140px',
        '2xl': '1320px',
      },
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections([
        'material-symbols',
        'cif',
        'ri',
        'ep',
        'ic',
        'iconoir',
        'basil',
        'mdi',
      ]),
    }),
  ],
}
