/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: { extend: {} },
  // Tailwind v4 plugin registration
  plugins: {
    daisyui: {},
  },
  daisyui: {
    themes: ['light', 'dark'],
    darkTheme: 'dark',
  },
};