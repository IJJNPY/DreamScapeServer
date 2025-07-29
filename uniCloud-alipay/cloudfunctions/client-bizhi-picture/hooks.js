module.exports = {
	async getData(that,wre,skip,pageSize){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:that.getClientInfo()
		})		
		let picTemp =  dbJQL.collection("xxm-bizhi-piclist")
		.where(wre)
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
		`).orderBy("createTime","desc").skip(skip).limit(pageSize).getTemp();		
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
		.get();
		
		let data = res.data.map(item=>({...item,classname:item.classname[0],
		classid:item.classid[0],
		nickname:item.nickname[0]}))
		
		return {...res,data};
		
	},
	demo(){
		return 
	}
}