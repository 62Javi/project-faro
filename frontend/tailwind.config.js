/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        faro: {
          50: '#fff8f1',
          100: '#feeedc',
          200: '#fcdab7',
          300: '#f9bd87',
          400: '#f59651',
          500: '#f27426',
          600: '#e3581c',
          700: '#bc4119',
          800: '#95341c',
          900: '#792e1a',
          950: '#41140b',
        },
        navy: {
          800: '#0f172a',
          900: '#0a0f1d',
          950: '#050811',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
