/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00FF9D",
        primaryDark: "#00CC7D",
        primaryLight: "#33FFAD",
        danger: "#FF4C4C",
        dangerDark: "#CC3D3D",
        warning: "#FFB800",
        success: "#00E676",
        bgDark: "#000000",
        bgDarker: "#0A0A0A",
        bgLighter: "#1A1A1A",
        textWhite: "#FFFFFF",
        textGray: "#A0A0A0",
        textLight: "#F0F0F0",
        glass: {
          light: "rgba(255, 255, 255, 0.05)",
          medium: "rgba(255, 255, 255, 0.1)",
          dark: "rgba(255, 255, 255, 0.15)"
        }
      },
      fontFamily: {
        sans: ["SF Pro Display", "Inter", "sans-serif"],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-small': 'bounceSmall 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSmall: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(0, 255, 157, 0.2)',
        'glow-md': '0 0 30px rgba(0, 255, 157, 0.15)',
        'glow-lg': '0 0 50px rgba(0, 255, 157, 0.1)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  plugins: [],
}