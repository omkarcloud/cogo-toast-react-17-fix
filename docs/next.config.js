module.exports = {
	assetPrefix: process.env.NODE_ENV === 'production' ? '/cogo-toast-react-17-fix/' : '',
	env: {
		linkPrefix: process.env.NODE_ENV === 'production' ? '/cogo-toast-react-17-fix/' : '',
	},
	typescript: {
		ignoreDevErrors: true,
		ignoreBuildErrors: true,
	},
};
