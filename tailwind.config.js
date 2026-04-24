/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx}",
        "./components/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "#F8F9FA", // Surface
                surface: "#FFFFFF", // Surface Container Lowest
                primary: "#0b57d0", // Material 3 Blue Primary
                primaryLight: "#d3e3fd", // Primary Container
                text: "#1f1f1f", // On Surface
                muted: "#444746", // On Surface Variant
                borderCol: "#C4C7C5", // Outline Variant
            },
            boxShadow: {
                card: "0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)", // M3 Elevation 1
                cardHover: "0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)", // M3 Elevation 2
            },
        },
    },
    plugins: [],
};
