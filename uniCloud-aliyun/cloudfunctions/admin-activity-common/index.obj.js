// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器

	},
	async bannerAdd(params={}){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("wallpaper-activity-banner").add(params)
	},
	async bannerList(){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("wallpaper-activity-banner").orderBy("sort asc").get();
	},
}
