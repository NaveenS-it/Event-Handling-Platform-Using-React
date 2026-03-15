/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['selector', '[data-theme="dark"]'],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563eb', // sleek blue
                    hover: '#1d4ed8',
                    50: '#eff6ff',
                    100: '#dbeafe',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                },
                secondary: '#0f172a', // very dark blue/slate
                dark: '#f8fafc',
                'dark-glass': '#ffffff',
                light: '#0f172a', // flipped for light theme
                danger: '#ef4444',
                success: '#10b981',
                'glass-bg': '#ffffff',
                'glass-border': '#e5e7eb',
                gray: {
                    DEFAULT: '#6b7280',
                    light: '#e5e7eb',
                }
            }
        },
    },
    plugins: [],
}
