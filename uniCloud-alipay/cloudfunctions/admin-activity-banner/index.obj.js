
module.exports = {
	_before: function () { // 通用预处理器

	},
	async add(params={}){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-activity-banner").add(params);		
	},
	async list(){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let bannerTemp = dbJQL.collection("xxm-activity-banner").orderBy("sort asc").getTemp();
		let userTemp  =dbJQL.collection("uni-id-users").field("_id,nickname").getTemp();
		
		let res = await dbJQL.collection(bannerTemp,userTemp).field("appid,checked,createTime,picurl,sort,target,url,user_id.nickname as nickname,user_id._id as user_id").get();
		let data = res.data.map(item=>({...item,nickname:item.nickname[0],user_id:item.user_id[0]}));
		return {...res,data}
	},
	async remove(ids = []){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-activity-banner")
		.where(`_id in ${JSON.stringify(ids)}`).remove();
	},
	async item(id){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-activity-banner").doc(id)
		.field("appid,checked,createTime,picurl,sort,target,url")
		.get({getOne:true})		
	},
	async update(params={}){
		let {_id,nickname,...data} = params;
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-activity-banner").doc(_id)
		.update({...data})
	}	
}
