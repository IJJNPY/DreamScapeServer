// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器

	},
	async add(params={}){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("wallpaper-classify").add(params)
	},
	async list(){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("wallpaper-classify").orderBy("sort asc").get();
	},
	async remove(ids = []){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("wallpaper-classify").where(`_id in ${JSON.stringify(ids)}`).remove()
	},
	async item(id){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("wallpaper-classify").doc(id).field("_id,name,select,sort,enable,picurl").get({getOne:true});
	},
	async update(params={}){
		let {_id,...data} = params;
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("wallpaper-classify").doc(_id).update({...data,createTime:Date.now()});
	}
}
