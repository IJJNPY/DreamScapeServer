module.exports = {
	async getData(that,condition,skip,pageSize){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:that.getClientInfo()
		})
		
		let picTemp = dbJQL.collection("wallpaper-piclist")
		.where(condition)
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
	}
}