/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        primary: {
          DEFAULT: "#355872",
          50: "#f0f4f7",
          100: "#dae6ed",
          200: "#b8ceda",
          300: "#90b1c0",
          400: "#6a90a3",
          500: "#507285",
          600: "#355872",
          700: "#2a4559",
          800: "#1f3441",
          900: "#162632",
        },
        secondary: {
          DEFAULT: "#7AAACE",
          50: "#f1f7fc",
          100: "#e1eef8",
          200: "#c7dff1",
          300: "#a1c8e7",
          400: "#7AAACE",
          500: "#6294b8",
          600: "#4f7ea4",
          700: "#426987",
          800: "#39576f",
          900: "#32495c",
        },
        accent: {
          DEFAULT: "#9CD5FF",
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#b9e6fe",
          300: "#9CD5FF",
          400: "#7bc4ff",
          500: "#3b9dff",
          600: "#0078f2",
          700: "#0060d9",
          800: "#0051b4",
          900: "#004494",
        },
        background: {
          DEFAULT: "#F7F8F0",
          50: "#fefefc",
          100: "#F7F8F0",
          200: "#e8e9db",
          300: "#d9dac6",
          400: "#cacbb1",
          500: "#bbbc9c",
          600: "#acad87",
          700: "#9d9e72",
          800: "#8e8f5d",
          900: "#7f8048",
        },
      },
      fontFamily: {
        kufam: ["Kufam", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        primary: "0 4px 12px rgba(53, 88, 114, 0.3)",
        secondary: "0 4px 12px rgba(122, 170, 206, 0.3)",
        accent: "0 4px 12px rgba(156, 213, 255, 0.3)",
        soft: "0 2px 15px rgba(53, 88, 114, 0.1)",
        medium: "0 4px 25px rgba(53, 88, 114, 0.15)",
        strong: "0 8px 35px rgba(53, 88, 114, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "bounce-light": "bounceLight 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceLight: {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-5px)" },
          "60%": { transform: "translateY(-3px)" },
        },
      },
    },
  },
  plugins: [],
};
