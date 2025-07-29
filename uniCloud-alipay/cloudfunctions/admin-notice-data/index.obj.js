// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器

	},
	async add(params={}){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-notice-list").add(params);	
	},
	async list({size=5,current=1}={}){
		size = Math.min(30,size);
		let skip = (current - 1) * size
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		
		let noticeTemp = dbJQL.collection("xxm-notice-list").orderBy("createTime desc")
		.skip(skip).limit(size).getTemp();
		let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp()
		
		return await dbJQL.collection(noticeTemp,userTemp)
		.field("checked,createTime,select,title,view_count,_id,arrayElemAt(user_id.nickname,0) as nickname,arrayElemAt(user_id._id,0) as user_id").get({getCount:true});				
	},
	async item(id=""){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let noticeTemp = dbJQL.collection("xxm-notice-list")
		.where(`_id == "${id}"`).getTemp();
		let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp()
		return await dbJQL.collection(noticeTemp,userTemp)
		.field("checked,createTime,select,content,title,view_count,_id,arrayElemAt(user_id.nickname,0) as nickname").get({getOne:true});			
	},
	async remove(id=''){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-notice-list").doc(id).remove();		
	},
	async update(params={}){
		let {_id,createTime,view_count,nickname,...data} = params;
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-notice-list").doc(_id)
		.update(data)
	}
}
