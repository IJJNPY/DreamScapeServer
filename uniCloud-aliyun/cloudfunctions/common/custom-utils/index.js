module.exports = function(e) {
	httpsToCloud : (str) => {
		return str.replace("https://","cloud://").replace(/\.normal\.cloudstatic\.cn/,'')
	}
}
