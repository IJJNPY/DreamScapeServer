// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器

	},
	async list({pageSize=9,pageNum=1,select=false}={}){
		pageSize = Math.min(pageSize,20);
		let skip =(pageNum-1)*pageSize;
		let condition = {enable:true}
		if(select) condition.select = true;
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let classTemp = dbJQL.collection("wallpaper-classify").where(condition).orderBy("sort asc").skip(skip).limit(pageSize).getTemp();
	
		let picTemp = dbJQL.collection("wallpaper-piclist").field("createTime,classid").orderBy("createTime","desc").limit(1).getTemp();
	
		let res = await dbJQL.collection(classTemp,picTemp).field(`
		_id._value as _id,
		name,
		picurl,
		select,
		_id['wallpaper-piclist'].createTime as updateTime`).get({getCount:true});
		
		let data = res.data.map(item=>({...item,updateTime:item.updateTime[0]}))
		return {...res,data}
	}
}
