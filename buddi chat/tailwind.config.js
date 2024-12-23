/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // Ensures Tailwind scans your project files
  ],
  darkMode: 'class', // Enable dark mode using the "class" strategy
  theme: {
    screens: {
      xs: '360px', // For smaller phones
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    colors: {
      blue: '#1fb6ff',
      orange: '#ff5733',
      green: '#10b981',
      red: '#ef4444',
      gray: {
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      white: '#ffffff',
      black: '#000000',
    },
    fontFamily: {
      sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['Courier New', 'monospace'], // For timestamps or code snippets
    },
    extend: {
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'bubble': '1.5rem', // For chat bubbles
        '4xl': '2rem',
      },
      boxShadow: {
        'bubble': '0px 4px 6px rgba(0, 0, 0, 0.1)', // For message depth effect
      },
      animation: {
        bounce: 'bounce 1s infinite',
        fade: 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Simplifies styling forms
    require('@tailwindcss/typography'), // Improves the appearance of text
    require('tailwind-scrollbar'), // Customizes scrollbars
  ],
};
