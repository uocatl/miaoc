/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    {
      pattern: /(bg|text|border|from|to|ring|focus)-(yellow|purple|red|orange|blue)-(50|100|200|300|400|500|600|700)/,
      variants: ['hover', 'focus', 'disabled'],
    }
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            code: {
              backgroundColor: '#f4f4f4',
              padding: '2px 4px',
              borderRadius: '4px',
              fontSize: '0.9em',
            },
            pre: {
              backgroundColor: '#1e1e1e',
              padding: '1em',
              borderRadius: '8px',
              code: {
                backgroundColor: 'transparent',
                padding: 0,
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 