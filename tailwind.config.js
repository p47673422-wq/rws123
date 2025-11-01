/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        krishna: {
          blue: '#1E40AF',
          saffron: '#FF9933',
          lotus: '#F9A8D4',
          gold: '#FCD34D',
          cream: '#FEF3C7',
        },
      },

      backgroundImage: {
        'gradient-spiritual': "linear-gradient(135deg, #FF9933 0%, #F9A8D4 50%, #1E40AF 100%)",
      },

      boxShadow: {
        'krishna-sm': '0 1px 2px rgba(30,64,175,0.06)',
        'krishna-md': '0 6px 18px rgba(30,64,175,0.10)',
        'krishna-lg': '0 20px 50px rgba(30,64,175,0.18)',
        'krishna-glow': '0 8px 30px rgba(249,168,212,0.12), 0 2px 6px rgba(30,64,175,0.06)'
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },

      animation: {
        fadeIn: 'fadeIn 400ms ease-out both',
        slideUp: 'slideUp 420ms cubic-bezier(0.2,0.8,0.2,1) both',
        float: 'float 3s ease-in-out infinite',
      },

      fontFamily: {
        heading: ['Cinzel', 'serif'],
        body: ['Inter', 'sans-serif'],
      },

      backdropBlur: {
        glass: '6px',
      },

      borderRadius: {
        '4xl': '2rem',
      },
    },
  },

  plugins: [
    // glassmorphism and utility helpers
    function ({ addUtilities }) {
      addUtilities({
        '.glass': {
          'background-color': 'rgba(255,255,255,0.36)',
          'backdrop-filter': 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
          'border': '1px solid rgba(255,255,255,0.6)'
        },
        '.glass-dark': {
          'background-color': 'rgba(6,7,28,0.36)',
          'backdrop-filter': 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
          'border': '1px solid rgba(255,255,255,0.04)'
        },
        '.krishna-gradient': {
          'background-image': "linear-gradient(135deg, var(--tw-gradient-stops))",
        }
      }, { variants: ['responsive'] });
    }
  ],
};
