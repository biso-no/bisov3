const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-museo)", ...fontFamily.sans],
        heading: ["var(--font-museo)", ...fontFamily.sans],
        mono: ["JetBrains Mono", ...fontFamily.mono],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          // Company primary color variations
          100: "#001731",
          90: "#001f42",
          80: "#002753",
          70: "#002f64",
          60: "#003775",
          50: "#003f86",
          40: "#004797",
          30: "#004fa8",
          20: "#0057b9",
          10: "#005fca",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          // Company secondary color variations
          100: "#3DA9E0",
          90: "#51b2e3",
          80: "#65bce6",
          70: "#79c5e9",
          60: "#8dcfec",
          50: "#a1d8ef",
          40: "#b5e2f2",
          30: "#c9ebf5",
          20: "#ddf5f8",
          10: "#f1fafb",
        },
        // Sister company blues
        blue: {
          strong: "#002341",
          default: "#01417B",
          accent: "#1A77E9",
          subtle: "#E6F2FA",
          muted: "#F2F9FC",
        },
        // Sister company golds
        gold: {
          strong: "#BD9E16",
          default: "#F7D64A",
          accent: "#FFE98C",
          subtle: "#ffefa8",
          muted: "#fffae3",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        linkedin: {
          DEFAULT: "#0077B5",
          light: "#0084c7",
          dark: "#005e93"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))"
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        wave: {
          '0%': { transform: 'rotate(0.0deg)' },
          '10%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '30%': { transform: 'rotate(14deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10.0deg)' },
          '60%': { transform: 'rotate(0.0deg)' },
          '100%': { transform: 'rotate(0.0deg)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
        float: 'float 6s ease-in-out infinite',
        pulse: 'pulse 3s ease-in-out infinite',
        wave: 'wave 3s ease-in-out infinite',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(var(--primary-rgb), 0.35)',
        'glow-blue': '0 0 25px rgba(26, 119, 233, 0.4)',
        'glow-gold': '0 0 25px rgba(247, 214, 74, 0.4)',
        'card-hover': '0 10px 30px -5px rgba(0, 23, 49, 0.3)',
        'card-gold': '0 10px 30px -5px rgba(189, 158, 22, 0.2)',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
        },
        '.text-shadow-md': {
          textShadow: '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
        },
        '.text-shadow-lg': {
          textShadow: '0 15px 30px rgba(0,0,0,0.11), 0 5px 15px rgba(0,0,0,0.08)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
        '.glass': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
        '.glass-dark': {
          background: 'rgba(0, 23, 49, 0.75)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          border: '1px solid rgba(61, 169, 224, 0.08)',
        },
        '.gradient-border': {
          position: 'relative',
          border: 'double 1px transparent',
          backgroundImage: 'linear-gradient(#001731, #001731), linear-gradient(to right, #3DA9E0, #1A77E9)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'content-box, border-box',
        },
        '.gradient-text': {
          background: 'linear-gradient(90deg, #3DA9E0 0%, #1A77E9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        '.gradient-text-gold': {
          background: 'linear-gradient(90deg, #F7D64A 0%, #BD9E16 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
      }
      addUtilities(newUtilities)
    },
    function({ addBase, theme }) {
      addBase({
        ':root': {
          '--background': '210 100% 10%',
          '--foreground': '210 40% 98%',
          '--card': '210 100% 10%',
          '--card-foreground': '210 40% 98%',
          '--popover': '210 100% 10%',
          '--popover-foreground': '210 40% 98%',
          '--primary': '210 100% 10%',
          '--primary-foreground': '210 40% 98%',
          '--secondary': '203 70% 56%',
          '--secondary-foreground': '210 40% 98%',
          '--muted': '210 40% 20%',
          '--muted-foreground': '210 40% 70%',
          '--accent': '212 75% 51%',
          '--accent-foreground': '210 40% 98%',
          '--destructive': '0 62.8% 30.6%',
          '--destructive-foreground': '210 40% 98%',
          '--border': '215 27.9% 16.9%',
          '--input': '215 27.9% 16.9%',
          '--ring': '203 70% 56%',
          '--radius': '0.8rem',
          '--primary-rgb': '0, 23, 49',
        },
      })
    },
  ],
}
