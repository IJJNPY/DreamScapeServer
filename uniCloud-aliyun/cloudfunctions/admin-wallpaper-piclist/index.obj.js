// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器

	},
	async add(params={}){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("wallpaper-piclist").add(params)
	},
	async list({size=5,current=1}={}){
		size = Math.min(100,size);
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let skip = (current-1)*size;
		let picTemp = dbJQL.collection("wallpaper-piclist").orderBy("createTime desc")
		.skip(skip)
		.limit(size).getTemp();
		let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp();
		let classTemp = dbJQL.collection("wallpaper-classify").field("_id,name").getTemp();
		
		return await dbJQL.collection(picTemp,userTemp,classTemp).field(`
		picurl,
		description,
		score,
		tabs,
		checked,
		createTime,
		classid,
		user_id,
		view_count,
		download_count,
		score_count
		`).get({getCount:true});
	}
}
