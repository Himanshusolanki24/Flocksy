/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--green-dark)',
        secondary: 'var(--green-mid)',
        accent: 'var(--green-light)',
        danger: 'var(--green-dark)',
        'green-dark': 'var(--green-dark)',
        'green-mid': 'var(--green-mid)',
        'green-light': 'var(--green-light)',
        'green-glow': 'var(--green-glow)',
        saffron: 'var(--saffron)',
        cream: 'var(--cream)',
        'text-dark': 'var(--text-dark)',
        'off-white': 'var(--off-white)',
      },
      fontFamily: {
        serif: ['"Fraunces"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
