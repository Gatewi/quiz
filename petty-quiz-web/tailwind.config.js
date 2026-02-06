
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#135bec",
                "primary-hover": "#0e4ac4",
                "background-light": "#f6f6f8",
                "background-dark": "#111318",
                "surface-dark": "#1e232e",
                "surface-darker": "#171b24",
                "text-secondary": "#9da6b9",
                "border-dark": "#282e39"
            },
            fontFamily: {
                "display": ["Lexend", "sans-serif"],
                "body": ["Noto Sans", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "2xl": "1rem",
                "full": "9999px"
            },
            boxShadow: {
                "glow": "0 0 20px -5px rgba(19, 91, 236, 0.3)"
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
