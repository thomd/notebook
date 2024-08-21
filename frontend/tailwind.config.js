/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            gridTemplateColumns: {
                page: "1fr 4fr",
            },
            gridTemplateRows: {
                page: "5rem auto 5rem",
                index: "6rem auto 4rem",
                pageedit: "auto 1fr auto",
            },
        },
    },
    plugins: [],
};
