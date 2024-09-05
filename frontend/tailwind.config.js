/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            gridTemplateColumns: {
                page: "350px 4px 1fr",
            },
            gridTemplateRows: {
                page: "5rem auto 5rem",
                index: "6rem auto 4rem",
                pageedit: "auto 1fr auto",
            },
        },
        fontSize: {
            sm: "0.875rem",
            base: "1rem",
            lg: "1.125rem",
            xl: "1.5rem",
            headline: "16rem",
        },
    },
    plugins: [],
};
