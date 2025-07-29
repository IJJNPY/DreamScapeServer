const db = uniCloud.database();
const dbCmd = db.command;
const {getData} = require("./hooks.js");
const utils = require("custom-utils");
module.exports = {
	_before: function () { // 通用预处理器
		utils.useRecord(this)
	},
			
	//获取壁纸列表		
	async list({pageSize=9,pageNum=1,classid=""}={}){			
		if(!classid) return {errCode:400,errMsg:"classid必填"};
		pageSize = Math.min(pageSize,20);
		let skip = (pageNum - 1)*pageSize;		
		let wre = {
			checked:true,
			classid
		}		
		return await getData(this,wre,skip,pageSize);				
	},
	
	
	//搜索
	async search({pageSize=9,pageNum=1,keyword=""}={}){
		if(!keyword) return {errCode:400,errMsg:"keyword必填"};
		pageSize = Math.min(pageSize,20);
		let skip = (pageNum - 1)*pageSize;		
		let wre = {
			checked:true,
			$or:[
				{description:{$regex:keyword,$options:'i'}},
				{tabs:{$elemMatch:{$regex:keyword,$options:'i'}}}				
			]			
		}		
		return await getData(this,wre,skip,pageSize);		
	},
	
	
	
	
	
	
	
	//获取一条壁纸
	async item(id=null){
		if(!id) return {errCode:400,errMsg:"id必填"};
				
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		
		let picTemp =  dbJQL.collection("xxm-bizhi-piclist")
		.where(`_id == "${id}" && checked == true`)
		.field(`
		_id,
		checked,
		classid,
		description,
		picurl,
		score,
		tabs,
		user_id,
		view_count
		`).getTemp();
		
		let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp()
		
		let clssTemp = dbJQL.collection("xxm-bizhi-classify").field("_id,name").getTemp()
		
		
		let res = await dbJQL.collection(picTemp,userTemp,clssTemp)
		.field(`
		_id,
		checked,
		classid.name as classname,
		classid._id as classid,
		description,
		picurl,
		score,
		tabs,
		user_id.nickname as nickname,
		view_count
		`)
		.get({getOne:true});
		let data = {...res.data,classname:res.data.classname[0],
		classid:res.data.classid[0],
		nickname:res.data.nickname[0]};		
		return {...res,data};
		
	},

	//增加阅读量
	async addRead(id=null){
		if(!id) return;
		db.collection("xxm-bizhi-piclist").doc(id).update({
			view_count:dbCmd.inc(3)
		})		
	}

}
