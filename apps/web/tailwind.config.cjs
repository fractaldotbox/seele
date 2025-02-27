module.exports = {
	content: [
		"./src/**/*.{astro,js,ts,jsx,tsx}",
		// "./node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#000000",
				background: "#f4f6f8",
				text: "#333333",
			},
			fontFamily: {
				sans: ["Inter", "ui-sans-serif", "system-ui"],
			},
		},
	},
	plugins: [],
};
