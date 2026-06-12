/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        paco: {
          bg: '#14112B',
          secondary: '#271B55',
          card: '#FFF8E7',
          accent: '#FFD447',
          correct: '#2ECC71',
          incorrect: '#FF4D4D',
        },
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        paco: '0 18px 50px rgba(0, 0, 0, 0.28)',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.96)', opacity: '0.5' },
          '70%': { transform: 'scale(1.04)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
        floatUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { transform: 'translateY(-28px)', opacity: '0' },
        },
      },
      animation: {
        pop: 'pop 260ms ease-out',
        shake: 'shake 260ms ease-out',
        floatUp: 'floatUp 900ms ease-out forwards',
      },
    },
  },
  plugins: [],
}
