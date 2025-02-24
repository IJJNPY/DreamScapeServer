// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器
		
	},
	
	async list(){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let res = await dbJQL.collection("wallpaper-activity-banner")
		.where(`checked == true`).orderBy("sort asc")
		.field("picurl,url,target,appid").get();
		return res;
	}
	
}
