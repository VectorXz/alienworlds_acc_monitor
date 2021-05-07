const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    options: {
      safelist: [/^bg-/, /^text-/, /^lg/]
    }
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      blue: colors.blue,
      green: colors.green,
      yellow: colors.yellow
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
