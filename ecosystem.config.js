module.exports = {
	apps: [
		{
			name: "JaPlex",
			script: "./build/index.js",
			watch: true,
			env: {
				NODE_ENV: "production",
			},
		},
	],
};
