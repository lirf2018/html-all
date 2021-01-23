module.exports = {
	/* 部署生产环境和开发环境下的URL：可对当前环境进行区分，baseUrl 从 Vue CLI 3.3 起已弃用，要使用publicPath   */
	/* baseUrl: process.env.NODE_ENV === 'production' ? './' : '/'  输出的根路径  默认是/ 如果你的网站是app.com/vue 这更改此配置项 */
	/* publicPath: process.env.NODE_ENV === 'production' ? '/public/' : './', */
	publicPath: './',
	/* 输出文件目录：在npm run build时，生成文件的目录名称 */
	outputDir: 'dist',
	/* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
	assetsDir: "assets",
	/* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
	productionSourceMap: false,
	/* 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存，你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变) */
	filenameHashing: false,
	/* 代码保存时进行eslint检测 */
	lintOnSave: true,
	/* webpack-dev-server 相关配置 */
	devServer: {
		/* 自动打开浏览器 */
		open: false,
		/* 设置为0.0.0.0则所有的地址均能访问 */
		host: 'localhost',
		port: 9909,
		https: false,
		hotOnly: false,
		/* 使用代理 */
		proxy: {
			'/api': {
				/* 目标代理服务器地址 */
				target: 'http://localhost:8082/',
				ws: true, 				//代理websockets
				pathRewrite:{'^/api':''},			//通过pathRewrite重写地址，将前缀/api转为/
				/* 允许跨域 */
				changeOrigin: true
			},
		},
	},
}
