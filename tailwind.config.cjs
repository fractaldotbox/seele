module.exports = {
	content: [
		"./src/**/*.{astro,js,ts,jsx,tsx}",
		// "./node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#00ADEF", // Bloomberg blue-ish color
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
