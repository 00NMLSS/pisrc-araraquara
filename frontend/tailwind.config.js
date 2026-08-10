/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F172A',
          hover: '#020617',
          light: '#1E293B',
        },
        slate: {
          DEFAULT: '#64748B',
          muted: '#94A3B8',
          border: '#E2E8F0',
        },
        sage: {
          DEFAULT: '#059669',
          hover: '#047857',
          light: '#D1FAE5',
        },
        background: '#F8FAFC',
        surface: '#FFFFFF',
        status: {
          success: '#22C55E',
          warning: '#EAB308',
          error: '#EF4444',
          info: '#0EA5E9',
        },
      },
      fontFamily: {
        headline: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'elevation-sm': '0 1px 3px rgba(15, 23, 42, 0.03)',
        'elevation-md': '0 4px 16px rgba(15, 23, 42, 0.07)',
        'elevation-lg': '0 8px 32px rgba(15, 23, 42, 0.10)',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
      },
    },
  },
  plugins: [],
};
