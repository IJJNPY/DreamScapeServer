const utils = require("custom-utils");
module.exports = {
	_before:async function () { // 通用预处理器
		utils.useRecord(this)
	},
	
	async list(){			
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-activity-banner").where(`checked == true`)
		.orderBy("sort asc").field("picurl,url,target,appid").get();
	}
	
}
