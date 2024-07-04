import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    screens: {
			tablet: "768px",
			desktop: "1200px",
		},
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", 
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
}
export default config;
