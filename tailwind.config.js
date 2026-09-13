/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — Charcoal / Off-White-Creme. Strength · Focus · Authority
        primary: {
          50: '#F7F8F8',
          100: '#ECEEEE',
          200: '#D7DADA',
          300: '#BABEBF',
          400: '#9AA0A2',
          500: '#313435',
          600: '#272A2A',
          700: '#1D1F20',
          800: '#151616',
          900: '#0D0E0E',
          950: '#070707',
          DEFAULT: '#313435',
        },
        // Off-White / Creme, the paired light tone of the Primary palette
        creme: {
          50: '#F7F8F8',
          100: '#ECEEEE',
          DEFAULT: '#F7F8F8',
        },
        // Secondary — Teal. Clarity · Trust · Strategy
        secondary: {
          50: '#F3FCFC',
          100: '#E2F8F8',
          200: '#C1F1F0',
          300: '#93E6E5',
          400: '#61DBD9',
          500: '#155C5B',
          600: '#114A49',
          700: '#0D3737',
          800: '#092726',
          900: '#051818',
          950: '#030D0D',
          DEFAULT: '#155C5B',
        },
        // Olive. Formation · Stability · Sustainability
        olive: {
          50: '#F8F9F6',
          100: '#F0F1E9',
          200: '#DEE2D0',
          300: '#C6CCAD',
          400: '#ABB588',
          500: '#6C7549',
          600: '#565E3A',
          700: '#41462C',
          800: '#2D311F',
          900: '#1C1E13',
          950: '#0F100A',
          DEFAULT: '#6C7549',
        },
        // Lime. Illumination · Growth · New Possibilities
        lime: {
          50: '#FAFBF3',
          100: '#F2F7E4',
          200: '#E4EDC4',
          300: '#D0E09A',
          400: '#BAD16B',
          500: '#ACC84C',
          600: '#8EA934',
          700: '#6B7F27',
          800: '#4B591B',
          900: '#2E3711',
          950: '#191E09',
          DEFAULT: '#ACC84C',
        },
      },
    },
  },
  plugins: [],
}
