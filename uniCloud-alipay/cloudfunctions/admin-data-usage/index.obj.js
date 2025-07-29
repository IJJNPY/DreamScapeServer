const dayjs = require("dayjs");
module.exports = {
	_before: function () { // 通用预处理器

	},	
	async _timing(){
		let time = dayjs().subtract(3,"day").valueOf();
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		dbJQL.setUser({
			role:["admin"]
		})	
		let {data=[]} = await dbJQL.collection("xxm-data-usage")
		.where(`createTime<${time}`).field("_id").get()
		let ids = data.map(item=>item._id);
		return await dbJQL.collection("xxm-data-usage").where(`createTime<${time}`)
		.remove();
	}
}
