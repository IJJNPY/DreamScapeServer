module.exports = {
	_before: function () { // 通用预处理器

	},
	async add(params={}){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-bizhi-classify").add(params);		
	},
	async list(){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-bizhi-classify")
		.field(`name,picurl,enable,select,sort,user_id,createTime`)
		.orderBy("sort asc").get()
	},	
	async remove(ids = []){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-bizhi-classify")
		.where(`_id in ${JSON.stringify(ids)}`).remove();
	},
	async item(id){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-bizhi-classify").doc(id)
		.field("_id,name,select,sort,enable,picurl")
		.get({getOne:true})		
	},
	async update(params={}){
		let {_id,...data} = params;
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-bizhi-classify").doc(_id)
		.update({...data,createTime:Date.now()})
	}
	
	
}
