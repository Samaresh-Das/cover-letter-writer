/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx}",
        "./components/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "#0F172A",
                surface: "#1E293B",
                primary: "#7C3AED",
                primaryLight: "#A78BFA",
                text: "#E2E8F0",
                muted: "#94A3B8",
            },
            boxShadow: {
                card: "0 10px 25px -10px rgba(124,58,237,0.3)",
            },
        },
    },
    plugins: [],
};
