const db = uniCloud.database();
const dbCmd = db.command;
module.exports = {
	_before: function () { // 通用预处理器

	},
	async list({select=false,size=10}){		
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let wre = {checked:true};		
		if(select) wre.select=true;		
		let noticeTemp = dbJQL.collection("xxm-notice-list").where(wre).orderBy("createTime desc")
		.getTemp();
		let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp()	
		return await dbJQL.collection(noticeTemp,userTemp)
		.field("title,_id").get();	
	},
	async item(id){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let noticeTemp = dbJQL.collection("xxm-notice-list").where({_id:id}).orderBy("createTime desc")
		.getTemp();
		let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp();
		db.collection("xxm-notice-list").doc(id).update({
			view_count:dbCmd.inc(3)
		})
		return await dbJQL.collection(noticeTemp,userTemp)
		.field("checked,createTime,select,content,title,view_count,_id,arrayElemAt(user_id.nickname,0) as nickname").get({getOne:true});
	}
	
}
