/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            gridTemplateColumns: {
                page: "1fr 5fr",
            },
            gridTemplateRows: {
                page: "5rem auto 4rem",
                index: "6rem auto 4rem",
                "page-edit": "auto 1fr auto",
            },
        },
    },
    plugins: [],
};
