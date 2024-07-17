/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            gridTemplateColumns: {
                "1fr-5fr": "1fr 5fr",
            },
        },
    },
    plugins: [],
};
