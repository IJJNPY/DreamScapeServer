// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const dbCmd = db.command;
module.exports = {
	_before: function () { // 通用预处理器

	},
	async list({pageSize=9,pageNum=1,classid=""}={}){
		if(!classid) return {errCode:400,errMsg:"classid必须填写"};
		pageSize = Math.min(pageSize,20);
		let skip =(pageNum-1)*pageSize;
		
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		
		let picTemp = dbJQL.collection("wallpaper-piclist")
		.where(`classid == "${classid}" && checked == true`)
		.orderBy("createTime","desc").skip(skip).limit(pageSize).getTemp();
		
		let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp();
		
		let classTemp = dbJQL.collection("wallpaper-classify").field("_id,name").getTemp();
		
		let res = await dbJQL.collection(picTemp,userTemp,classTemp)
		.field(`
		_id,
		checked,
		classid.name as classname,
		description,
		picurl,
		score,
		tabs,
		user_id.nickname as nickname,
		view_count
		`)
		.get();
		
		let data = res.data.map(item=>({...item,classname:item.classname[0],nickname:item.nickname[0]}));
		
		return {...res,data};

	},
	
	async item(id=null){
		if(!id) return {errCode:400,errMsg:"id必须填写"};
		
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		
		let picTemp = dbJQL.collection("wallpaper-piclist")
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
		`)
		.getTemp();
		
		let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp();
		
		let classTemp = dbJQL.collection("wallpaper-classify").field("_id,name").getTemp();
		
		let res = await dbJQL.collection(picTemp,userTemp,classTemp)
		.field(`
		_id,
		checked,
		classid.name as classname,
		description,
		picurl,
		score,
		tabs,
		user_id.nickname as nickname,
		view_count
		`)
		.get({getOne:true});
		
		let data = {...res.data,classname:res.data.classname[0],nickname:res.data.nickname[0]};
		
		return {...res,data};
	
	},
	
	//增加阅读量
	async addRead(id=null){
		if(!id) return {errCode:400,errMsg:"id必须填写"};
		
		db.collection("wallpaper-piclist").doc(id).update({
			view_count:dbCmd.inc(1)
		})
	}
}
