let {httpsToCloud}  =  require("custom-utils");
module.exports = {
	_before: function () { // 通用预处理器

	},
	async remove(url){
		let res = await uniCloud.deleteFile({
			fileList:[httpsToCloud(url)]
		})
		console.log(res);
	}
}
