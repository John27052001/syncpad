import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          hover: 'hsl(var(--surface-hover))',
          border: 'hsl(var(--surface-border))',
        },
        accent: 'hsl(var(--accent))',
        muted: 'hsl(var(--muted))',
      },
    },
  },
  plugins: [],
};
export default config;
